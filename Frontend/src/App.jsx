import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CitizenLogin from "./pages/CitizenLogin";
import GovernmentLogin from "./pages/GovernmentLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import { NationalEmblem, GovDigitalIndiaBadge } from "./components/GovEmblem";
import { getToken } from "./services/api";
import { getMe, logout as clearAuth } from "./services/authService";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  // Auth bypassed for open demo access — no session blocking
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          clearAuth();
        });
    }
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      navigateTo("gov-dashboard");
    } else {
      navigateTo("citizen-dashboard");
    }
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    navigateTo("home");
  };

  // Fallback demo users for instant access without login
  const effectiveUser =
    currentUser ||
    (currentPage === "gov-dashboard"
      ? {
        id: "GOV-IAS-001",
        name: "Dr. Rajesh Mehta, IAS",
        role: "admin",
        designation: "District Magistrate & Municipal Commissioner",
        department: "GNIDA - Central Command & Administration",
        zone: "Greater Noida Metropolis HQ",
        avatar: ""
      }
      : {
        id: "CIT-UP-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Knowledge Park, Greater Noida",
        avatar: ""
      });

  return (
    <div className="app-root gov-theme-app">
      {/* Top Main Government Navbar */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Routing */}
      <main className="main-content">
        {currentPage === "home" && <Home navigateTo={navigateTo} />}

        {currentPage === "citizen-login" && (
          <CitizenLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "gov-login" && (
          <GovernmentLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "citizen-dashboard" && (
          <CitizenDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "gov-dashboard" && (
          <GovernmentDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* Official Government Footer on Public Pages */}
      {(currentPage === "home" ||
        currentPage === "citizen-login" ||
        currentPage === "gov-login") && (
          <footer className="gov-official-footer">
            {/* Top Footer Pillars Bar */}
            <div className="gov-footer-pillars">
              <div className="gov-container pillars-inner">
                <div className="pillar-item">
                  <NationalEmblem size={40} />
                  <div>
                    <h4>Government of India</h4>
                    <p>Ministry of Housing & Urban Affairs (MoHUA)</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-seal"></div>
                  <div>
                    <h4>Government of Uttar Pradesh</h4>
                    <p>Greater Noida Industrial Development Authority (GNIDA)</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <GovDigitalIndiaBadge size={32} />
                  <div>
                    <h4>Digital India Initiative</h4>
                    <p>Smart Cities Mission • SIH 2026</p>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-seal"></div>
                  <div>
                    <h4>National Informatics Centre (NIC)</h4>
                    <p>CERT-In Security Audited e-Governance Platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Footer Links & Directory */}
            <div className="gov-footer-main">
              <div className="gov-container footer-main-inner">
                <div className="footer-col-brand">
                  <div className="footer-brand-title">
                    <span className="brand-badge-gov">GOVT. OF INDIA</span>
                    <h3>IN-PACT PORTAL</h3>
                  </div>
                  <p className="footer-desc">
                    Integrated National Public Action & Grievance Redressal System. An automated, multi-modal public grievance ingestion and predictive civic triaging portal compliant with national e-governance service delivery standards.
                  </p>
                  <div className="footer-contact-info">
                    <div><strong>Nodal Helpdesk:</strong> 1800-180-0101 / 1913</div>
                    <div><strong>Email:</strong> pg-cell@gnida.in</div>
                    <div><strong>Address:</strong> GNIDA Administrative Complex, Plot No. 01, Knowledge Park IV, Greater Noida, UP - 201308</div>
                  </div>
                </div>

                <div className="footer-col-links">
                  <h4>Citizen Redressal</h4>
                  <ul>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("citizen-login")}>Lodge a Grievance</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("citizen-dashboard")}>Track Grievance Status</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("citizen-dashboard")}>Download Acknowledgement Slip</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("citizen-dashboard")}>Citizen Charter & SLAs</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("citizen-login")}>DigiLocker KYC Verification</button></li>
                  </ul>
                </div>

                <div className="footer-col-links">
                  <h4>Administrative Portal</h4>
                  <ul>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("gov-login")}>Officer Parichay SSO</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("gov-dashboard")}>Executive Triage Console</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("gov-dashboard")}>GIS Infrastructure Telemetry</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("gov-dashboard")}>Department SLA Scorecard</button></li>
                    <li><button className="footer-text-btn" onClick={() => navigateTo("gov-dashboard")}>Predictive Pre-Monsoon Alerts</button></li>
                  </ul>
                </div>

                <div className="footer-col-links">
                  <h4>Statutory & Policy Links</h4>
                  <ul>
                    <li><span>Hyperlink Policy</span></li>
                    <li><span>Privacy Policy</span></li>
                    <li><span>Terms & Conditions</span></li>
                    <li><span>Disclaimer & Copyright</span></li>
                    <li><span>Accessibility Statement</span></li>
                    <li><span>Help & FAQ Directory</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Compliance & Web Manager Bar */}
            <div className="gov-footer-bottom">
              <div className="gov-container footer-bottom-inner">
                <div className="bottom-left">
                  <p>
                    Website Content Managed by <strong>Ministry of Housing & Urban Affairs & GNIDA, Govt. of India</strong>
                  </p>
                  <p className="designed-by-nic">
                    Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>
                  </p>
                </div>

                <div className="bottom-right">
                  <div className="visitor-count-box">
                    <span className="v-label">Total Visitors:</span>
                    <span className="v-num">1,482,930</span>
                  </div>
                  <div className="last-updated">
                    Last Updated: <strong>20 Aug 2026</strong>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
    </div>
  );
}

export default App;
