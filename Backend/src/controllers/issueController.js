const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const asyncHandler = require("../middleware/asyncHandler");
const { ISSUE_STATUSES, DEPARTMENTS } = require("../config/constants");
const { assignDepartment, isValidDepartmentCode } = require("../utils/autoRoute");

// @route  GET /api/issues
// @query  status, severity, category, department, lat, lng, radiusKm, refId, search, page, limit
// @access Public (citizens see all; admins may later get extra fields)
const getIssues = asyncHandler(async (req, res) => {
  const { status, severity, category, department, ward, refId, search, mine, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (category) filter.category = category;
  if (department) filter.department = department;
  if (ward) filter["location.ward"] = ward;
  if (refId) filter.refId = new RegExp(`^${refId.trim()}$`, "i");
  if (search) {
    const q = search.trim();
    filter.$or = [
      { refId: new RegExp(q, "i") },
      { title: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
    ];
  }

  // ?mine=true — used by CitizenDashboard.jsx's "My Grievances" tab. Requires auth
  // (optionalAuth still lets the route be public, but this filter only works
  // for a logged-in user, since it needs req.user).
  if (mine === "true") {
    if (!req.user) {
      res.status(401);
      throw new Error("Login required to view your own grievances");
    }
    filter.reportedBy = req.user._id;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("reportedBy", "name ward"),
    Issue.countDocuments(filter),
  ]);

  // Derive hasUpvoted per-request from the logged-in user, rather than
  // trusting anything the client sends — matches IssueCard.jsx's hasUpvoted prop.
  const userId = req.user?._id?.toString();
  const payload = issues.map((issue) => ({
    ...issue.toJSON(),
    hasUpvoted: userId ? issue.upvotedBy.some((id) => id.toString() === userId) : false,
  }));

  res.json({
    success: true,
    count: payload.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    issues: payload,
  });
});

// @route  GET /api/issues/:id
// @access Public (supports Mongo _id or custom Reference ID e.g. RN20260920A4819)
const getIssueById = asyncHandler(async (req, res) => {
  const query = req.params.id;
  const isMongoId = mongoose.Types.ObjectId.isValid(query) && query.length === 24;
  const issue = isMongoId
    ? await Issue.findById(query).populate("reportedBy", "name ward")
    : await Issue.findOne({ refId: new RegExp(`^${query.trim()}$`, "i") }).populate("reportedBy", "name ward");

  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const userId = req.user?._id?.toString();
  res.json({
    success: true,
    issue: {
      ...issue.toJSON(),
      hasUpvoted: userId ? issue.upvotedBy.some((id) => id.toString() === userId) : false,
    },
  });
});

// @route  POST /api/issues
// @access Private (citizen)
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, severity, location, imageUrl } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Title, description, and category are required");
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    severity,
    location,
    imageUrl,
    department: assignDepartment({ category, title, description }),
    reportedBy: req.user._id,
    statusHistory: [
      {
        status: "reported",
        label: "Complaint Registered via Citizen Portal",
        changedBy: req.user._id,
      },
    ],
  });

  res.status(201).json({ success: true, issue });
});

