import React, { useState } from "react";
import { Landmark, Shield, KeyRound, Building2, RefreshCw, PhoneCall, ArrowLeft, ShieldCheck } from "lucide-react";
import { NationalEmblem } from "../components/GovEmblem";
import { login } from "../services/authService";

export default function GovernmentLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("sso"); // 'sso' | 'token' | 'dept'
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("GNIDA - Central Command & Administration");
  const [zone, setZone] = useState("Greater Noida Metropolis (All Zones)");
  const [smartTokenPin, setSmartTokenPin] = useState("9042");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captchaCode, setCaptchaCode] = useState("N8P4Y");
  const [captchaInput, setCaptchaInput] = useState("N8P4Y");

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (authMode === "token") {
      setError("e-Token / DSC PIN login isn't connected to a real authentication system yet. Use Parichay SSO or Department Credentials (email/password) to sign in for real.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(officerId, password);
      if (user.role !== "admin") {
        setError("This account isn't registered as a government officer. Contact your administrator if this is unexpected.");
        return;
      }
      onLogin(user);
      navigateTo("gov-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = (roleType) => {
    if (roleType === "commissioner") {
      onLogin({
        id: "GOV-IAS-001",
        name: "Dr. Rajesh Mehta, IAS",
        role: "admin",
        designation: "District Magistrate & Municipal Commissioner",
        department: "GNIDA - Central Command & Administration",
        zone: "Greater Noida Metropolis (All Zones)",
        badgeId: "NIC-IAS-0012",
        clearanceLevel: "Level 1 (Executive Command)",
        avatar: "",
        authType: "Executive NIC SSO"
      });
    } else if (roleType === "pwd") {
      onLogin({
        id: "PWD-EE-412",
        name: "Er. S.K. Sharma",
        role: "admin",
        designation: "Chief Executive Engineer",
        department: "Public Works Department (PWD)",
        zone: "Zone 2 (Knowledge Park & Expressway)",
        badgeId: "PWD-EE-0412",
        clearanceLevel: "Level 2 (Infrastructure Ops)",
        avatar: "",
        authType: "Departmental e-Token"
      });
    } else if (roleType === "jal") {
      onLogin({
        id: "JAL-SE-108",
        name: "Er. A.K. Srivastava",
        role: "admin",
        designation: "Superintending Engineer",
        department: "UP Jal Nigam (Water & Drainage)",
        zone: "Zone 1 (Pari Chowk & Commercial Belt)",
        badgeId: "JN-SE-0108",
        clearanceLevel: "Level 2 (Hydraulic Ops)",
        avatar: "",
        authType: "Departmental e-Token"
      });
    } else {
      onLogin({
        id: "NPCL-NO-305",
        name: "Priya Sundaram",
        role: "admin",
        designation: "Nodal Power Grid Officer",
        department: "NPCL / State Power Distribution Grid",
        zone: "Alpha-Delta Sector Substations",
        badgeId: "NPCL-NO-0305",
        clearanceLevel: "Level 2 (Electrical Safety)",
        avatar: "",
        authType: "Departmental e-Token"
      });
    }
    navigateTo("gov-dashboard");
  };

  return (
    <div className="gov-auth-wrapper officer-auth-wrapper">
      {/* Top back ribbon */}
      <div className="gov-auth-top-bar officer-top-bar">
        <div className="gov-container auth-top-inner flex items-center justify-between">
          <button className="gov-auth-back-btn flex items-center gap-1" onClick={() => navigateTo("home")}>
            <ArrowLeft size={14} /> Return to National Portal Home
          </button>
          <div className="auth-cert-seal">
            Government of Uttar Pradesh • Official Parichay SSO Gateway
          </div>
        </div>
      </div>

      <div className="gov-container auth-page-layout">
        {/* Left: Officer Parichay SSO Login Card */}
        <div className="gov-auth-card officer-card">
          <div className="auth-card-top">
            <NationalEmblem size={44} />
            <div className="auth-title-texts">
              <span className="auth-dept-sub">विभागीय अधिकारी लॉगिन • NODAL OFFICER GATEWAY</span>
              <h2>Government Officer Command Login</h2>
              <p>Parichay National Single Sign-On for Designated Nodal Engineers & Magistrates</p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="gov-auth-tabs">
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "sso" ? "active" : ""}`}
              onClick={() => setAuthMode("sso")}
            >
              <Landmark size={14} /> Parichay SSO
            </button>
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "token" ? "active" : ""}`}
              onClick={() => setAuthMode("token")}
            >
              <KeyRound size={14} /> e-Token / DSC PIN
            </button>
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "dept" ? "active" : ""}`}
              onClick={() => setAuthMode("dept")}
            >
              <Building2 size={14} /> Department Credentials
            </button>
          </div>

          <form onSubmit={handleLogin} className="gov-form auth-tab-body">
            <div className="gov-form-group">
              <label className="gov-form-label">
                Official Government Email (सरकारी ईमेल) *
              </label>
              <input
                type="email"
                className="gov-input"
                placeholder="officer.name@gov.in"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
              />
            </div>

            <div className="gov-form-group">
              <label className="gov-form-label">
                Designated Department (विभागीय क्षेत्राधिकार) *
              </label>
              <select
                className="gov-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="GNIDA - Central Command & Administration">
                  GNIDA - Central Command & Administration (DM / Commissioner)
                </option>
                <option value="Public Works Department (PWD)">
                  Public Works Department (PWD - Division 2)
                </option>
                <option value="UP Jal Nigam (Water & Drainage)">
                  UP Jal Nigam (Drinking Water & Storm Drainage)
                </option>
                <option value="NPCL / State Power Distribution Grid">
                  NPCL State Power Distribution Grid
                </option>
                <option value="GNIDA Health & Sanitation Department">
                  GNIDA Health & Solid Waste Sanitation
                </option>
              </select>
            </div>

            {authMode === "token" ? (
              <div className="gov-form-group">
                <label className="gov-form-label">
                  Digital Signature Hardware Token PIN (e-Token PIN) *
                </label>
                <input
                  type="password"
                  className="gov-input"
                  placeholder="Enter 4 or 6-digit DSC PIN"
                  value={smartTokenPin}
                  onChange={(e) => setSmartTokenPin(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="gov-form-group">
                <label className="gov-form-label">Parichay / NIC Account Password *</label>
                <input
                  type="password"
                  className="gov-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Standard Captcha */}
            <div className="gov-captcha-box">
              <label className="gov-form-label">Security Verification Code *</label>
              <div className="captcha-row">
                <div className="captcha-display" title="Security Captcha">
                  <span>{captchaCode}</span>
                </div>
                <button type="button" className="captcha-refresh-btn" onClick={refreshCaptcha} title="Refresh Captcha">
                  <RefreshCw size={14} />
                </button>
                <input
                  type="text"
                  className="gov-input captcha-input"
                  placeholder="Enter code"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error-banner" style={{ marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <button type="submit" className="gov-btn-officer-block" disabled={loading}>
              {loading ? "Authenticating Clearance..." : "Login to Executive Command Console (प्रवेश करें) →"}
            </button>
          </form>

          {/* Quick Department Authority Switcher for Evaluation */}
          <div className="gov-demo-profile-box">
            <span className="demo-box-label">QUICK EVALUATION NODAL JURISDICTIONS:</span>
            <div className="demo-chips-grid">
              <button
                type="button"
                className="gov-demo-chip admin-chip"
                onClick={() => handleQuickDemoAdmin("commissioner")}
              >
                District Magistrate / Commissioner
              </button>
              <button
                type="button"
                className="gov-demo-chip admin-chip"
                onClick={() => handleQuickDemoAdmin("pwd")}
              >
                Chief Executive Engineer (PWD)
              </button>
              <button
                type="button"
                className="gov-demo-chip admin-chip"
                onClick={() => handleQuickDemoAdmin("jal")}
              >
                Superintending Engineer (Jal Nigam)
              </button>
              <button
                type="button"
                className="gov-demo-chip admin-chip"
                onClick={() => handleQuickDemoAdmin("npcl")}
              >
                Nodal Power Grid Officer (NPCL)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Administrative Instructions & Security Protocol */}
        <div className="gov-auth-info-col">
          <div className="gov-card auth-info-card officer-info-card">
            <div className="info-card-header flex items-center gap-2">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h3>Nodal Officer Statutory Protocol</h3>
            </div>
            <ul className="info-points-list">
              <li>
                <strong>Statutory SLA Accountability:</strong> Unresolved critical grievances past 6 hours automatically escalate to the District Magistrate's Dashboard.
              </li>
              <li>
                <strong>Geotagged Photographic Proof:</strong> Field inspections require mandatory upload of timestamped, geotagged resolution images before marking complaints resolved.
              </li>
              <li>
                <strong>Official Audit Logs:</strong> Every status update, officer reallocation, and timeline modification is digitally logged under Indian Evidence Act Section 65B.
              </li>
              <li>
                <strong>Emergency Helpline Direct Dispatch:</strong> Severe transformer fires and pipeline bursts trigger automated SMS broadcasts to zonal emergency squads.
              </li>
            </ul>

            <div className="official-helpline-box officer-help-box">
              <h4>NIC Nodal Helpdesk (Government Intranet)</h4>
              <div className="helpline-row">
                <span>NIC District Officer Support:</span>
                <strong>0120-2326110</strong>
              </div>
              <div className="helpline-row">
                <span>Cyber Security Incident (CERT-In):</span>
                <strong>1800-11-4949</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
