import React, { useState } from "react";
import { Lock, RefreshCw, CheckCircle2, ShieldCheck, FileText, PhoneCall, Sparkles, UserPlus } from "lucide-react";
import { NationalEmblem } from "../components/GovEmblem";
import { register } from "../services/authService";

const POPULAR_WARDS = [
  "Ward 12, Knowledge Park III, Greater Noida",
  "Ward 5, Sector Alpha 1, Greater Noida",
  "Ward 8, Sector Beta 2, Greater Noida",
  "Ward 9, Sector Delta 2, Greater Noida",
  "Ward 3, Sector Gamma 1, Greater Noida",
  "Ward 14, Pari Chowk Metro Belt, Greater Noida",
  "Ward 16, Ecotech Industrial Zone, Greater Noida",
  "Other / Custom Locality",
];

export default function CitizenRegister({ onLogin, navigateTo }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ward: POPULAR_WARDS[0],
    customWard: "",
    phone: "",
    termsAgreed: true,
  });

  const [captchaCode, setCaptchaCode] = useState("K9X4M");
  const [captchaInput, setCaptchaInput] = useState("K9X4M");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Quick live demo pre-fill
  const fillSampleCitizen = (sampleName, sampleWard, sampleEmail) => {
    setFormData({
      name: sampleName,
      email: sampleEmail,
      password: "Password@123",
      confirmPassword: "Password@123",
      ward: sampleWard,
      customWard: "",
      phone: "98765" + Math.floor(10000 + Math.random() * 90000),
      termsAgreed: true,
    });
    setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your full legal name as per government ID.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter identical passwords.");
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
      setError("Security Captcha verification failed. Please enter the correct code.");
      refreshCaptcha();
      return;
    }

    if (!formData.termsAgreed) {
      setError("You must agree to the Statutory Grievance Declaration & Citizen Charter terms.");
      return;
    }

    const resolvedWard =
      formData.ward === "Other / Custom Locality"
        ? formData.customWard.trim() || "Greater Noida Metropolis"
        : formData.ward;

    setLoading(true);
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        ward: resolvedWard,
        phone: formData.phone.trim() || undefined,
      });

      setSuccessMsg("Account successfully registered under UP Public Services Delivery System.");
      setTimeout(() => {
        onLogin(result.user);
      }, 700);
    } catch (err) {
      setError(err.message || "Registration failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Evaluator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "#CBD5E1" };
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) s++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) s++;
    if (s === 1) return { score: 1, label: "Basic", color: "#EF4444" };
    if (s === 2) return { score: 2, label: "Medium", color: "#F59E0B" };
    return { score: 3, label: "Strong", color: "#10B981" };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="gov-auth-container">
      {/* Official Government Top Security Header */}
      <div className="gov-security-banner">
        <div className="gov-container security-banner-inner flex items-center justify-between">
          <div className="security-tag flex items-center gap-1.5">
            <Lock size={14} className="lock-icon" />
            <span>OFFICIAL CITIZEN REGISTRATION PORTAL • JANHIT GUARANTEE ACT</span>
          </div>
          <div className="security-encryption flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>256-Bit SSL Encrypted • MeitY & NIC e-Governance Compliant</span>
          </div>
        </div>
      </div>

      <div className="gov-container auth-page-layout">
        {/* Left: Official Government Register Form Card */}
        <div className="gov-auth-card">
          <div className="auth-card-top">
            <NationalEmblem size={44} />
            <div className="auth-title-texts">
              <span className="auth-dept-sub">नागरिक पंजीकरण पोर्टल • CITIZEN REGISTRATION</span>
              <h2>Create Citizen Account</h2>
              <p>Register for seamless public grievance redressal, real-time SLA tracking, and official notices</p>
            </div>
          </div>

          {/* Prompt Switcher to Login */}
          <div className="auth-switch-prompt auth-switch-top-banner">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => navigateTo("citizen-login")}
            >
              Login here (लॉगिन करें) →
            </button>
          </div>

          <form onSubmit={handleRegister} className="gov-form" style={{ marginTop: "14px" }}>
            {error && <div className="auth-error-banner">{error}</div>}
            {successMsg && <div className="auth-success-banner">{successMsg}</div>}

            {/* Full Legal Name */}
            <div className="gov-form-group">
              <label className="gov-form-label">Full Legal Name (पूरा नाम) *</label>
              <input
                type="text"
                name="name"
                className="gov-input"
                placeholder="e.g. Ramesh Kumar Verma"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Enter your name as per official government photo ID (Aadhaar/Voter ID).</span>
            </div>

            {/* Email Address */}
            <div className="gov-form-group">
              <label className="gov-form-label">Email ID (ईमेल आईडी) *</label>
              <input
                type="email"
                name="email"
                className="gov-input"
                placeholder="ramesh.verma@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Used for statutory grievance status updates and official notifications.</span>
            </div>

            {/* Mobile Number */}
            <div className="gov-form-group">
              <label className="gov-form-label">Mobile Number (मोबाइल नंबर)</label>
              <div className="phone-input-combo">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  name="phone"
                  className="gov-input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            {/* Residential Ward / Locality */}
            <div className="gov-form-group">
              <label className="gov-form-label">Residential Ward / Locality (वार्ड / क्षेत्र) *</label>
              <select
                name="ward"
                className="gov-input"
                value={formData.ward}
                onChange={handleChange}
                required
              >
                {POPULAR_WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {formData.ward === "Other / Custom Locality" && (
              <div className="gov-form-group">
                <label className="gov-form-label">Specify Locality / Sector Name *</label>
                <input
                  type="text"
                  name="customWard"
                  className="gov-input"
                  placeholder="e.g. Sector Chi-4, Greater Noida"
                  value={formData.customWard}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Password & Confirm Password in Grid */}
            <div className="auth-grid-two-col">
              <div className="gov-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="gov-form-label">Password (पासवर्ड) *</label>
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="gov-input"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Confirm Password (पुष्टि करें) *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="gov-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength-container">
                <div className="strength-meter-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength.score / 3) * 100}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <div className="strength-meta">
                  <span className="strength-text" style={{ color: strength.color }}>
                    Strength: <strong>{strength.label}</strong>
                  </span>
                  {formData.confirmPassword && (
                    <span className="match-status">
                      {formData.password === formData.confirmPassword ? (
                        <span className="text-match-ok"> Passwords match</span>
                      ) : (
                        <span className="text-match-no"> Passwords do not match</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Standard Govt Captcha Box */}
            <div className="gov-captcha-box">
              <label className="gov-form-label">Security Verification Code *</label>
              <div className="captcha-row">
                <div className="captcha-display" title="Security Captcha">
                  <span>{captchaCode}</span>
                </div>
                <button
                  type="button"
                  className="captcha-refresh-btn"
                  onClick={refreshCaptcha}
                  title="Refresh Captcha"
                >
                  <RefreshCw size={14} />
                </button>
                <input
                  type="text"
                  placeholder="Enter 5-digit code"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="gov-input captcha-input"
                  maxLength={5}
                  required
                />
              </div>
            </div>

            {/* Statutory Declaration Checkbox */}
            <div className="statutory-declaration-box">
              <label className="declaration-label">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                />
                <span>
                  I declare that I am a resident/commuter of Greater Noida metropolis and all information furnished is authentic. I agree to receive statutory grievance notifications and SLA audit SMS as per the Uttar Pradesh Janhit Guarantee Act.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="gov-btn-primary-block flex items-center justify-center gap-2"
              disabled={loading}
              style={{ marginTop: "18px" }}
            >
              <UserPlus size={16} />
              {loading ? "Registering Citizen Profile..." : "Create Citizen Account (पंजीकरण पूर्ण करें) →"}
            </button>
          </form>

          {/* Quick Pre-fill Evaluation Chips */}
          <div className="gov-demo-profile-box" style={{ marginTop: "20px" }}>
            <span className="demo-box-label">QUICK EVALUATION SAMPLE CITIZEN PROFILES:</span>
            <div className="demo-chips-grid">
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() =>
                  fillSampleCitizen(
                    "Ramesh Kumar Verma",
                    "Ward 12, Knowledge Park III, Greater Noida",
                    "ramesh.verma@example.com"
                  )
                }
              >
                Ramesh Verma (KP-3)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() =>
                  fillSampleCitizen(
                    "Pooja Deshmukh",
                    "Ward 5, Sector Alpha 1, Greater Noida",
                    "pooja.deshmukh@example.com"
                  )
                }
              >
                Pooja Deshmukh (Alpha-1)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() =>
                  fillSampleCitizen(
                    "Amitabh Kashyap",
                    "Ward 9, Sector Delta 2, Greater Noida",
                    "amitabh.k@example.com"
                  )
                }
              >
                Amitabh K. (Delta-2)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Citizen Rights & Legal Guarantees */}
        <div className="gov-auth-info-col">
          <div className="gov-card auth-info-card">
            <div className="info-card-header flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h3>Guaranteed Citizen Grievance Rights</h3>
            </div>
            <ul className="info-points-list">
              <li>
                <strong>Statutory Right to Redressal:</strong> Every grievance filed through this portal is assigned a legally binding SLA under the UP Janhit Guarantee Act.
              </li>
              <li>
                <strong>Automated AI Jurisdiction Triaging:</strong> AI computer vision & NLP allocate issues directly to Executive Engineers without administrative desk delays.
              </li>
              <li>
                <strong>Mandatory Photographic Evidence:</strong> Field maintenance squads must upload geotagged before/after photos prior to mark completion.
              </li>
              <li>
                <strong>Closed-Loop Citizen Verification:</strong> Issues are not marked resolved until citizen gives satisfaction feedback.
              </li>
            </ul>

            <div className="official-helpline-box">
              <h4>Citizen Support Helplines</h4>
              <div className="helpline-row">
                <span>Greater Noida Municipal Helpline:</span>
                <strong>0120-2326101</strong>
              </div>
              <div className="helpline-row">
                <span>All-India Civic Emergency:</span>
                <strong>1913 / 112</strong>
              </div>
              <div className="helpline-row">
                <span>Technical Support Desk:</span>
                <strong>portal-admin@in-pact.gov.in</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
