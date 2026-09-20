import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  ListFilter,
  Map,
  Users,
  CheckSquare,
  Flame,
  ShieldAlert,
  Building2,
  FileText,
  ShieldCheck,
  PhoneCall
} from "lucide-react";

export default function Sidebar({
  role = "citizen",
  activeTab,
  setActiveTab,
  onNewGrievance,
  systemAlertsCount = 3,
  pendingCount = 14
}) {
  const citizenNavItems = [
    { id: "overview", label: "Dashboard Overview", labelHi: "डैशबोर्ड विवरण", icon: LayoutDashboard },
    { id: "report", label: "Lodge Grievance", labelHi: "शिकायत दर्ज करें", icon: FilePlus },
    { id: "track", label: "Track Complaints", labelHi: "शिकायत स्थिति", icon: ListFilter, badge: "Live" },
    { id: "map", label: "Ward GIS Map", labelHi: "वार्ड मानचित्र", icon: Map },
    { id: "community", label: "Community Feed", labelHi: "सामुदायिक मुद्दे", icon: Users }
  ];

  const govNavItems = [
    { id: "overview", label: "Executive Command", labelHi: "कार्यकारी समीक्षा", icon: LayoutDashboard },
    { id: "triage", label: "Grievance Triage Queue", labelHi: "शिकायत प्रेषण", icon: CheckSquare, count: pendingCount },
    { id: "heatmap", label: "GIS Heatmap & Geo", labelHi: "जीआईएस हॉटस्पॉट", icon: Flame },
    { id: "predictive", label: "Predictive Civic Defense", labelHi: "पूर्वानुमान अलर्ट", icon: ShieldAlert, alert: true },
    { id: "departments", label: "Department SLA Teams", labelHi: "विभागीय मैट्रिक्स", icon: Building2 },
    { id: "reports", label: "Statutory Audit Reports", labelHi: "ऑडिट रिपोर्ट", icon: FileText }
  ];

  const items = role === "admin" ? govNavItems : citizenNavItems;

  return (
    <aside className="gov-dashboard-sidebar">
      <div className="gov-sidebar-title">
        {role === "admin" ? "EXECUTIVE OFFICER PORTAL" : "CITIZEN SERVICES DIRECTORY"}
      </div>

      <ul className="gov-sidebar-menu">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <li key={item.id}>
              <button
                className={`gov-sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "report" && onNewGrievance) {
                    onNewGrievance();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <span className="sidebar-icon">
                  <IconComponent size={16} />
                </span>
                <div className="sidebar-labels-col">
                  <span className="sidebar-label-en">{item.label}</span>
                  <span className="sidebar-label-hi">{item.labelHi}</span>
                </div>

                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                {item.count && <span className="sidebar-count">{item.count}</span>}
                {item.alert && <span className="sidebar-alert-dot" title="Predictive Anomalies"></span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="gov-sidebar-footer">
        {role === "admin" ? (
          <div className="sidebar-gov-cert flex items-center gap-2">
            <span className="cert-icon text-blue-800">
              <ShieldCheck size={18} />
            </span>
            <div className="cert-text">
              <strong>NIC Certified Intranet</strong>
              <p>Section 65B Digital Evidence Logging Active</p>
            </div>
          </div>
        ) : (
          <div className="sidebar-gov-help flex items-center gap-2">
            <span className="help-icon text-amber-700">
              <PhoneCall size={18} />
            </span>
            <div className="help-text">
              <strong>National Helpline: 1913</strong>
              <p>Toll-free 24x7 Citizen Grievance Assistance</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
