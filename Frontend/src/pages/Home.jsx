import React, { useState } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  Camera,
  Mic,
  Download,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Clock,
  Check,
  Building2,
  TrafficCone,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import StatCard from "../components/StatCard";
import MapView from "../components/MapView";

export default function Home({ navigateTo }) {
  // Reference search state for live tracking
  const [searchRefId, setSearchRefId] = useState("");
  const [searchStatusResult, setSearchStatusResult] = useState(null);

  // Interactive National Grievance Classifier Sandbox
  const [demoPrompt, setDemoPrompt] = useState("Severe deep pothole and road cave-in near Knowledge Park 3 metro causing bike accidents");
  const [demoResult, setDemoResult] = useState({
    category: "Roads & Arterial Infrastructure",
    department: "Public Works Department (PWD - Division 2)",
    severity: "CRITICAL",
    confidence: 97.4,
    sla: "6 Hours Emergency Statutory SLA",
    nodalOfficer: "Er. S.K. Sharma (Chief Executive Engineer)",
    tags: ["High Traffic Corridor", "Accident Hazard", "Bitumen Surface Failure"]
  });
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const samplePresets = [
    {
      title: "Road Crater / Pothole",
      text: "Severe deep pothole and road cave-in near Knowledge Park 3 metro causing bike accidents",
      result: {
        category: "Roads & Arterial Infrastructure",
        department: "Public Works Department (PWD - Division 2)",
        severity: "CRITICAL",
        confidence: 97.4,
        sla: "6 Hours Emergency Statutory SLA",
        nodalOfficer: "Er. S.K. Sharma (Chief Executive Engineer)",
        tags: ["High Traffic Corridor", "Accident Hazard", "Bitumen Surface Failure"]
      }
    },
    {
      title: "Stormwater Drain Choke",
      text: "Main culvert drain clogged with plastic waste causing 2-foot waterlogging at Pari Chowk underpass",
      result: {
        category: "Drainage & Flood Control",
        department: "UP Jal Nigam (Stormwater & Sewerage Wing)",
        severity: "HIGH",
        confidence: 98.6,
        sla: "12 Hours Pre-Monsoon SLA",
        nodalOfficer: "Er. A.K. Srivastava (Superintending Engineer)",
        tags: ["Culvert Silt 85%", "Monsoon Vulnerability", "Arterial Road"]
      }
    },
    {
      title: "Sparking 11kV Transformer",
      text: "11kV commercial distribution transformer sparking and humming loudly in Alpha 1 market",
      result: {
        category: "Power Grid & Electrical Safety",
        department: "NPCL State Power Distribution Grid",
        severity: "CRITICAL",
        confidence: 99.1,
        sla: "2 Hours Emergency Life-Safety SLA",
        nodalOfficer: "R.K. Gupta (Divisional Engineer)",
        tags: ["Fire Hazard Risk", "High Tension Line", "Public Market Zone"]
      }
    },
    {
      title: "Garbage Dump Overflow",
      text: "Unattended municipal garbage dump on Delta 2 perimeter attracting stray cattle for 4 days",
      result: {
        category: "Municipal Solid Waste Management",
        department: "GNIDA Health & Sanitation Department",
        severity: "MODERATE",
        confidence: 94.8,
        sla: "24 Hours Standard Sanitation SLA",
        nodalOfficer: "Dr. Vinod Pathak (Chief Sanitary Officer)",
        tags: ["Solid Waste Accumulation", "Public Health", "Footpath Blockage"]
      }
    }
  ];

  const handleSelectPreset = (preset) => {
    setDemoPrompt(preset.text);
    setIsDemoRunning(true);
    setTimeout(() => {
      setDemoResult(preset.result);
      setIsDemoRunning(false);
    }, 350);
  };

  const handleSearchTracking = (e) => {
    e.preventDefault();
    if (!searchRefId.trim()) return;

    if (searchRefId.toUpperCase().includes("8091") || searchRefId.toUpperCase().includes("PWD")) {
      setSearchStatusResult({
        id: "UP-GND-2026-8091",
        title: "Major Pothole & Cave-in on Main Commercial Road",
        department: "Public Works Department (PWD - Division 2)",
        status: "In Progress (Field Crew On-Site)",
        nodal: "Er. S.K. Sharma (EE, PWD)",
        registeredOn: "20 Aug 2026, 10:15 AM",
        slaTarget: "20 Aug 2026, 04:15 PM (6 Hours)",
        statusClass: "status-progress"
      });
    } else {
      setSearchStatusResult({
        id: searchRefId.toUpperCase(),
        title: "Stormwater Drainage Desilting & Silt Removal",
        department: "UP Jal Nigam (Zone 1)",
        status: "Assigned & Triaged to Nodal Unit",
        nodal: "Er. A.K. Srivastava (SE)",
        registeredOn: "20 Aug 2026, 08:30 AM",
        slaTarget: "21 Aug 2026, 08:30 AM (24 Hours)",
        statusClass: "status-triaged"
      });
    }
  };

  return (
    <div className="gov-home-wrapper">
      {/* Official Government Hero Section */}
      <section className="gov-hero-section">
        <div className="gov-container hero-grid">
          <div className="hero-text-col">
            <h1 className="hero-main-title">
              National Public Grievance & Civic Action Portal
            </h1>
            <h2 className="hero-hindi-subtitle">
              नागरिक शिकायत निवारण एवं स्वचालित अंतर-विभागीय प्रेषण प्रणाली
            </h2>

            <p className="hero-summary-text">
              An integrated, transparent e-governance platform empowering citizens to register civic grievances across Greater Noida metropolis. Enabled with multi-modal AI classification, computer vision triage, and automated jurisdictional routing directly to designated Nodal Executive Engineers.
            </p>

            <div className="hero-action-buttons">
              <button
                className="gov-btn-primary-lg"
                onClick={() => navigateTo("citizen-dashboard")}
              >
                <FileText size={18} className="btn-icon" /> Lodge a Grievance (शिकायत दर्ज करें)
              </button>

              <button
                className="gov-btn-secondary-lg"
                onClick={() => {
                  document.getElementById("tracker-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Search size={18} className="btn-icon" /> Track Grievance Status
              </button>
            </div>

            <div className="gov-compliance-strip">
              <div className="compliance-item">
                <Check size={14} className="check-bullet text-green-600" />
                <span>Statutory SLA Tracking</span>
              </div>
              <div className="compliance-item">
                <Check size={14} className="check-bullet text-green-600" />
                <span>Geotagged Photo Proof</span>
              </div>
              <div className="compliance-item">
                <Check size={14} className="check-bullet text-green-600" />
                <span>Citizen Verification Loop</span>
              </div>
            </div>
          </div>

          {/* Quick Grievance Reference Search Box */}
          <div className="hero-quick-search-col" id="tracker-section">
            <div className="gov-card quick-tracker-card">
              <div className="tracker-card-header">
                <div className="tracker-title-group">
                  <div className="tracker-icon p-2 bg-blue-50 rounded-lg text-blue-900 inline-flex">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3>Track Grievance / Application</h3>
                    <p>Enter your Grievance Reference ID (e.g. UP-GND-2026-8091)</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearchTracking} className="tracker-form">
                <div className="tracker-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter Reference No. (e.g. UP-GND-2026-8091)"
                    value={searchRefId}
                    onChange={(e) => setSearchRefId(e.target.value)}
                    className="gov-input tracker-input"
                  />
                  <button type="submit" className="gov-btn-primary tracker-submit-btn">
                    Track Status
                  </button>
                </div>
              </form>

              {searchStatusResult && (
                <div className="tracker-result-box">
                  <div className="result-header">
                    <span className="ref-number">{searchStatusResult.id}</span>
                    <span className={`status-badge-inline ${searchStatusResult.statusClass}`}>
                      {searchStatusResult.status}
                    </span>
                  </div>
                  <div className="result-title">{searchStatusResult.title}</div>
                  <div className="result-details-grid">
                    <div>
                      <span className="det-label">Department:</span>
                      <strong>{searchStatusResult.department}</strong>
                    </div>
                    <div>
                      <span className="det-label">Assigned Officer:</span>
                      <strong>{searchStatusResult.nodal}</strong>
                    </div>
                    <div>
                      <span className="det-label">Registered On:</span>
                      <span>{searchStatusResult.registeredOn}</span>
                    </div>
                    <div>
                      <span className="det-label">Target SLA:</span>
                      <strong className="text-amber">{searchStatusResult.slaTarget}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="tracker-quick-links">
                <span className="quick-label">Citizen Quick Services:</span>
                <div className="quick-badges-row">
                  <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip flex items-center gap-1">
                    <Camera size={13} /> Photo Grievance
                  </button>
                  <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip flex items-center gap-1">
                    <Mic size={13} /> Voice Complaint
                  </button>
                  <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip flex items-center gap-1">
                    <Download size={13} /> Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Official Key Citizen Services Grid */}
      <section className="gov-services-section">
        <div className="gov-container">
          <div className="gov-section-header text-center">
            <span className="section-super-label">PUBLIC CONVENIENCE SERVICES</span>
            <h2 className="section-main-heading">Direct Citizen Redressal Portals</h2>
            <div className="heading-separator"></div>
            <p className="section-sub-text">
              Unified digital access point for all civic municipal departments in Greater Noida Metropolis
            </p>
          </div>

          <div className="services-grid-4">
            <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
              <div className="service-card-icon roads-icon p-2.5 bg-slate-100 rounded-lg text-slate-800 inline-flex w-fit">
                <Construction size={22} />
              </div>
              <h3>Roads & Pavements</h3>
              <p>Pothole repair, bitumen cave-ins, sidewalk obstructions, and street trenching.</p>
              <span className="service-sla-tag">SLA: 6 to 48 Hours</span>
            </div>

            <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
              <div className="service-card-icon water-icon p-2.5 bg-blue-50 rounded-lg text-blue-700 inline-flex w-fit">
                <Droplets size={22} />
              </div>
              <h3>Water Supply & Drainage</h3>
              <p>Pipeline burst, low water pressure, contaminated supply, and stormwater drain clogging.</p>
              <span className="service-sla-tag">SLA: 4 to 24 Hours</span>
            </div>

            <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
              <div className="service-card-icon power-icon p-2.5 bg-amber-50 rounded-lg text-amber-600 inline-flex w-fit">
                <Zap size={22} />
              </div>
              <h3>Electricity & Streetlights</h3>
              <p>Transformer sparking, overhead cable hazards, non-functional streetlights, and power fluctuation.</p>
              <span className="service-sla-tag">SLA: 2 to 12 Hours</span>
            </div>

            <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
              <div className="service-card-icon waste-icon p-2.5 bg-emerald-50 rounded-lg text-emerald-700 inline-flex w-fit">
                <Trash2 size={22} />
              </div>
              <h3>Solid Waste & Sanitation</h3>
              <p>Garbage overflow, illegal dumping, public bio-waste clearance, and fogging/sanitation.</p>
              <span className="service-sla-tag">SLA: 12 to 24 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real-time Public Performance Metrics (Official Statistics) */}
      <section className="gov-stats-section" id="statistics">
        <div className="gov-container">
          <div className="gov-section-header text-center">
            <span className="section-super-label">TRANSPARENCY & ACCOUNTABILITY</span>
            <h2 className="section-main-heading">Public Redressal Disposal Metrics</h2>
            <div className="heading-separator"></div>
            <p className="section-sub-text">
              Live automated performance audit across all 18 Greater Noida Municipal Wards
            </p>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Total Grievances Registered"
              value="14,820"
              subtitle="Registered across all municipal wards"
              icon={<FileText size={22} className="text-blue-900" />}
              trend="100% digital audit trail"
              trendPositive={true}
            />
            <StatCard
              title="Grievances Resolved & Verified"
              value="14,198"
              subtitle="Verified with photo evidence"
              icon={<CheckCircle2 size={22} className="text-emerald-700" />}
              trend="95.8% Resolution Rate"
              trendPositive={true}
              variant="success"
            />
            <StatCard
              title="Average Resolution Turnaround"
              value="2.8 Days"
              subtitle="Statutory compliance time"
              icon={<Clock size={22} className="text-purple-700" />}
              trend="68% faster than benchmark"
              trendPositive={true}
              variant="purple"
            />
            <StatCard
              title="Automated Routing Precision"
              value="98.4%"
              subtitle="First-time nodal assignment"
              icon={<Sparkles size={22} className="text-amber-600" />}
              trend="Zero manual delay"
              trendPositive={true}
              variant="warning"
            />
          </div>
        </div>
      </section>

      {/* 5. Interactive Grievance Classification Sandbox */}
      <section className="gov-classifier-section">
        <div className="gov-container">
          <div className="gov-card classifier-card">
            <div className="classifier-header">
              <div>
                <span className="badge-official-sub">SYSTEM COMPONENT DEMONSTRATION</span>
                <h2>Automated Grievance Classification & Nodal Routing Engine</h2>
                <p>
                  Demonstration of the National Natural Language & Computer Vision Grievance Classifier used to route public reports to the exact statutory Nodal Officer.
                </p>
              </div>
              <div className="classifier-seal">
                <span className="seal-text">NAGR-IDTE COMPLIANT</span>
              </div>
            </div>

            <div className="classifier-presets">
              <span className="preset-label">Sample Grievance Test Cases:</span>
              <div className="preset-buttons">
                {samplePresets.map((p, idx) => (
                  <button
                    key={idx}
                    className={`gov-chip ${demoPrompt === p.text ? "active" : ""}`}
                    onClick={() => handleSelectPreset(p)}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="classifier-body-grid">
              <div className="input-pane">
                <label htmlFor="testPrompt" className="gov-label">
                  Grievance Description (Multilingual / English / Hindi):
                </label>
                <textarea
                  id="testPrompt"
                  className="gov-textarea"
                  rows={4}
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                />
              </div>

              <div className="output-pane">
                <div className="output-header-bar">
                  <span>TRIAGE CLASSIFICATION SUMMARY</span>
                  <span className="confidence-pill">Confidence: {demoResult.confidence}%</span>
                </div>

                {isDemoRunning ? (
                  <div className="analyzing-state">
                    <span className="spinner-circle"></span>
                    <span>Processing through National Civic NLP Engine...</span>
                  </div>
                ) : (
                  <div className="results-table-view">
                    <div className="res-row">
                      <span className="res-k">Statutory Department:</span>
                      <strong className="res-v text-navy">{demoResult.department}</strong>
                    </div>
                    <div className="res-row">
                      <span className="res-k">Assigned Nodal Officer:</span>
                      <strong className="res-v">{demoResult.nodalOfficer}</strong>
                    </div>
                    <div className="res-row">
                      <span className="res-k">Categorization:</span>
                      <span className="res-v">{demoResult.category}</span>
                    </div>
                    <div className="res-row">
                      <span className="res-k">Severity Level:</span>
                      <span className={`priority-badge priority-${demoResult.severity.toLowerCase()}`}>
                        {demoResult.severity} PRIORITY
                      </span>
                    </div>
                    <div className="res-row">
                      <span className="res-k">Mandated Redressal SLA:</span>
                      <strong className="res-v text-saffron flex items-center gap-1">
                        <Clock size={14} /> {demoResult.sla}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live GIS Ward Grievance Map */}
      <section className="gov-map-section">
        <div className="gov-container">
          <div className="gov-card map-wrapper-card">
            <div className="map-card-header">
              <div>
                <span className="section-super-label">GIS SPATIAL TELEMETRY</span>
                <h3>Greater Noida Metropolitan Ward Incident Map</h3>
                <p>Real-time geographic distribution of active grievances and deployed field maintenance squads</p>
              </div>
              <div className="map-legend-row">
                <span className="legend-item"><span className="dot dot-crit"></span> Critical (Under 4 Hrs)</span>
                <span className="legend-item"><span className="dot dot-high"></span> High (Under 12 Hrs)</span>
                <span className="legend-item"><span className="dot dot-med"></span> Moderate</span>
                <span className="legend-item"><span className="dot dot-res"></span> Resolved & Verified</span>
              </div>
            </div>

            <MapView city="Greater Noida" />

            <div className="map-footer-telemetry">
              <span><strong>Active Telemetry:</strong> Ward 4 Drainage Crew on site &bull; Sector Alpha 2 Power Line Cleared &bull; PWD Patchwork underway in Knowledge Park III</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Official 4-Step Redressal Process */}
      <section className="gov-process-section" id="how-it-works">
        <div className="gov-container">
          <div className="gov-section-header text-center">
            <span className="section-super-label">STANDARD OPERATING PROCEDURE</span>
            <h2 className="section-main-heading">End-to-End Redressal Workflow</h2>
            <div className="heading-separator"></div>
            <p className="section-sub-text">
              Transparent 4-stage citizen-centric redressal process complying with Citizen Charter guidelines
            </p>
          </div>

          <div className="process-timeline-grid">
            <div className="process-step-card">
              <div className="step-badge-number">1</div>
              <div className="step-icon-box p-2 bg-blue-50 rounded text-blue-900 inline-flex mb-2">
                <FileText size={20} />
              </div>
              <h4>1. Multi-Modal Registration</h4>
              <p>Citizen logs complaint via mobile, web, photo upload, or regional voice recording with GPS location.</p>
              <div className="step-footer-info">Instant SMS / Reference ID</div>
            </div>

            <div className="process-step-card">
              <div className="step-badge-number">2</div>
              <div className="step-icon-box p-2 bg-purple-50 rounded text-purple-900 inline-flex mb-2">
                <Layers size={20} />
              </div>
              <h4>2. Automated Jurisdictional Triage</h4>
              <p>System automatically verifies ward boundaries, classifies defect severity, and allocates statutory Nodal Officer.</p>
              <div className="step-footer-info">SLA Timer Commences</div>
            </div>

            <div className="process-step-card">
              <div className="step-badge-number">3</div>
              <div className="step-icon-box p-2 bg-amber-50 rounded text-amber-800 inline-flex mb-2">
                <Activity size={20} />
              </div>
              <h4>3. Field Inspection & Execution</h4>
              <p>Designated Executive Engineer deploys maintenance squad. Repairs completed and before/after photos uploaded.</p>
              <div className="step-footer-info">Geotagged Proof Mandatory</div>
            </div>

            <div className="process-step-card">
              <div className="step-badge-number">4</div>
              <div className="step-icon-box p-2 bg-emerald-50 rounded text-emerald-800 inline-flex mb-2">
                <CheckCircle2 size={20} />
              </div>
              <h4>4. Citizen Feedback & Closure</h4>
              <p>Citizen confirms resolution. If unsatisfied, one-click escalation triggers review by the District Magistrate.</p>
              <div className="step-footer-info">Closed-Loop Accountability</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Citizen Charter & SLAs */}
      <section className="gov-charter-section" id="citizen-charter">
        <div className="gov-container">
          <div className="gov-card charter-card">
            <div className="charter-header">
              <div className="charter-title-box">
                <span className="badge-official-sub">STATUTORY COMMITMENTS</span>
                <h3>Citizen Charter & Service Level Agreements (SLAs)</h3>
                <p>Maximum permissible turnaround time for municipal civic grievance disposal under Uttar Pradesh Janhit Guarantee Act</p>
              </div>
            </div>

            <div className="charter-table-responsive">
              <table className="gov-data-table">
                <thead>
                  <tr>
                    <th>Service Category</th>
                    <th>Nodal Department</th>
                    <th>Standard Redressal SLA</th>
                    <th>Emergency SLA</th>
                    <th>First Appellate Authority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Road Craters & Major Potholes</strong></td>
                    <td>Public Works Dept (PWD)</td>
                    <td>48 Hours</td>
                    <td><span className="sla-urgent">6 Hours</span></td>
                    <td>Chief Executive Officer, GNIDA</td>
                  </tr>
                  <tr>
                    <td><strong>Stormwater Drain Clogging / Flood</strong></td>
                    <td>UP Jal Nigam (Drainage)</td>
                    <td>24 Hours</td>
                    <td><span className="sla-urgent">4 Hours</span></td>
                    <td>District Magistrate / Collector</td>
                  </tr>
                  <tr>
                    <td><strong>High Voltage Wire / Transformer Spark</strong></td>
                    <td>NPCL / State Power Board</td>
                    <td>12 Hours</td>
                    <td><span className="sla-urgent">2 Hours</span></td>
                    <td>Superintending Engineer (Power)</td>
                  </tr>
                  <tr>
                    <td><strong>Solid Waste Accumulation</strong></td>
                    <td>GNIDA Sanitation Division</td>
                    <td>24 Hours</td>
                    <td><span className="sla-urgent">8 Hours</span></td>
                    <td>Chief Health & Sanitation Officer</td>
                  </tr>
                  <tr>
                    <td><strong>Non-Functional Streetlights</strong></td>
                    <td>Electrical Maintenance Wing</td>
                    <td>48 Hours</td>
                    <td><span className="sla-urgent">12 Hours</span></td>
                    <td>Executive Engineer (Electrical)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Integrated Nodal Departments Directory */}
      <section className="gov-directory-section" id="nodal-officers">
        <div className="gov-container">
          <div className="gov-section-header text-center">
            <span className="section-super-label">NODAL DIRECTORY</span>
            <h2 className="section-main-heading">Participating Public Authorities</h2>
            <div className="heading-separator"></div>
            <p className="section-sub-text">
              Direct contact channels for nodal department grievance officers across Greater Noida Metropolis
            </p>
          </div>

          <div className="directory-grid-5">
            <div className="dept-card">
              <div className="dept-emblem p-2 bg-slate-100 rounded text-slate-800 inline-flex mb-2">
                <Construction size={18} />
              </div>
              <h4>Public Works Department</h4>
              <p className="dept-juris">Roads, Bridges & Pavements</p>
              <div className="dept-contact">
                <span>Nodal: Er. S.K. Sharma</span>
                <span>Helpline: 0120-2326101</span>
              </div>
            </div>

            <div className="dept-card">
              <div className="dept-emblem p-2 bg-blue-50 rounded text-blue-700 inline-flex mb-2">
                <Droplets size={18} />
              </div>
              <h4>UP Jal Nigam</h4>
              <p className="dept-juris">Drinking Water & Storm Drainage</p>
              <div className="dept-contact">
                <span>Nodal: Er. A.K. Srivastava</span>
                <span>Helpline: 0120-2326104</span>
              </div>
            </div>

            <div className="dept-card">
              <div className="dept-emblem p-2 bg-amber-50 rounded text-amber-600 inline-flex mb-2">
                <Zap size={18} />
              </div>
              <h4>NPCL State Power</h4>
              <p className="dept-juris">Grid Safety & Street Lighting</p>
              <div className="dept-contact">
                <span>Nodal: R.K. Gupta</span>
                <span>Helpline: 1912 / 0120-6226666</span>
              </div>
            </div>

            <div className="dept-card">
              <div className="dept-emblem p-2 bg-emerald-50 rounded text-emerald-700 inline-flex mb-2">
                <Trash2 size={18} />
              </div>
              <h4>GNIDA Sanitation</h4>
              <p className="dept-juris">Waste Management & Public Health</p>
              <div className="dept-contact">
                <span>Nodal: Dr. Vinod Pathak</span>
                <span>Helpline: 0120-2326108</span>
              </div>
            </div>

            <div className="dept-card">
              <div className="dept-emblem p-2 bg-red-50 rounded text-red-600 inline-flex mb-2">
                <TrafficCone size={18} />
              </div>
              <h4>Traffic & Mobility Cell</h4>
              <p className="dept-juris">Signal Faults & Road Encroachment</p>
              <div className="dept-contact">
                <span>Nodal: ACP Traffic HQ</span>
                <span>Helpline: 1095 / 9971009001</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
