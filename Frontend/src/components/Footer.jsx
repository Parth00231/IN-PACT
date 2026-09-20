import React from "react";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUp, 
  Landmark, 
  CheckCircle2, 
  FileText, 
  Users, 
  ExternalLink,
  Activity,
  Globe
} from "lucide-react";
import { NationalEmblem, GovDigitalIndiaBadge } from "./GovEmblem";
import inpactLogo from "../assets/inpact-icon.svg";

export default function Footer({ navigateTo }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (page, anchorId = null) => {
    if (navigateTo) {
      navigateTo(page);
    }
    if (anchorId) {
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <footer className="gov-official-footer" role="contentinfo" aria-label="Official Government Footer">
      {/* Tricolor National Ribbon Accent */}
      <div className="gov-tricolor-bar">
        <div className="tri-saffron"></div>
        <div className="tri-white"></div>
        <div className="tri-green"></div>
      </div>

      {/* Trust & Compliance Pillars Bar */}
      <div className="gov-footer-pillars">
        <div className="gov-container pillars-inner">
          <div className="pillar-item">
            <NationalEmblem size={38} />
            <div>
              <h4>Government of India</h4>
              <p>Ministry of Housing & Urban Affairs (MoHUA)</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <Landmark size={22} className="text-amber-400" />
            </div>
            <div>
              <h4>Government of Uttar Pradesh</h4>
              <p>Greater Noida Industrial Development Authority</p>
            </div>
          </div>

          <div className="pillar-item">
            <GovDigitalIndiaBadge size={32} />
            <div>
              <h4>Digital India Initiative</h4>
              <p>Smart Cities Mission &bull; SIH 2026</p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <ShieldCheck size={22} className="text-emerald-400" />
            </div>
            <div>
              <h4>National Informatics Centre</h4>
              <p>CERT-In Security Audited Platform</p>
            </div>
          </div>

          <div className="pillar-item hide-tablet">
            <div className="pillar-icon-box">
              <CheckCircle2 size={22} className="text-blue-400" />
            </div>
            <div>
              <h4>GIGW 3.0 & STQC</h4>
              <p>Accessibility & Quality Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Enterprise Footer Grid */}
      <div className="gov-footer-main">
        <div className="gov-container footer-main-inner-v2">
          {/* Column 1: Brand & Official Mission */}
          <div className="footer-col-brand-v2">
            <div className="footer-brand-header">
              <img src={inpactLogo} alt="IN-PACT emblem" className="footer-brand-logo" />
              <div>
                <div className="footer-badge-gov">GOVT. OF INDIA &bull; GNIDA</div>
                <h3 className="footer-brand-heading">IN-PACT PORTAL</h3>
                <span className="footer-motto-hi">सत्यमेव जयते &bull; Civic Governance</span>
              </div>
            </div>

            <p className="footer-desc-v2">
              Integrated National Public Action & Grievance Redressal System. An automated, multi-modal civic intelligence platform providing transparent, closed-loop grievance resolution and predictive infrastructure monitoring.
            </p>

            <div className="footer-contact-stack">
              <div className="footer-contact-row">
                <MapPin size={15} className="footer-c-icon text-amber-400 flex-shrink-0" />
                <span>GNIDA Administrative Complex, Plot 01, Knowledge Park IV, Greater Noida, UP - 201308</span>
              </div>
              <div className="footer-contact-row">
                <Mail size={15} className="footer-c-icon text-blue-400 flex-shrink-0" />
                <span>pg-cell@gnida.in &bull; support@inpact.gov.in</span>
              </div>
              <div className="footer-contact-row">
                <PhoneCall size={15} className="footer-c-icon text-emerald-400 flex-shrink-0" />
                <span>Toll Free Helpdesk: <strong>1800-180-0101</strong> / <strong>1913</strong></span>
              </div>
            </div>
          </div>

          {/* Column 2: Citizen Redressal */}
          <div className="footer-col-links-v2">
            <h4 className="footer-col-title">
              <span className="title-bar"></span> Citizen Redressal
            </h4>
            <ul className="footer-links-list">
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("citizen-login")}>
                  Lodge Grievance (AI Smart Form)
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("home", "tracker-section")}>
                  Track Grievance Status
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("citizen-dashboard")}>
                  Citizen Action Portal
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("home", "citizen-charter")}>
                  Citizen Charter & SLA Timelines
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("home", "nodal-officers")}>
                  Nodal Grievance Directory
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("citizen-dashboard")}>
                  Download Acknowledgement Slip
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Administrative & Operations */}
          <div className="footer-col-links-v2">
            <h4 className="footer-col-title">
              <span className="title-bar"></span> Administration
            </h4>
            <ul className="footer-links-list">
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-login")}>
                  Officer Parichay SSO Login
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-dashboard")}>
                  Executive Triage & Telemetry
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-dashboard")}>
                  GIS Spatial Heatmap Console
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-dashboard")}>
                  Department SLA Scorecards
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-dashboard")}>
                  Predictive Pre-Monsoon Alerts
                </button>
              </li>
              <li>
                <button className="footer-link-btn" onClick={() => handleNav("gov-dashboard")}>
                  Evidence Audit & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Statutory, Policy & Compliance */}
          <div className="footer-col-links-v2">
            <h4 className="footer-col-title">
              <span className="title-bar"></span> Policy & Compliance
            </h4>
            <ul className="footer-links-list">
              <li><span className="footer-policy-item">Hyperlink Policy</span></li>
              <li><span className="footer-policy-item">Privacy & Data Protection Policy</span></li>
              <li><span className="footer-policy-item">Terms of Service & Disclaimer</span></li>
              <li><span className="footer-policy-item">CERT-In Security Compliance</span></li>
              <li><span className="footer-policy-item">Accessibility Statement (GIGW 3.0)</span></li>
              <li><span className="footer-policy-item">Copyright & Content Policy</span></li>
            </ul>
          </div>

          {/* Column 5: 24x7 Hotlines & Live Status Card */}
          <div className="footer-col-action-v2">
            <h4 className="footer-col-title">
              <span className="title-bar"></span> Emergency Helplines
            </h4>

            <div className="footer-hotline-card">
              <div className="hotline-card-top">
                <PhoneCall size={20} className="text-amber-400" />
                <div>
                  <div className="hotline-card-number">1913</div>
                  <div className="hotline-card-label">Civic Control Room (24x7)</div>
                </div>
              </div>
              <div className="hotline-tags">
                <span className="hotline-badge">Toll Free</span>
                <span className="hotline-badge">Emergency Triage</span>
              </div>
            </div>

            <div className="footer-secondary-hotlines">
              <div className="sec-hotline-row">
                <span>National Emergency:</span>
                <strong>112</strong>
              </div>
              <div className="sec-hotline-row">
                <span>Women Helpline:</span>
                <strong>1091</strong>
              </div>
              <div className="sec-hotline-row">
                <span>CM Helpline (UP):</span>
                <strong>1076</strong>
              </div>
            </div>

            <div className="footer-system-status">
              <span className="status-live-dot"></span>
              <span>All Civic Services Operational</span>
            </div>

            <button 
              className="back-to-top-btn" 
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
            >
              <ArrowUp size={14} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Compliance & Web Manager Bar */}
      <div className="gov-footer-bottom-v2">
        <div className="gov-container footer-bottom-inner-v2">
          <div className="bottom-meta-left">
            <p className="bottom-mgmt-text">
              Website Content Managed & Owned by <strong>Greater Noida Industrial Development Authority (GNIDA) & MoHUA, Govt. of India</strong>
            </p>
            <p className="bottom-nic-text">
              Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong> &bull; Version 2.4.0 (2026)
            </p>
          </div>

          <div className="bottom-meta-right">
            <div className="compliance-chips">
              <span className="compliance-chip">STQC Certified</span>
              <span className="compliance-chip">WCAG 2.1 AA</span>
              <span className="compliance-chip">CERT-In Audited</span>
            </div>

            <div className="visitor-count-box-v2">
              <span className="v-label">Verified Hits:</span>
              <span className="v-num">1,482,930</span>
            </div>

            <div className="last-updated-text">
              Last Updated: <strong>20 Sep 2026</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
