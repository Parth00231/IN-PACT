const mongoose = require("mongoose");
const {
  ISSUE_STATUSES,
  SEVERITY_LEVELS,
  SLA_HOURS_BY_SEVERITY,
} = require("../config/constants");

const issueSchema = new mongoose.Schema(
  {
    // Human-readable reference shown throughout the frontend (e.g. "UP-GND-2026-8091"),
    // distinct from Mongo's internal _id. Generated on creation, see pre-save hook below.
    refId: { type: String, unique: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },

    category: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: "Auto-Routing" },

    severity: {
      type: String,
      enum: SEVERITY_LEVELS,
      default: "medium",
    },
    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: "reported",
    },

    location: {
      address: { type: String, trim: true },
      ward: { type: String, trim: true }, // e.g. "Ward 12, Knowledge Park III" — matches CitizenDashboard's ward-level stats
      lat: { type: Number },
      lng: { type: Number },
    },

    imageUrl: { type: String, default: "" },

    // Who filed it
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nodal officer / field engineer assigned to handle it. Kept as a plain name
    // string for now to match the frontend (CitizenDashboard shows g.assignedOfficer
    // as text like "Er. S.K. Sharma (EE, PWD)"). Revisit as a User ref once officer
    // accounts actually exist and you want to link to a real profile.
    assignedOfficer: { type: String, trim: true, default: "" },

    // Upvotes — store the user IDs so we can derive hasUpvoted per-request
    // instead of trusting a client-supplied boolean/count.
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // AI triage metadata (populate these once the AI/NLP service is wired in;
    // leave null rather than faking a number, unlike the current frontend default)
    aiConfidence: { type: Number, min: 0, max: 100, default: null },
    riskScore: { type: Number, min: 0, max: 100, default: null },

    slaDeadline: { type: Date },

    statusHistory: [
      {
        status: { type: String, enum: ISSUE_STATUSES },
        label: { type: String, trim: true }, // human-readable line, e.g. "Auto-Routed & Assigned to PWD"
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

// Auto-set the SLA deadline based on severity when an issue is first created.
issueSchema.pre("save", function setSlaDeadline(next) {
  if (this.isNew && !this.slaDeadline) {
    const hours = SLA_HOURS_BY_SEVERITY[this.severity] ?? SLA_HOURS_BY_SEVERITY.medium;
    this.slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  next();
});

// Generate a human-readable refId in format "RNYYYYMMDD(A to Z)XXXX" on first save.
// Retries a few times on the (rare) chance of a collision, since it's random-based.
issueSchema.pre("save", async function setRefId(next) {
  if (!this.isNew || this.refId) return next();

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const Issue = this.constructor;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const num = Math.floor(1000 + Math.random() * 9000); // 4-digit positive integer
    const candidate = `RN${year}${month}${day}${letter}${num}`;
    // eslint-disable-next-line no-await-in-loop
    const existing = await Issue.findOne({ refId: candidate }).select("_id");
    if (!existing) {
      this.refId = candidate;
      return next();
    }
  }
  return next(new Error("Could not generate a unique reference ID, please retry"));
});

// Virtual: upvotes count, matching IssueCard.jsx's `upvotes` number prop
issueSchema.virtual("upvotes").get(function upvotesCount() {
  return this.upvotedBy.length;
});

// Virtual: human-readable SLA countdown string, matching what CitizenDashboard.jsx
// displays (e.g. "18 hrs left" / "Resolved in 22 hrs" / "SLA breached").
issueSchema.virtual("slaRemaining").get(function slaRemainingText() {
  if (!this.slaDeadline) return null;

  if (this.status === "resolved") {
    const resolvedAt = this.updatedAt || new Date();
    const hoursTaken = Math.max(
      0,
      Math.round((resolvedAt - this.createdAt) / (1000 * 60 * 60))
    );
    return `Resolved in ${hoursTaken} hrs`;
  }

  const msLeft = this.slaDeadline - new Date();
  if (msLeft <= 0) return "SLA breached";

  const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  return `${hoursLeft} hrs left`;
});

// Virtual: formats statusHistory into the {time, label, done} shape CitizenDashboard.jsx
// expects for its timeline UI, plus the two "Pending" steps still ahead.
issueSchema.virtual("timeline").get(function timelineSteps() {
  const completed = (this.statusHistory || []).map((entry) => ({
    time: entry.changedAt
      ? entry.changedAt.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : "—",
    label: entry.label || `Status updated to ${entry.status}`,
    done: true,
  }));

  if (this.status !== "resolved") {
    completed.push({ time: "Pending", label: "Field Inspection & Resolution", done: false });
    completed.push({ time: "Pending", label: "Citizen Verification & Closure", done: false });
  }

  return completed;
});

issueSchema.set("toJSON", { virtuals: true });
issueSchema.index({ status: 1, severity: 1, category: 1 });
issueSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("Issue", issueSchema);
