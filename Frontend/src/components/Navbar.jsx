import React, { useState, useEffect } from "react";
import { Home, User, Landmark, Search, PhoneCall, Menu, X, FileText, Users, ShieldCheck } from "lucide-react";
import { NationalEmblem } from "./GovEmblem";
import inpactLogo from "../assets/inpact-icon.svg";
import UserMenu from "./UserMenu";

export default function Navbar({ currentPage, navigateTo, currentUser, onLogout }) {
  const [currentDate, setCurrentDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      };
      setCurrentDate(now.toLocaleString("en-IN", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (page) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const handleScrollTo = (id) => {
    if (currentPage !== "home") navigateTo("home");
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="gov-header-wrapper">
      {/* Sleek Tricolor Accent Strip */}
      <div className="gov-tricolor-bar">
        <div className="tri-saffron"></div>
        <div className="tri-white"></div>
        <div className="tri-green"></div>
      </div>

      {/* Main Unified Header */}
      <div className="gov-nav-unified">
        <div className="gov-container nav-unified-inner">
          {/* Brand Left */}
          <div className="brand-unified" onClick={() => handleNavClick("home")} role="button" tabIndex={0}>
            <img src={inpactLogo} alt="IN-PACT emblem" className="brand-logo-img" />
            <div className="brand-titles">
              <div className="brand-row-top">
                <span className="brand-name">IN-PACT</span>
                <span className="brand-tag">GOVT. OF INDIA</span>
              </div>
              <span className="brand-subtitle">Civic Action & Grievance Portal &bull; GNIDA</span>
            </div>
          </div>

          {/* Desktop Nav Links Center */}
          <nav className="nav-links-center hide-tablet">
            <button
              className={`nav-pill ${currentPage === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home")}
            >
              <Home size={14} className="nav-icon" /> Home
            </button>

            <button
              className={`nav-pill ${currentPage === "citizen-dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("citizen-dashboard")}
            >
              <User size={14} className="nav-icon" /> Citizen Portal
            </button>

            <button
              className={`nav-pill ${currentPage === "gov-dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("gov-dashboard")}
            >
              <Landmark size={14} className="nav-icon" /> Officer Console
            </button>

            <button
              className="nav-pill"
              onClick={() => handleScrollTo("tracker-section")}
            >
              <Search size={14} className="nav-icon" /> Track
            </button>

            <button
              className="nav-pill hide-tablet-link"
              onClick={() => handleScrollTo("citizen-charter")}
            >
              Charter
            </button>

            <button
              className="nav-pill hide-tablet-link"
              onClick={() => handleScrollTo("nodal-officers")}
            >
              Nodal Directory
            </button>
          </nav>

          {/* Quick Actions Right */}
          <div className="nav-actions-right">
            <div className="nav-portal-switch hide-mobile">
              <button
                className={`portal-toggle-btn ${currentPage === "citizen-dashboard" ? "active-citizen" : ""}`}
                onClick={() => handleNavClick("citizen-dashboard")}
                title="Open Citizen Grievance Portal"
              >
                Citizen
              </button>
              <button
                className={`portal-toggle-btn ${currentPage === "gov-dashboard" ? "active-gov" : ""}`}
                onClick={() => handleNavClick("gov-dashboard")}
                title="Open Officer Triage Console"
              >
                Officer
              </button>
            </div>

            <div className="helpline-pill hide-mobile">
              <PhoneCall size={12} className="inline mr-1 text-amber-700" />
              <span>1913</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="gov-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="gov-mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="gov-mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img src={inpactLogo} alt="Logo" className="w-5 h-5 rounded" />
                <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Navigation</span>
              </div>
              <button
                className="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="gov-mobile-drawer-body">
              {/* Portal Switcher in Drawer */}
              <div className="mobile-portal-switcher">
                <button
                  className={`mobile-portal-btn ${currentPage === "citizen-dashboard" ? "active-citizen" : ""}`}
                  onClick={() => handleNavClick("citizen-dashboard")}
                >
                  <User size={15} /> Citizen Portal
                </button>
                <button
                  className={`mobile-portal-btn ${currentPage === "gov-dashboard" ? "active-gov" : ""}`}
                  onClick={() => handleNavClick("gov-dashboard")}
                >
                  <Landmark size={15} /> Officer Console
                </button>
              </div>

              <div className="mobile-nav-section-title">Navigation Links</div>
              <div className="mobile-nav-list">
                <button
                  className={`mobile-nav-item ${currentPage === "home" ? "active" : ""}`}
                  onClick={() => handleNavClick("home")}
                >
                  <Home size={16} className="text-slate-600" />
                  <span>Home Page</span>
                </button>

                <button
                  className={`mobile-nav-item ${currentPage === "citizen-dashboard" ? "active" : ""}`}
                  onClick={() => handleNavClick("citizen-dashboard")}
                >
                  <User size={16} className="text-amber-600" />
                  <span>Citizen Portal (Lodge Grievance)</span>
                </button>

                <button
                  className={`mobile-nav-item ${currentPage === "gov-dashboard" ? "active" : ""}`}
                  onClick={() => handleNavClick("gov-dashboard")}
                >
                  <Landmark size={16} className="text-blue-600" />
                  <span>Officer Console (Triage & Ops)</span>
                </button>

                <button
                  className="mobile-nav-item"
                  onClick={() => handleScrollTo("tracker-section")}
                >
                  <Search size={16} className="text-emerald-600" />
                  <span>Track Grievance Status</span>
                </button>

                <button
                  className="mobile-nav-item"
                  onClick={() => handleScrollTo("citizen-charter")}
                >
                  <FileText size={16} className="text-slate-600" />
                  <span>Citizen Charter & SLA</span>
                </button>

                <button
                  className="mobile-nav-item"
                  onClick={() => handleScrollTo("nodal-officers")}
                >
                  <Users size={16} className="text-slate-600" />
                  <span>Nodal Officers Directory</span>
                </button>
              </div>

              {/* Mobile Drawer Footer with Helpline */}
              <div className="mobile-drawer-footer">
                <div className="mobile-helpline-box">
                  <PhoneCall size={18} className="text-amber-700 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-amber-900 text-xs">National Civic Helpline: 1913</div>
                    <div className="text-[11px] text-amber-700">Toll Free &bull; 24x7 Citizen Assistance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
