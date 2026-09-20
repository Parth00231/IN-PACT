import React, { useState } from "react";
import { MapPin, Layers, Flame, X, AlertTriangle, Construction, Droplets, Zap } from "lucide-react";

export default function MapView({
  issues = [],
  onSelectIssue,
  selectedLocation,
  city = "Greater Noida"
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("pins"); // pins | heatmap
  const [selectedPin, setSelectedPin] = useState(null);

  const defaultMarkers = [
    {
      id: "G-101",
      title: "Severe Waterlogging & Drain Choke",
      category: "Drainage & Water",
      department: "Jal Nigam",
      severity: "critical",
      top: "28%",
      left: "32%",
      zone: "Pari Chowk Junction",
      riskScore: 92,
      reports: 28,
      status: "in_progress"
    },
    {
      id: "G-102",
      title: "Multiple Deep Potholes causing accidents",
      category: "Roads & Infrastructure",
      department: "PWD",
      severity: "high",
      top: "45%",
      left: "58%",
      zone: "Knowledge Park III",
      riskScore: 84,
      reports: 19,
      status: "triaged"
    },
    {
      id: "G-103",
      title: "High Voltage Transformer Sparking",
      category: "Electricity",
      department: "NPCL / Power Board",
      severity: "critical",
      top: "65%",
      left: "24%",
      zone: "Alpha 1 Commercial Belt",
      riskScore: 96,
      reports: 41,
      status: "in_progress"
    },
    {
      id: "G-104",
      title: "Garbage Dump Overflow & Stray Animals",
      category: "Sanitation",
      department: "GNIDA Sanitation",
      severity: "medium",
      top: "38%",
      left: "76%",
      zone: "Delta 2 Residential",
      riskScore: 65,
      reports: 12,
      status: "submitted"
    },
    {
      id: "G-105",
      title: "Dead Streetlights along 2km stretch",
      category: "Electricity",
      department: "NPCL / Power Board",
      severity: "medium",
      top: "72%",
      left: "68%",
      zone: "Sector Beta 1",
      riskScore: 58,
      reports: 9,
      status: "resolved"
    },
    {
      id: "G-106",
      title: "Main Pipeline Burst - Clean Water Waste",
      category: "Water Supply",
      department: "Jal Nigam",
      severity: "high",
      top: "52%",
      left: "42%",
      zone: "Gamma 2 Sector Road",
      riskScore: 81,
      reports: 15,
      status: "in_progress"
    }
  ];

  const displayMarkers = issues.length > 0
    ? issues.map((iss, idx) => ({
        ...iss,
        top: `${30 + ((idx * 17) % 55)}%`,
        left: `${20 + ((idx * 23) % 65)}%`
      }))
    : defaultMarkers;

  const filteredMarkers = displayMarkers.filter((m) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "critical") return m.severity === "critical";
    if (activeFilter === "roads") return m.category?.toLowerCase().includes("road");
    if (activeFilter === "water") return m.category?.toLowerCase().includes("water") || m.category?.toLowerCase().includes("drain");
    if (activeFilter === "power") return m.category?.toLowerCase().includes("electric") || m.category?.toLowerCase().includes("power");
    return true;
  });

  const getPinColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "resolved": return "#10b981";
      default: return "#3b82f6";
    }
  };

  return (
    <div className="map-view-container">
      {/* Map Control Toolbar */}
      <div className="map-toolbar">
        <div className="map-city-badge flex items-center gap-1.5">
          <span className="pulse-dot-green"></span>
          <strong>{city} GIS Grid</strong>
          <span className="zone-count">{filteredMarkers.length} Active Incidents</span>
        </div>

        <div className="map-filter-group">
          <button
            className={`map-filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Issues
          </button>
          <button
            className={`map-filter-btn ${activeFilter === "critical" ? "active" : ""}`}
            onClick={() => setActiveFilter("critical")}
          >
            Critical Only
          </button>
          <button
            className={`map-filter-btn ${activeFilter === "roads" ? "active" : ""}`}
            onClick={() => setActiveFilter("roads")}
          >
            Roads
          </button>
          <button
            className={`map-filter-btn ${activeFilter === "water" ? "active" : ""}`}
            onClick={() => setActiveFilter("water")}
          >
            Water & Drain
          </button>
          <button
            className={`map-filter-btn ${activeFilter === "power" ? "active" : ""}`}
            onClick={() => setActiveFilter("power")}
          >
            Power
          </button>
        </div>

        <div className="map-toggle-view">
          <button
            className={`toggle-btn flex items-center gap-1 ${viewMode === "pins" ? "active" : ""}`}
            onClick={() => setViewMode("pins")}
          >
            <MapPin size={13} /> Markers
          </button>
          <button
            className={`toggle-btn flex items-center gap-1 ${viewMode === "heatmap" ? "active" : ""}`}
            onClick={() => setViewMode("heatmap")}
          >
            <Flame size={13} /> Heatmap
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className={`interactive-map-canvas ${viewMode === "heatmap" ? "heatmap-mode" : ""}`}>
        {/* Futuristic Map Grid & Vector Roads */}
        <div className="map-grid-layer"></div>
        <div className="vector-road road-expressway">
          <span className="road-label">Noida-Gr. Noida Expressway</span>
        </div>
        <div className="vector-road road-arterial-1"></div>
        <div className="vector-road road-arterial-2"></div>
        <div className="vector-circle roundabout-1">
          <span className="roundabout-label">Pari Chowk</span>
        </div>
        <div className="vector-circle roundabout-2">
          <span className="roundabout-label">Delta Roundabout</span>
        </div>

        {/* Heatmap Layer Overlays */}
        {viewMode === "heatmap" && (
          <div className="heatmap-overlay-layer">
            <div className="heat-bubble heat-critical" style={{ top: "25%", left: "30%", width: "180px", height: "180px" }}></div>
            <div className="heat-bubble heat-high" style={{ top: "42%", left: "55%", width: "160px", height: "160px" }}></div>
            <div className="heat-bubble heat-critical" style={{ top: "62%", left: "22%", width: "140px", height: "140px" }}></div>
            <div className="heat-bubble heat-medium" style={{ top: "35%", left: "74%", width: "120px", height: "120px" }}></div>
          </div>
        )}

        {/* Incident Pins */}
        {filteredMarkers.map((marker) => {
          const isSelected = selectedPin?.id === marker.id;
          const pinColor = getPinColor(marker.severity);

          return (
            <div
              key={marker.id}
              className={`gis-pin ${marker.severity} ${isSelected ? "selected-pin" : ""}`}
              style={{ top: marker.top, left: marker.left }}
              onClick={() => {
                setSelectedPin(marker);
                if (onSelectIssue) onSelectIssue(marker);
              }}
            >
              <div className="pin-pulse" style={{ borderColor: pinColor }}></div>
              <div className="pin-core" style={{ backgroundColor: pinColor }}>
                {marker.severity === "critical" ? "!" : "•"}
              </div>
              <div className="pin-label-tag">
                {marker.zone || marker.location || marker.id}
              </div>
            </div>
          );
        })}

        {/* Pin Selected Popover Card */}
        {selectedPin && (
          <div className="map-popup-card" style={{ top: selectedPin.top, left: selectedPin.left }}>
            <div className="popup-header">
              <span className={`popup-severity ${selectedPin.severity}`}>
                {selectedPin.severity?.toUpperCase()} PRIORITY
              </span>
              <button className="popup-close-btn" onClick={() => setSelectedPin(null)}>
                <X size={14} />
              </button>
            </div>
            <h5 className="popup-title">{selectedPin.title}</h5>
            <div className="popup-meta">
              <span>{selectedPin.zone || selectedPin.location}</span>
              <span>{selectedPin.department}</span>
              <span>{selectedPin.reports || 1} Reports</span>
            </div>
            <div className="popup-actions">
              <button
                className="popup-inspect-btn"
                onClick={() => {
                  if (onSelectIssue) onSelectIssue(selectedPin);
                  setSelectedPin(null);
                }}
              >
                Inspect AI Analysis →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Intelligence Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot critical"></span> Critical AI Severity (Immediate Action)
        </div>
        <div className="legend-item">
          <span className="legend-dot high"></span> High Recurrence Risk
        </div>
        <div className="legend-item">
          <span className="legend-dot medium"></span> Moderate / Standard SLA
        </div>
        <div className="legend-item">
          <span className="legend-dot resolved"></span> Verified Resolved
        </div>
      </div>
    </div>
  );
}
