import React, { useState, useEffect } from "react";
import { Mail, Smartphone, ShieldCheck, CheckCircle2, RefreshCw, Lock, PhoneCall, ArrowRight, UserCheck, X } from "lucide-react";
import { NationalEmblem } from "../components/GovEmblem";
import { login, sendOtp, mobileOtpLogin } from "../services/authService";

export default function CitizenLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("email"); // 'email' | 'otp' | 'digilocker'
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [email, setEmail] = useState("ananya.sharma@example.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("7X9K2");
  const [captchaInput, setCaptchaInput] = useState("7X9K2");
  const [smsPopup, setSmsPopup] = useState(null);

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (step === "input" && captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
      setError("Security Captcha verification failed. Please enter the correct code.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(mobileNumber);
      setStep("otp");
      setTimer(30);
      setIsTimerActive(true);
      const generatedOtp = res.demoOtp || "482910";
      setOtp(generatedOtp);
      setSmsPopup({
        phone: mobileNumber,
        otp: generatedOtp,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
    } catch (err) {
      setError(err.message || "Failed to dispatch OTP. Please check mobile number.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (!otp || otp.length < 4) {
      setError("Please enter the 6-digit OTP code received on SMS.");
      return;
    }

    setLoading(true);
    try {
      const result = await mobileOtpLogin(mobileNumber, otp);
      setSmsPopup(null);
      onLogin(result.user);
    } catch (err) {
      setError(err.message || "Invalid OTP code entered. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both registered Email and Password.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      onLogin(result.user);
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCitizen = (name, ward, phone) => {
    const demoUser = {
      id: "CIT-" + Math.floor(1000 + Math.random() * 9000),
      name: name,
      email: name.toLowerCase().replace(/[^a-z]/g, "") + "@citizen.in-pact.gov.in",
      role: "citizen",
      ward: ward,
      phone: phone,
      avatar: ""
    };
    onLogin(demoUser);
  };

  return (
    <div className="gov-auth-container">
      {/* Floating Mock SMS Gateway Notification */}
      {smsPopup && (
        <div className="mock-sms-toast">
          <div className="sms-toast-header">
            <div className="sms-sender-info">
              <span className="sms-icon">
                <Smartphone size={14} />
              </span>
              <strong>GOV-OTP (Govt of India / NIC SMS)</strong>
            </div>
            <button className="sms-close-btn" onClick={() => setSmsPopup(null)}>
              <X size={14} />
            </button>
          </div>
          <div className="sms-toast-body">
            <p>
              Your OTP for IN-PACT Citizen Portal login is <strong>{smsPopup.otp}</strong>. Valid for 10 minutes. Do not share this OTP with anyone. — National Informatics Centre
            </p>
            <span className="sms-time">{smsPopup.time} • Sent to {smsPopup.phone}</span>
          </div>
        </div>
      )}

      <div className="gov-container auth-page-layout">
        {/* Left: Login Card */}
        <div className="gov-auth-card">
          <div className="auth-card-top">
            <NationalEmblem size={44} />
            <div className="auth-title-texts">
              <span className="auth-dept-sub">जनता सेवा पोर्टल • CITIZEN PORTAL</span>
              <h2>Unified Citizen Authentication</h2>
              <p>Sign in using registered Mobile OTP, DigiLocker, or Jan Parichay</p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="gov-auth-tabs">
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "email" ? "active" : ""}`}
              onClick={() => setAuthMode("email")}
            >
              <Mail size={14} /> Email / Password
            </button>
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "otp" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("otp");
                setStep("input");
              }}
            >
              <Smartphone size={14} /> Mobile OTP
            </button>
            <button
              className={`auth-tab-btn flex items-center justify-center gap-1.5 ${authMode === "digilocker" ? "active" : ""}`}
              onClick={() => setAuthMode("digilocker")}
            >
              <ShieldCheck size={14} /> DigiLocker KYC
            </button>
          </div>

          {/* TAB 1: Email / Password (Default & Recommended) */}
          {authMode === "email" && (
            <div className="auth-tab-body">
              <form onSubmit={handleEmailLogin} className="gov-form">
                <div className="gov-form-group">
                  <label className="gov-form-label">Email ID or Registered Mobile (ईमेल या मोबाइल नंबर) *</label>
                  <input
                    type="text"
                    className="gov-input"
                    placeholder="name@example.com or 10-digit mobile"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="gov-form-group">
                  <label className="gov-form-label">Account Password (पासवर्ड) *</label>
                  <input
                    type="password"
                    className="gov-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="auth-error-banner">{error}</div>}
                <button type="submit" className="gov-btn-primary-block flex items-center justify-center gap-2" disabled={loading}>
                  {loading ? "Signing in..." : "Login to Citizen Portal (लॉगिन करें) →"}
                </button>
                <div style={{ textAlign: "center", marginTop: "12px", fontSize: "13px" }}>
                  <span style={{ color: "#64748B" }}>Not registered yet? </span>
                  <button
                    type="button"
                    style={{ color: "var(--gov-primary)", fontWeight: "800", textDecoration: "underline" }}
                    onClick={() => navigateTo("citizen-register")}
                  >
                    Register here (नया नागरिक खाता बनाएं) →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Mobile OTP Login */}
          {authMode === "otp" && (
            <div className="auth-tab-body">
              {step === "input" ? (
                <form onSubmit={handleSendOtp} className="gov-form">
                  <div className="gov-form-group">
                    <label className="gov-form-label">Aadhaar Linked Mobile Number (आधार लिंक मोबाइल नंबर) *</label>
                    <div className="mobile-input-wrapper">
                      <span className="country-prefix">+91</span>
                      <input
                        type="tel"
                        maxLength="10"
                        placeholder="10-digit mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                        className="gov-input mobile-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="gov-form-group captcha-group">
                    <label className="gov-form-label">Security Captcha Verification *</label>
                    <div className="captcha-wrapper">
                      <div className="captcha-display">{captchaCode}</div>
                      <button type="button" onClick={refreshCaptcha} className="captcha-refresh-btn" title="Refresh Captcha">
                        <RefreshCw size={14} />
                      </button>
                      <input
                        type="text"
                        placeholder="Enter 5-digit code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="gov-input captcha-input"
                        maxLength="5"
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="auth-error-banner">{error}</div>}

                  <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                    {loading ? "Sending OTP..." : "Get OTP on Mobile (ओटीपी प्राप्त करें)"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="gov-form">
                  <div className="otp-sent-banner flex items-center justify-between">
                    <span>OTP sent to +91 {mobileNumber}</span>
                    <button type="button" onClick={() => setStep("input")} className="edit-phone-btn">
                      Change
                    </button>
                  </div>

                  <div className="gov-form-group">
                    <label className="gov-form-label">Enter 6-Digit OTP (ओटीपी दर्ज करें) *</label>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="gov-input otp-input-large"
                      required
                      autoFocus
                    />
                  </div>

                  {error && <div className="auth-error-banner">{error}</div>}

                  <div className="otp-resend-row">
                    {isTimerActive ? (
                      <span className="timer-text">Resend OTP in <strong>{timer}s</strong></span>
                    ) : (
                      <button type="button" onClick={handleSendOtp} className="resend-btn flex items-center gap-1">
                        <RefreshCw size={12} /> Resend OTP
                      </button>
                    )}
                  </div>

                  <button type="submit" className="gov-btn-primary-block flex items-center justify-center gap-2" disabled={loading}>
                    <CheckCircle2 size={16} />
                    {loading ? "Verifying..." : "Verify & Enter Portal (प्रमाणित करें)"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: DigiLocker KYC */}
          {authMode === "digilocker" && (
            <div className="auth-tab-body text-center">
              <div className="digilocker-promo-box">
                <div className="digilocker-badge-official flex items-center justify-center gap-1">
                  <ShieldCheck size={16} /> DigiLocker Verified Citizen KYC
                </div>
                <h3>National Single Sign-On</h3>
                <p>Authenticate securely using your government-verified identity and auto-populate jurisdiction records.</p>
                <button
                  type="button"
                  className="gov-btn-primary-block digilocker-cta-btn flex items-center justify-center gap-2"
                  onClick={() => handleDemoCitizen("Ananya Sharma", "Ward 12, Knowledge Park III", "+91 98765 43210")}
                >
                  <UserCheck size={16} /> Continue with DigiLocker / MeriPehchaan
                </button>
              </div>
            </div>
          )}

          {/* Citizen Quick Evaluation Demo Profiles */}
          <div className="gov-demo-profile-box">
            <span className="demo-box-label">QUICK EVALUATION CITIZEN PROFILES:</span>
            <div className="demo-chips-grid">
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Ananya Sharma", "Ward 12, Knowledge Park III", "+91 98765 43210")}
              >
                Ananya Sharma (Ward 12)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Vikramaditya Verma", "Ward 5, Sector Alpha 1", "+91 98112 33445")}
              >
                Vikramaditya Verma (Ward 5)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Meenakshi Sundaram", "Ward 9, Delta 2 Metropolis", "+91 99201 88776")}
              >
                Meenakshi S. (Ward 9)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Citizen Charter & Help Information */}
        <div className="gov-auth-info-col">
          <div className="gov-card auth-info-card">
            <div className="info-card-header flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <h3>Citizen Grievance Redressal Rights</h3>
            </div>
            <ul className="info-points-list">
              <li>
                <strong>Statutory Right to Redressal:</strong> Every grievance filed through this portal is assigned a binding legal SLA under the Uttar Pradesh Janhit Guarantee Act.
              </li>
              <li>
                <strong>Direct Officer Allocation:</strong> Complaints are auto-triaged to designated Executive Engineers without administrative desk delays.
              </li>
              <li>
                <strong>Geotagged Photo Verification:</strong> Field personnel must provide photographic evidence of completed repair work before case closure.
              </li>
              <li>
                <strong>Second Appeal Escalation:</strong> If unsatisfied with resolution, citizens may trigger a direct review with the District Magistrate.
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
                <span>Support Email:</span>
                <strong>grievance-support@gnida.in</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
