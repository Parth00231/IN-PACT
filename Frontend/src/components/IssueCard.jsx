import React from "react";
import { MapPin, Clock, Sparkles, ThumbsUp, Building2, Layers } from "lucide-react";

export default function IssueCard({
  issue,
  onUpvote,
  onSelect,
  showAdminActions = false,
  onStatusChange
}) {
  const {
    id,
    title,
    description,
    category,
    department,
    severity = "medium",
    status = "in_progress",
    location,
    upvotes = 0,
    hasUpvoted = false,
    timestamp,
    imageUrl,
    aiConfidence = 94,
    slaRemaining
  } = issue;

  // `location` is a plain string in older mock data, but the real backend
  // returns an object shaped { address, ward, lat, lng }. Handle both so this
  // component works whether it's fed mock data or live API data.
  const locationText =
    typeof location === "string"
      ? location
      : location?.address || location?.ward || "Location not specified";

  const severityColors = {
    critical: { label: "Critical Priority", class: "severity-critical" },
    high: { label: "High Severity", class: "severity-high" },
    medium: { label: "Moderate", class: "severity-medium" },
    low: { label: "Low Priority", class: "severity-low" }
  };

  const statusLabels = {
    submitted: { text: "AI Triaging", class: "status-submitted" },
    triaged: { text: "Dept Assigned", class: "status-triaged" },
    in_progress: { text: "Work In Progress", class: "status-progress" },
    resolved: { text: "Resolved & Verified", class: "status-resolved" }
  };

  const currentSeverity = severityColors[severity.toLowerCase()] || severityColors.medium;
  const currentStatus = statusLabels[status.toLowerCase()] || statusLabels.in_progress;

  return (
    <div className={`issue-card ${severity.toLowerCase()}`}>
      <div className="issue-card-top">
        <div className="issue-tags">
          <span className={`badge-severity ${currentSeverity.class}`}>
            ● {currentSeverity.label}
          </span>
          <span className="badge-dept flex items-center gap-1">
            <Building2 size={11} />
            {department || "Auto-Routing"}
          </span>
          <span className="badge-cat">{category}</span>
        </div>

        <div className={`status-pill ${currentStatus.class}`}>
          {currentStatus.text}
        </div>
      </div>

      <h4 className="issue-title" onClick={() => onSelect && onSelect(issue)}>
        {title}
      </h4>

      <p className="issue-desc">{description}</p>

      {imageUrl && (
        <div className="issue-image-container">
          <img src={imageUrl} alt="Grievance attachment" className="issue-thumbnail" />
        </div>
      )}

      <div className="issue-meta">
        <div className="meta-item flex items-center gap-1">
          <MapPin size={12} className="text-slate-500" />
          <span className="meta-text">{locationText}</span>
        </div>
        <div className="meta-item flex items-center gap-1">
          <Clock size={12} className="text-slate-500" />
          <span className="meta-text">{timestamp || "Just now"}</span>
        </div>
        {slaRemaining && (
          <div className="meta-item sla-warning flex items-center gap-1">
            <Clock size={12} className="text-amber-600" />
            <span className="meta-text">SLA: {slaRemaining}</span>
          </div>
        )}
      </div>

      <div className="issue-card-footer">
        <div className="ai-trust-badge flex items-center gap-1" title="AI Computer Vision & NLP Model Confidence">
          <Sparkles size={13} className="text-blue-600" /> AI Confidence: <strong>{aiConfidence}%</strong>
        </div>

        <div className="card-actions">
          {onUpvote && (
            <button
              className={`upvote-btn flex items-center gap-1 ${hasUpvoted ? "voted" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(id);
              }}
              title="Endorse this civic issue to increase priority"
            >
              <ThumbsUp size={13} />
              <span>{upvotes}</span>
            </button>
          )}

          {showAdminActions && onStatusChange ? (
            <select
              className="status-select"
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="submitted">Submitted</option>
              <option value="triaged">Triaged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          ) : (
            <button
              className="view-details-btn"
              onClick={() => onSelect && onSelect(issue)}
            >
              View Analysis →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