// @route  PATCH /api/issues/:id/status
// @access Private (admin only)
// body: { status, note, label, assignedOfficer, department }
// - `label` is the human-readable timeline entry shown to the citizen
//   (e.g. "Auto-Routed & Assigned to PWD Executive Engineer"). Falls back to a
//   generic message built from `status` if omitted.
// - `assignedOfficer` is optional and only updates the field when provided.
// - `department` is optional — lets an officer manually correct a mis-routed
//   issue (auto-routing at creation is simple keyword matching, not perfect).
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status, note, label, assignedOfficer, department } = req.body;

  if (!ISSUE_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${ISSUE_STATUSES.join(", ")}`);
  }

  if (department !== undefined && !isValidDepartmentCode(department)) {
    res.status(400);
    throw new Error(`Department must be one of: ${DEPARTMENTS.map((d) => d.code).join(", ")}`);
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  issue.status = status;
  if (assignedOfficer !== undefined) issue.assignedOfficer = assignedOfficer;
  if (department !== undefined) issue.department = department;
  issue.statusHistory.push({
    status,
    label: label || `Status updated to ${status.replace(/_/g, " ")}`,
    changedBy: req.user._id,
    note,
  });
  await issue.save();

  res.json({ success: true, issue });
});

// @route  POST /api/issues/:id/upvote
// @access Private (citizen) — toggles upvote on/off for the logged-in user
const toggleUpvote = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const userId = req.user._id.toString();
  const alreadyUpvoted = issue.upvotedBy.some((id) => id.toString() === userId);

  if (alreadyUpvoted) {
    issue.upvotedBy = issue.upvotedBy.filter((id) => id.toString() !== userId);
  } else {
    issue.upvotedBy.push(req.user._id);
  }

  await issue.save();

  res.json({
    success: true,
    upvotes: issue.upvotedBy.length,
    hasUpvoted: !alreadyUpvoted,
  });
});

// @route  GET /api/issues/stats
// @query  ward (optional) — when provided, also returns a resolution rate scoped
//         to that ward, matching CitizenDashboard.jsx's "Ward N Resolution Rate" card.
// @access Private (admin) — powers the StatCard widgets on the gov dashboard
const getIssueStats = asyncHandler(async (req, res) => {
  const { ward } = req.query;

  const [totalActive, critical, resolvedThisMonth, byStatus] = await Promise.all([
    Issue.countDocuments({ status: { $ne: "resolved" } }),
    Issue.countDocuments({ severity: "critical", status: { $ne: "resolved" } }),
    Issue.countDocuments({
      status: "resolved",
      updatedAt: { $gte: new Date(new Date().setDate(1)) },
    }),
    Issue.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const stats = {
    totalActive,
    critical,
    resolvedThisMonth,
    byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
  };

  if (ward) {
    const [wardTotal, wardResolved] = await Promise.all([
      Issue.countDocuments({ "location.ward": ward }),
      Issue.countDocuments({ "location.ward": ward, status: "resolved" }),
    ]);
    stats.ward = {
      name: ward,
      resolutionRate: wardTotal > 0 ? Number(((wardResolved / wardTotal) * 100).toFixed(1)) : null,
    };
  }

  res.json({ success: true, stats });
});

// @route  GET /api/issues/stats/departments
// @access Private (admin) — powers the "Inter-Departmental SLA Compliance
// Scorecard" table on GovernmentDashboard.jsx (Tab 1: Overview). Replaces the
// currently hardcoded table rows with real aggregated data.
const getDepartmentStats = asyncHandler(async (req, res) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const rows = await Promise.all(
    DEPARTMENTS.map(async ({ code, label }) => {
      const [activeLoad, disposed24h, resolvedTotal, resolvedIssues] = await Promise.all([
        Issue.countDocuments({ department: code, status: { $ne: "resolved" } }),
        Issue.countDocuments({ department: code, status: "resolved", updatedAt: { $gte: oneDayAgo } }),
        Issue.countDocuments({ department: code, status: "resolved" }),
        // Only need slaDeadline/updatedAt to compute compliance, keep the payload light
        Issue.find({ department: code, status: "resolved" }).select("slaDeadline updatedAt"),
      ]);

      const compliantCount = resolvedIssues.filter(
        (issue) => issue.slaDeadline && issue.updatedAt && issue.updatedAt <= issue.slaDeadline
      ).length;

      return {
        code,
        label,
        activeLoad,
        disposed24h,
        slaCompliance: resolvedTotal > 0 ? Number(((compliantCount / resolvedTotal) * 100).toFixed(1)) : null,
      };
    })
  );

  res.json({ success: true, departments: rows });
});

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  toggleUpvote,
  getIssueStats,
  getDepartmentStats,
};
