import React, { useState, useEffect } from "react";
import { NationalEmblem } from "./GovEmblem";
import inpactLogo from "../assets/inpact-icon.svg";
import UserMenu from "./UserMenu";

export default function Navbar({ currentPage, navigateTo, currentUser, onLogout }) {
  const [currentDate, setCurrentDate] = useState("");
  const [lang, setLang] = useState("EN");
  const [fontSize, setFontSize] = useState("normal");
  const [highContrast, setHighContrast] = useState(false);
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

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === "small") root.style.fontSize = "14px";
    else if (size === "large") root.style.fontSize = "18px";
    else root.style.fontSize = "16px";
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("gov-high-contrast");
  };

  const handleNavClick = (page) => {
    navigateTo(page);
    setMobileMenuOpen(false);
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

          {/* Nav Links Center */}
          <nav className={`nav-links-center ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <button
              className={`nav-pill ${currentPage === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home")}
            >
              <span className="nav-icon">🏠</span> Home
            </button>

            <button
              className={`nav-pill ${currentPage === "citizen-dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("citizen-dashboard")}
            >
              <span className="nav-icon">👤</span> Citizen Portal
            </button>

            <button
              className={`nav-pill ${currentPage === "gov-dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("gov-dashboard")}
            >
              <span className="nav-icon">🏛️</span> Officer Console
            </button>

            <button
              className="nav-pill"
              onClick={() => {
                if (currentPage !== "home") navigateTo("home");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById("tracker-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <span className="nav-icon">🔍</span> Track
            </button>

            <button
              className="nav-pill hide-tablet-link"
              onClick={() => {
                if (currentPage !== "home") navigateTo("home");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById("citizen-charter")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              Charter
            </button>

            <button
              className="nav-pill hide-tablet-link"
              onClick={() => {
                if (currentPage !== "home") navigateTo("home");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById("nodal-officers")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              Nodal Directory
            </button>
          </nav>

          {/* Quick Actions Right */}
          <div className="nav-actions-right">
            <div className="nav-portal-switch">
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
              <span className="helpline-dot"></span>
              <span>1913</span>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span>{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
