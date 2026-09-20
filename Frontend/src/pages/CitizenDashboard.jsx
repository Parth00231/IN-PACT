import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Bot,
  FileText,
  ThumbsUp,
  Flame,
  Printer,
  Download,
  Search,
  Users,
  Droplets,
  Zap,
  Trash2,
  Construction,
  Lightbulb,
  SlidersHorizontal,
  PlusCircle,
  Check,
  Compass,
  Building2,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Activity,
  Layers,
  Copy,
  Mic,
  MicOff,
  QrCode
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";
import { getMyIssues, getIssues, createIssue, toggleUpvote, getStats } from "../services/issuesService";
import { analyzeCivicIssue, CIVIC_PRESETS, INVALID_IMAGE_PRESETS } from "../services/aiClassifierService";
import { getLiveDeviceLocation } from "../services/locationService";
import { generateReferenceNumber, saveGrievanceHistory } from "../utils/referenceNumber";

export default function CitizenDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview | report | track | map | community
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Multimodal Ingestion & AI Triaging State
  const [reportStep, setReportStep] = useState("input"); // "input" | "review" | "success"
  const [formDescription, setFormDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [formLocation, setFormLocation] = useState("Knowledge Park III, Main Arterial Road");
  const [formWard, setFormWard] = useState("Ward 12 - Knowledge Park III");
  const [formGps, setFormGps] = useState("28.4682° N, 77.5028° E (Live Geotag)");
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [locationAutoFetched, setLocationAutoFetched] = useState(false);

  // Live Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // "environment" | "user"
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // AI Diagnostic Results & Overrides
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiRejectionDetails, setAiRejectionDetails] = useState(null);
  const [confirmedTitle, setConfirmedTitle] = useState("");
  const [confirmedCategory, setConfirmedCategory] = useState("Roads & Arterial Infrastructure");
  const [confirmedDepartment, setConfirmedDepartment] = useState("Public Works Department (PWD - Division 2)");
  const [confirmedOfficer, setConfirmedOfficer] = useState("Er. S.K. Sharma (Chief Executive Engineer)");
  const [confirmedSeverity, setConfirmedSeverity] = useState("critical");
  const [confirmedSla, setConfirmedSla] = useState("6 Hours Emergency Statutory SLA");

  const [generatedRefId, setGeneratedRefId] = useState("");
  const [formError, setFormError] = useState(null);
  const fileInputRef = useRef(null);

  // Live Speech-to-Text Voice Complaint State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState("hi-IN"); // "hi-IN" | "en-IN"
  const [liveVoiceTranscript, setLiveVoiceTranscript] = useState("");
  const speechRecognitionRef = useRef(null);
  const isRecordingVoiceRef = useRef(false);

  // Citizen's personal tracked grievances — now fetched from the real backend
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [myError, setMyError] = useState(null);

  // Community grievances feed — now fetched from the real backend
  const [communityGrievances, setCommunityGrievances] = useState([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [communityError, setCommunityError] = useState(null);

  // Ward-level resolution rate stat
  const [wardStats, setWardStats] = useState(null);

  // Track complaints filter, search & Hand-raise notification toast
  const [trackFilter, setTrackFilter] = useState("all"); // "all" | "highest_priority" | "my"
  const [trackSearchQuery, setTrackSearchQuery] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);
  const [raiseHandToast, setRaiseHandToast] = useState(null);

  // Community Feed search, filter & sort state
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState("all");
  const [communitySortOption, setCommunitySortOption] = useState("most_supported"); // "most_supported" | "highest_priority" | "newest"

  // Maps a raw backend Issue object to what this component's JSX expects:
  // adds `id` (aliasing _id, so IssueCard's internal `id` destructuring still
  // works unchanged) while keeping `refId` around for the human-readable badges.
  const mapIssue = (issue) => ({ ...issue, id: issue._id });

  const DEMO_CITIZEN_GRIEVANCES = [
    {
      id: "g-001",
      _id: "g-001",
      refId: "RN20260920A8091",
      title: "Major Pothole & Cave-in on Main Commercial Road",
      description: "Severe 3-foot wide bitumen crater causing vehicular damage and traffic congestion near Knowledge Park 3 metro pillar 42.",
      category: "Roads & Arterial Infrastructure",
      department: "Public Works Department (PWD)",
      severity: "critical",
      status: "in_progress",
      location: { address: "Pari Chowk to KP-3 Road, Greater Noida", ward: "Ward 12 - Knowledge Park III", lat: 28.4682, lng: 77.5028 },
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      slaRemaining: "4h 22m remaining",
      assignedOfficer: "Er. S.K. Sharma (EE, PWD)",
      upvotes: 42,
      hasUpvoted: false
    },
    {
      id: "g-002",
      _id: "g-002",
      refId: "RN20260920B7914",
      title: "Overhead 11kV Power Cable Sagging Near Footpath",
      description: "High tension electrical cable hanging dangerously low near residential society gate in Alpha 1.",
      category: "Power Grid & Electrical Safety",
      department: "NPCL State Power Distribution Grid",
      severity: "critical",
      status: "assigned",
      location: { address: "Gate 2, Sector Alpha 1", ward: "Ward 4 - Alpha I & II", lat: 28.4721, lng: 77.5112 },
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      slaRemaining: "1h 45m remaining",
      assignedOfficer: "R.K. Gupta (Divisional Engineer)",
      upvotes: 28,
      hasUpvoted: true
    },
    {
      id: "g-003",
      _id: "g-003",
      refId: "RN20260920C6820",
      title: "Blocked Stormwater Culvert Drain",
      description: "Culvert choke causing overflow and foul smell along commercial market walkway.",
      category: "Drainage & Flood Control",
      department: "UP Jal Nigam (Drainage Wing)",
      severity: "high",
      status: "resolved",
      location: { address: "Commercial Complex, Beta 2", ward: "Ward 8 - Beta II", lat: 28.4610, lng: 77.5190 },
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      slaRemaining: "Resolved within SLA",
      assignedOfficer: "Er. A.K. Srivastava (SE, Jal Nigam)",
      upvotes: 19,
      hasUpvoted: false
    }
  ];

  const DEMO_COMMUNITY_GRIEVANCES = [
    ...DEMO_CITIZEN_GRIEVANCES,
    {
      id: "g-004",
      _id: "g-004",
      refId: "RN20260920D8105",
      title: "Garbage Dump Accumulation & Stray Cattle Hazard",
      description: "Unattended municipal garbage dump on Delta 2 perimeter attracting stray cattle for 4 days.",
      category: "Municipal Solid Waste Management",
      department: "GNIDA Health & Sanitation Department",
      severity: "medium",
      status: "assigned",
      location: { address: "Green Belt Area, Delta 2", ward: "Ward 6 - Delta II", lat: 28.4890, lng: 77.5250 },
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      slaRemaining: "14h 10m remaining",
      assignedOfficer: "Dr. Vinod Pathak (Chief Sanitary Officer)",
      upvotes: 67,
      hasUpvoted: false
    },
    {
      id: "g-005",
      _id: "g-005",
      refId: "RN20260920E8120",
      title: "Malfunctioning Traffic Signals at Crossing",
      description: "Traffic lights stuck on blinking yellow causing heavy gridlock during peak hours.",
      category: "Traffic & Mobility",
      department: "Traffic & Mobility Cell",
      severity: "high",
      status: "in_progress",
      location: { address: "Surajpur Chowk Crossing", ward: "Ward 1 - Surajpur", lat: 28.5120, lng: 77.4910 },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      slaRemaining: "3h 30m remaining",
      assignedOfficer: "ACP Traffic HQ",
      upvotes: 53,
      hasUpvoted: false
    }
  ];

  // Storage keys for persistent community synchronization across refreshes/users
  const COMMUNITY_STORAGE_KEY = "inpact_community_feed_issues";
  const MY_GRIEVANCES_STORAGE_KEY = "inpact_my_grievances";

  const getStoredCommunityGrievances = () => {
    try {
      const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const saveGrievanceToStorage = (newIssue) => {
    try {
      const existing = getStoredCommunityGrievances();
      const filtered = existing.filter((g) => g.id !== newIssue.id && g.refId !== newIssue.refId);
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify([newIssue, ...filtered]));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const updateGrievanceVoteInStorage = (id, upvotes, hasUpvoted) => {
    try {
      const existing = getStoredCommunityGrievances();
      const updated = existing.map((g) => {
        if (g.id === id || g._id === id || g.refId === id) {
          return { ...g, upvotes, hasUpvoted };
        }
        return g;
      });
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update vote in localStorage", e);
    }
  };

  const loadMyGrievances = () => {
    setLoadingMy(true);
    setMyError(null);
    getMyIssues()
      .then((issues) => {
        const stored = getStoredCommunityGrievances().filter((g) => g.isUserSubmitted);
        if (issues && issues.length > 0) {
          const apiMapped = issues.map(mapIssue);
          const combined = [...stored];
          apiMapped.forEach((apiG) => {
            if (!combined.some((c) => c.id === apiG.id || c.refId === apiG.refId)) {
              combined.push(apiG);
            }
          });
          setMyGrievances(combined);
        } else {
          const combined = [...stored];
          DEMO_CITIZEN_GRIEVANCES.forEach((demoG) => {
            if (!combined.some((c) => c.id === demoG.id || c.refId === demoG.refId)) {
              combined.push(demoG);
            }
          });
          setMyGrievances(combined);
        }
      })
      .catch(() => {
        const stored = getStoredCommunityGrievances().filter((g) => g.isUserSubmitted);
        const combined = [...stored];
        DEMO_CITIZEN_GRIEVANCES.forEach((demoG) => {
          if (!combined.some((c) => c.id === demoG.id || c.refId === demoG.refId)) {
            combined.push(demoG);
          }
        });
        setMyGrievances(combined);
      })
      .finally(() => setLoadingMy(false));
  };

  const loadCommunityFeed = () => {
    setLoadingCommunity(true);
    setCommunityError(null);
    getIssues()
      .then((issues) => {
        const stored = getStoredCommunityGrievances();
        if (issues && issues.length > 0) {
          const apiMapped = issues.map(mapIssue);
          const combined = [...stored];
          apiMapped.forEach((apiG) => {
            if (!combined.some((c) => c.id === apiG.id || c.refId === apiG.refId)) {
              combined.push(apiG);
            }
          });
          setCommunityGrievances(combined);
        } else {
          const combined = [...stored];
          DEMO_COMMUNITY_GRIEVANCES.forEach((demoG) => {
            if (!combined.some((c) => c.id === demoG.id || c.refId === demoG.refId)) {
              combined.push(demoG);
            }
          });
          setCommunityGrievances(combined);
        }
      })
      .catch(() => {
        const stored = getStoredCommunityGrievances();
        const combined = [...stored];
        DEMO_COMMUNITY_GRIEVANCES.forEach((demoG) => {
          if (!combined.some((c) => c.id === demoG.id || c.refId === demoG.refId)) {
            combined.push(demoG);
          }
        });
        setCommunityGrievances(combined);
      })
      .finally(() => setLoadingCommunity(false));
  };

  useEffect(() => {
    loadMyGrievances();
    loadCommunityFeed();
    if (currentUser?.ward) {
      getStats(currentUser.ward)
        .then((stats) => setWardStats(stats.ward))
        .catch(() => { });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRaiseHand = async (id, grievanceTitle = "") => {
    let isNowRaised = false;
    let newVoteCount = 0;

    // Optimistically update community grievances list
    setCommunityGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id || g._id === id || g.refId === id) {
          isNowRaised = !g.hasUpvoted;
          newVoteCount = isNowRaised ? (g.upvotes || 0) + 1 : Math.max(0, (g.upvotes || 0) - 1);
          return {
            ...g,
            upvotes: newVoteCount,
            hasUpvoted: isNowRaised,
          };
        }
        return g;
      })
    );

    // Optimistically update personal grievances list
    setMyGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id || g._id === id || g.refId === id) {
          const raised = !g.hasUpvoted;
          const updatedUpvotes = raised ? (g.upvotes || 0) + 1 : Math.max(0, (g.upvotes || 0) - 1);
          return {
            ...g,
            upvotes: updatedUpvotes,
            hasUpvoted: raised,
          };
        }
        return g;
      })
    );

    // Persist to localStorage
    updateGrievanceVoteInStorage(id, newVoteCount, isNowRaised);

    // Show interactive toast
    setRaiseHandToast({
      id,
      title: grievanceTitle,
      isRaised: isNowRaised,
      message: isNowRaised
        ? `Hand Raised! Priority boosted for ${grievanceTitle || "complaint"}. Escalated to respective department!`
        : `Hand raise removed for ${grievanceTitle || "complaint"}.`,
    });

    setTimeout(() => {
      setRaiseHandToast(null);
    }, 4000);

    try {
      const result = await toggleUpvote(id);
      if (result && result.upvotes !== undefined) {
        setCommunityGrievances((prev) =>
          prev.map((g) =>
            g.id === id || g._id === id ? { ...g, upvotes: result.upvotes, hasUpvoted: result.hasUpvoted } : g
          )
        );
        setMyGrievances((prev) =>
          prev.map((g) =>
            g.id === id || g._id === id ? { ...g, upvotes: result.upvotes, hasUpvoted: result.hasUpvoted } : g
          )
        );
        updateGrievanceVoteInStorage(id, result.upvotes, result.hasUpvoted);
      }
    } catch (err) {
      // Keep optimistic state in demo mode
    }
  };

  const handleUpvote = (id) => handleRaiseHand(id);

  // Camera lifecycle handlers
  const handleStartCamera = async (facing = cameraFacingMode) => {
    setCameraError(null);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable on this device. You can still select/upload a photo file.");
      setIsCameraOpen(false);
    }
  };

  const handleStopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const triggerAutoLocationFetch = async (preferredAddress = null, preferredWard = null) => {
    setIsFetchingGps(true);
    try {
      const loc = await getLiveDeviceLocation();
      setFormGps(loc.gpsString);
      if (preferredAddress) {
        setFormLocation(preferredAddress);
      } else if (loc.address) {
        setFormLocation(loc.address);
      }
      if (preferredWard) {
        setFormWard(preferredWard);
      } else if (loc.ward) {
        setFormWard(loc.ward);
      }
      setLocationAutoFetched(true);
    } catch (err) {
      console.warn("GPS auto-detection error:", err);
    } finally {
      setIsFetchingGps(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPhotoPreview(dataUrl);
    setPhotoFileName(cameraFacingMode === "user" ? `camera_selfie_${Date.now()}.jpg` : `camera_capture_${Date.now()}.jpg`);
    setSelectedPresetId(null);
    setFormError(null);
    handleStopCamera();
    // Auto-fetch real-time device location when camera photo is captured
    triggerAutoLocationFetch();
  };

  const handleSwitchCamera = () => {
    const newFacing = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(newFacing);
    handleStartCamera(newFacing);
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleStopCamera();
    setPhotoFileName(file.name);
    setSelectedPresetId(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFormError(null);
    };
    reader.readAsDataURL(file);
    // Auto-fetch real-time GPS location when file is uploaded
    triggerAutoLocationFetch();
  };

  const handleSelectPreset = (preset) => {
    handleStopCamera();
    setSelectedPresetId(preset.id);
    setPhotoPreview(preset.imagePreview);
    setPhotoFileName(`${preset.id}_photo.jpg`);
    setFormDescription(preset.sampleText);
    setFormError(null);
    // Auto-fetch location with preset reference
    triggerAutoLocationFetch();
  };

  const handleClearPhoto = () => {
    handleStopCamera();
    setPhotoPreview(null);
    setPhotoFileName("");
    setSelectedPresetId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSimulateVoiceSample = (sampleText) => {
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecordingVoice(true);
    isRecordingVoiceRef.current = true;
    setFormError(null);
    setLiveVoiceTranscript("");
    setFormDescription("");
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 2;
      if (charIndex <= sampleText.length) {
        const partial = sampleText.substring(0, charIndex);
        setLiveVoiceTranscript(partial);
        setFormDescription(partial);
      } else {
        setLiveVoiceTranscript(sampleText);
        setFormDescription(sampleText);
        clearInterval(interval);
        setTimeout(() => {
          setIsRecordingVoice(false);
          isRecordingVoiceRef.current = false;
        }, 600);
      }
    }, 35);
  };

  const handleToggleVoiceRecording = () => {
    if (isRecordingVoice) {
      isRecordingVoiceRef.current = false;
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFormError("Browser speech recognition is not supported on this browser/device. Please use Google Chrome, Safari, or Microsoft Edge, or click a Quick Voice Sample below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        isRecordingVoiceRef.current = true;
        setLiveVoiceTranscript("");
        setFormError(null);
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript + " ";
          }
        }
        const combined = (final + interim).trim();
        if (combined) {
          setLiveVoiceTranscript(combined);
          setFormDescription(combined);
          setFormError(null);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition event:", event.error);
        if (event.error === "no-speech") {
          return; // Keep listening patiently
        }
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setFormError("Microphone access was blocked. Please click the lock / settings icon in your browser address bar to allow microphone access, or use the 1-Click Voice Samples below.");
        }
        setIsRecordingVoice(false);
        isRecordingVoiceRef.current = false;
      };

      recognition.onend = () => {
        if (isRecordingVoiceRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsRecordingVoice(false);
            isRecordingVoiceRef.current = false;
          }
        } else {
          setIsRecordingVoice(false);
        }
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition initialization error:", err);
      setIsRecordingVoice(false);
      isRecordingVoiceRef.current = false;
      setFormError("Could not start microphone: " + err.message);
    }
  };

  const handleRunAiDiagnostic = async (e) => {
    if (e) e.preventDefault();
    if (!formDescription.trim()) {
      setFormError("Please enter a problem description of the civic issue (समस्या का विवरण लिखना अनिवार्य है).");
      setAiRejectionDetails(null);
      return;
    }

    setFormError(null);
    setAiRejectionDetails(null);
    setIsAiAnalyzing(true);

    try {
      const result = await analyzeCivicIssue({
        text: formDescription,
        image: photoPreview,
        imagePresetId: selectedPresetId,
        location: formLocation,
        photoFileName: photoFileName,
        isFrontCamera: photoFileName.includes("selfie"),
      });

      if (!result.isValid) {
        setAiRejectionDetails(result);
        setFormError(result.errorMessage || "Please provide a valid grievance.");
        return;
      }

      setAiRejectionDetails(null);
      setAiResult(result);
      setConfirmedTitle(result.title);
      setConfirmedCategory(result.category);
      setConfirmedDepartment(result.department);
      setConfirmedOfficer(result.assignedOfficer);
      setConfirmedSeverity(result.severity);
      setConfirmedSla(result.sla);
      setReportStep("review");
    } catch (err) {
      setFormError("AI Diagnostic failed: " + err.message);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleConfirmAndSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsAiAnalyzing(true);
    setFormError(null);

    const generatedCode = generateReferenceNumber();
    const localNewIssue = {
      id: "local-" + Date.now(),
      _id: "local-" + Date.now(),
      refId: generatedCode,
      title: confirmedTitle || formDescription || "Civic Grievance",
      description: formDescription || confirmedTitle,
      category: confirmedCategory,
      department: confirmedDepartment,
      assignedOfficer: confirmedOfficer,
      severity: confirmedSeverity,
      status: "submitted",
      location: { address: formLocation, ward: formWard },
      imageUrl: photoPreview,
      createdAt: new Date().toISOString(),
      slaRemaining: confirmedSla,
      upvotes: 1,
      hasUpvoted: true,
    };

    try {
      const newIssue = await createIssue({
        title: confirmedTitle || formDescription,
        description: formDescription || confirmedTitle,
        category: confirmedCategory,
        department: confirmedDepartment,
        severity: confirmedSeverity,
        location: { address: formLocation, ward: formWard },
        imageUrl: photoPreview,
      });

      const issueToSave = {
        ...mapIssue(newIssue),
        refId: newIssue.refId || generatedCode,
        assignedOfficer: confirmedOfficer || newIssue.assignedOfficer,
        slaRemaining: confirmedSla || newIssue.slaRemaining,
        upvotes: newIssue.upvotes || 1,
        hasUpvoted: true,
        imageUrl: photoPreview || newIssue.imageUrl,
        isUserSubmitted: true,
      };

      setGeneratedRefId(issueToSave.refId);
      saveGrievanceToStorage(issueToSave);
      saveGrievanceHistory(issueToSave);
      setMyGrievances((prev) => [issueToSave, ...prev.filter((g) => g.id !== issueToSave.id && g.refId !== issueToSave.refId)]);
      setCommunityGrievances((prev) => [issueToSave, ...prev.filter((g) => g.id !== issueToSave.id && g.refId !== issueToSave.refId)]);
      setReportStep("success");
    } catch (err) {
      // Fallback in demo mode / offline
      setGeneratedRefId(generatedCode);
      saveGrievanceToStorage(localNewIssue);
      saveGrievanceHistory(localNewIssue);
      setMyGrievances((prev) => [localNewIssue, ...prev.filter((g) => g.id !== localNewIssue.id && g.refId !== localNewIssue.refId)]);
      setCommunityGrievances((prev) => [localNewIssue, ...prev.filter((g) => g.id !== localNewIssue.id && g.refId !== localNewIssue.refId)]);
      setReportStep("success");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleResetReport = () => {
    setFormDescription("");
    setPhotoPreview(null);
    setPhotoFileName("");
    setSelectedPresetId(null);
    setAiResult(null);
    setGeneratedRefId("");
    setReportStep("input");
    setActiveTab("track");
  };

  return (
    <div className="gov-dashboard-wrapper">
      {/* Official Government Top Bar */}
      <div className="gov-dash-header-strip">
        <div className="gov-container dash-header-inner">
          <div className="dash-header-left">
            <span className="gov-emblem-icon"></span>
            <div>
              <div className="dash-sub">GOVERNMENT OF UTTAR PRADESH • GREATER NOIDA INDUSTRIAL DEVELOPMENT AUTHORITY</div>
              <h2 className="dash-title">Integrated Citizen Grievance Portal (नागरिक डैशबोर्ड)</h2>
            </div>
          </div>

          <div className="dash-header-right">
            <div className="citizen-badge-box">
              <span className="citizen-icon"></span>
              <div className="citizen-info">
                <strong className="citizen-name">{currentUser?.name || "Ananya Sharma"}</strong>
                <span className="citizen-meta">
                  {currentUser?.ward || "Ward 12, Knowledge Park III"} &bull; <span className="verified-text"> Aadhaar Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container dash-layout">
        {/* Left Official Sidebar */}
        <Sidebar
          role="citizen"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewGrievance={() => setActiveTab("report")}
        />

        {/* Right Main Content Area */}
        <div className="dash-main-pane">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="dash-tab-content">
              {loadingMy ? (
                <div className="gov-card dash-card">Loading your grievances…</div>
              ) : myError ? (
                <div className="gov-card dash-card">Couldn't load your grievances: {myError}</div>
              ) : (
                <>
                  {/* Profile Stat Summary Cards */}
                  <div className="dash-stats-row">
                    <StatCard
                      title="My Total Grievances"
                      value={myGrievances.length.toString()}
                      subtitle="Complaints registered"
                      icon={<FileText size={20} />}
                      trend="100% digitally tracked"
                      trendPositive={true}
                    />
                    <StatCard
                      title="In Progress / Triaged"
                      value={myGrievances.filter((g) => g.status !== "resolved").length.toString()}
                      subtitle="Under field action"
                      icon={<Clock size={20} />}
                      trend="Within Statutory SLA"
                      trendPositive={true}
                      variant="warning"
                    />
                    <StatCard
                      title="Resolved & Verified"
                      value={myGrievances.filter((g) => g.status === "resolved").length.toString()}
                      subtitle="Closed with photo proof"
                      icon={<CheckCircle2 size={20} />}
                      trend="Citizen verified"
                      trendPositive={true}
                      variant="success"
                    />
                    <StatCard
                      title={wardStats?.name ? `${wardStats.name} Resolution Rate` : "Ward Resolution Rate"}
                      value={wardStats?.resolutionRate != null ? `${wardStats.resolutionRate}%` : "—"}
                      subtitle="Greater Noida zone benchmark"
                      icon={<TrendingUp size={20} />}
                      trend="Top performing ward"
                      trendPositive={true}
                      variant="purple"
                    />
                  </div>

                  {/* Quick Action Banner */}
                  <div className="gov-action-callout">
                    <div className="callout-text">
                      <h3>Notice a civic hazard in your sector or ward?</h3>
                      <p>Lodge a new grievance with geotagged photo proof. Automated triaging will allocate it to the Nodal Engineer in seconds.</p>
                    </div>
                    <button className="gov-btn-primary" onClick={() => setActiveTab("report")}>
                      <PlusCircle size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                      Lodge New Grievance (शिकायत दर्ज करें)
                    </button>
                  </div>

                  {/* Active Grievances Tracker */}
                  <div className="gov-card dash-card">
                    <div className="dash-card-header">
                      <div className="card-title-group">
                        <span className="card-icon"><Activity size={18} /></span>
                        <div>
                          <h3>Active Grievance Redressal Status</h3>
                          <p>Real-time lifecycle tracking of your registered complaints</p>
                        </div>
                      </div>
                      <button className="text-btn" onClick={() => setActiveTab("track")}>
                        View All Grievances ({myGrievances.length}) →
                      </button>
                    </div>

                    {myGrievances.length === 0 ? (
                      <p style={{ padding: "16px" }}>
                        You haven't filed any grievances yet. Use "Lodge New Grievance" above to file your first one.
                      </p>
                    ) : (
                      <div className="active-grievances-list">
                        {myGrievances.map((g) => (
                          <div key={g.id} className="grievance-row-card">
                            <div className="g-row-left">
                              <div className="g-ref-line">
                                <span className="g-ref-badge">{g.refId}</span>
                                <span className={`priority-badge priority-${g.severity}`}>
                                  {g.severity.toUpperCase()} PRIORITY
                                </span>
                                <span className="g-dept-text">{g.department}</span>
                              </div>
                              <h4 className="g-title">{g.title}</h4>
                              <p className="g-desc">{g.description}</p>
                              <div className="g-meta-row">
                                <span><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{g.location?.address || g.location?.ward || "—"}</span>
                                <span><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{new Date(g.createdAt).toLocaleString("en-IN")}</span>
                                <span className="sla-pill"><Clock size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> {g.slaRemaining}</span>
                              </div>
                            </div>

                            <div className="g-row-right">
                              <span className={`status-badge-block ${g.status === "resolved" ? "status-resolved" : "status-progress"}`}>
                                {g.status === "resolved" ? "Resolved & Closed" : "In Progress (Field Action)"}
                              </span>
                              <button
                                className="gov-btn-outline-sm"
                                onClick={() => {
                                  setSelectedIssue(g);
                                  setActiveTab("track");
                                }}
                              >
                                View Audit Trail & Receipt →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: AI-POWERED GRIEVANCE LODGING & MULTI-MODAL INGESTION */}
          {activeTab === "report" && (
            <div className="dash-tab-content report-tab-clean">
              {/* Clean 3-Step Progression Bar */}
              <div className="report-step-stepper">
                <div className={`stepper-step ${reportStep === "input" ? "active" : "completed"}`}>
                  <span className="step-num">{reportStep === "review" || reportStep === "success" ? <Check size={14} /> : "1"}</span>
                  <div className="step-text-wrap">
                    <span className="step-title">Evidence & Details</span>
                    <span className="step-sub">Camera / Text Input</span>
                  </div>
                </div>
                <div className={`stepper-line ${reportStep === "review" || reportStep === "success" ? "filled" : ""}`}></div>
                <div className={`stepper-step ${reportStep === "review" ? "active" : reportStep === "success" ? "completed" : ""}`}>
                  <span className="step-num">{reportStep === "success" ? <Check size={14} /> : "2"}</span>
                  <div className="step-text-wrap">
                    <span className="step-title">AI Triaging & Routing</span>
                    <span className="step-sub">Verify Department & SLA</span>
                  </div>
                </div>
                <div className={`stepper-line ${reportStep === "success" ? "filled" : ""}`}></div>
                <div className={`stepper-step ${reportStep === "success" ? "active" : ""}`}>
                  <span className="step-num">3</span>
                  <div className="step-text-wrap">
                    <span className="step-title">Official Receipt</span>
                    <span className="step-sub">Statutory Tracking ID</span>
                  </div>
                </div>
              </div>

              {/* STEP 1: UNIFIED MULTI-MODAL INGESTION FORM */}
              {reportStep === "input" && (
                <div className="gov-card form-wrapper-card clean-form-card">
                  <div className="ai-report-header">
                    <div className="ai-badge-top">
                      <span className="ai-sparkle-icon"><Sparkles size={14} /></span>
                      <span>SMART CIVIC REPORTING ENGINE</span>
                    </div>
                    <h2>Lodge a Public Civic Grievance</h2>
                    <p className="ai-header-sub">
                      Capture live photos, upload images, or describe the defect. Our AI/ML triaging engine automatically determines the department, priority, and nodal engineer for your confirmation.
                    </p>
                  </div>

                  <form onSubmit={handleRunAiDiagnostic} className="ai-ingest-form">
                    {/* 1. PHOTOGRAPH & CAMERA EVIDENCE SECTION */}
                    <div className="gov-form-group">
                      <label className="gov-form-label">
                        <span>Photograph & Visual Evidence (लाइव कैमरा या फोटो)</span>
                        <span className="label-sub-tag">AI Computer Vision Enabled</span>
                      </label>

                      {/* Hidden File Input & Canvas for Frame Grabbing */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePhotoFileChange}
                        style={{ display: "none" }}
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />

                      {/* Camera Viewfinder Active */}
                      {isCameraOpen ? (
                        <div className="live-camera-viewfinder-card">
                          <div className="camera-video-wrapper">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="live-camera-video"
                            />
                            <div className="camera-overlay-crosshair">
                              <span className="crosshair-corner top-left"></span>
                              <span className="crosshair-corner top-right"></span>
                              <span className="crosshair-corner bottom-left"></span>
                              <span className="crosshair-corner bottom-right"></span>
                              <span className="camera-live-badge">LIVE CAMERA</span>
                            </div>
                          </div>

                          <div className="camera-controls-bar">
                            <button
                              type="button"
                              className="cam-btn-cancel"
                              onClick={handleStopCamera}
                            >
                              <X size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Cancel
                            </button>

                            <button
                              type="button"
                              className="cam-btn-snap"
                              onClick={handleCapturePhoto}
                            >
                              <Camera size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                              <span>Snap Photo</span>
                            </button>

                            <button
                              type="button"
                              className="cam-btn-switch"
                              onClick={handleSwitchCamera}
                              title="Switch Camera (Front/Back)"
                            >
                              <RefreshCw size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Switch
                            </button>
                          </div>
                        </div>
                      ) : photoPreview ? (
                        /* Photo Captured / Uploaded Preview */
                        <div className="photo-preview-card">
                          <img src={photoPreview} alt="Civic Defect Preview" className="uploaded-defect-img" />
                          <div className="photo-preview-details">
                            <div className="file-info-row">
                              <span className="file-name-pill">{photoFileName || "civic_defect.jpg"}</span>
                              <span className="geotag-auto-pill"><MapPin size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{formGps}</span>
                            </div>
                            <p className="photo-ai-ready-text"><Sparkles size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Visual evidence ready for AI multi-modal classification.</p>
                            <div className="photo-action-buttons">
                              <button
                                type="button"
                                className="retake-photo-btn"
                                onClick={() => handleStartCamera("environment")}
                              >
                                <Camera size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Retake via Camera
                              </button>
                              <button
                                type="button"
                                className="replace-photo-btn"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Replace File
                              </button>
                              <button
                                type="button"
                                className="remove-photo-btn"
                                onClick={handleClearPhoto}
                              >
                                <Trash2 size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Default Multi-Modal Input Box with Dual Options */
                        <div className="multimodal-camera-box">
                          <div className="camera-box-cta-row">
                            <button
                              type="button"
                              className="camera-launch-btn"
                              onClick={() => handleStartCamera("environment")}
                            >
                              <span className="cam-icon-big"><Camera size={28} /></span>
                              <div className="cam-btn-text">
                                <strong>Take Live Photo with Camera</strong>
                                <span>Capture live photo of the civic defect</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              className="upload-file-btn"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <span className="upload-icon-big"><Upload size={28} /></span>
                              <div className="cam-btn-text">
                                <strong>Upload from Gallery / Files</strong>
                                <span>JPEG, PNG, WEBP supported</span>
                              </div>
                            </button>
                          </div>

                          {/* Quick Test Civic Defect Presets */}
                          <div className="preset-selector-strip">
                            <span className="preset-label-text">Or choose a civic defect preset (or test wrong image validation):</span>
                            <div className="preset-chip-list">
                              {CIVIC_PRESETS.map((preset) => (
                                <button
                                  key={preset.id}
                                  type="button"
                                  className={`preset-pill ${selectedPresetId === preset.id ? "active" : ""}`}
                                  onClick={() => handleSelectPreset(preset)}
                                >
                                  {preset.title}
                                </button>
                              ))}
                              {INVALID_IMAGE_PRESETS.map((preset) => (
                                <button
                                  key={preset.id}
                                  type="button"
                                  className={`preset-pill preset-pill-invalid ${selectedPresetId === preset.id ? "active" : ""}`}
                                  onClick={() => handleSelectPreset(preset)}
                                  title="Click to test invalid/wrong image detection"
                                >
                                  {preset.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {cameraError && (
                        <div className="camera-error-banner">
                          <span>{cameraError}</span>
                          <button
                            type="button"
                            className="cam-error-dismiss"
                            onClick={() => setCameraError(null)}
                          >
                            <X size={14} /> Dismiss
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. PROBLEM DESCRIPTION SECTION WITH VOICE COMPLAINT */}
                    <div className="gov-form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
                        <label className="gov-form-label" style={{ marginBottom: 0 }}>
                          <span>Problem Description (समस्या का पूरा विवरण) *</span>
                          <span className="label-sub-tag" style={{ color: "#E11D48", fontWeight: 700 }}>* Mandatory • Multilingual NLP</span>
                        </label>

                        {/* Live Voice Input Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <select
                            value={voiceLanguage}
                            onChange={(e) => setVoiceLanguage(e.target.value)}
                            disabled={isRecordingVoice}
                            style={{
                              fontSize: "11px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              border: "1px solid #CBD5E1",
                              background: "#FFF",
                              color: "#334155",
                              cursor: "pointer"
                            }}
                            title="Select speech language"
                          >
                            <option value="hi-IN">🇮🇳 हिन्दी (Hindi)</option>
                            <option value="en-IN">🇬🇧 English</option>
                          </select>

                          <button
                            type="button"
                            onClick={handleToggleVoiceRecording}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: isRecordingVoice ? "1px solid #E11D48" : "1px solid #CBD5E1",
                              background: isRecordingVoice ? "#FFE4E6" : "#F8FAFC",
                              color: isRecordingVoice ? "#BE123C" : "#0F172A",
                              transition: "all 0.2s"
                            }}
                            title="Click to speak and transcribe description automatically"
                          >
                            {isRecordingVoice ? (
                              <>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E11D48", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                                <MicOff size={13} color="#BE123C" />
                                <span>Stop Recording</span>
                              </>
                            ) : (
                              <>
                                <Mic size={13} color="#002B49" />
                                <span>Speak (बोलकर लिखें)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {isRecordingVoice && (
                        <div style={{
                          padding: "10px 14px",
                          background: "#FFF1F2",
                          border: "1.5px solid #FDA4AF",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          fontSize: "12px",
                          color: "#9F1239",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ position: "relative", display: "flex", height: "10px", width: "10px" }}>
                                <span style={{ animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", position: "absolute", display: "inline-flex", height: "100%", width: "100%", borderRadius: "50%", background: "#E11D48", opacity: 0.75 }}></span>
                                <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: "10px", width: "10px", background: "#BE123C" }}></span>
                              </span>
                              <strong>Listening ({voiceLanguage === "hi-IN" ? "हिन्दी / Hindi" : "English"})...</strong>
                              <span style={{ color: "#881337", fontSize: "11px" }}>Speak into your microphone</span>
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: 600, color: "#BE123C" }}>🔴 LIVE STREAM</span>
                          </div>

                          {liveVoiceTranscript ? (
                            <div style={{
                              background: "#FFE4E6",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              borderLeft: "3px solid #E11D48",
                              color: "#881337",
                              fontSize: "12px",
                              fontWeight: 500,
                              fontStyle: "italic"
                            }}>
                              “{liveVoiceTranscript}”
                            </div>
                          ) : (
                            <div style={{ color: "#9F1239", fontSize: "11px", opacity: 0.85 }}>
                              Waiting for your voice... (If nothing appears, make sure your browser has microphone permission enabled)
                            </div>
                          )}
                        </div>
                      )}

                      <textarea
                        className="gov-textarea"
                        rows={3}
                        required
                        placeholder="Describe the defect (e.g. Deep pothole causing accidents near metro pillar 42, sparking 11kV transformer, stormwater drain overflow, garbage dump on road) or click 'Speak' above..."
                        value={formDescription}
                        onChange={(e) => {
                          setFormDescription(e.target.value);
                          setFormError(null);
                        }}
                      />

                      {/* Quick Voice Simulation Sample Chips */}
                      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontSize: "11px", color: "#64748B" }}>
                        <span style={{ fontWeight: 600 }}>Quick Voice Samples:</span>
                        <button
                          type="button"
                          onClick={() => handleSimulateVoiceSample("पारी चौक के पास गहरा गड्ढा है जिससे गाड़ियां टकरा रही हैं")}
                          style={{ border: "1px solid #CBD5E1", background: "#F1F5F9", padding: "2px 8px", borderRadius: "12px", cursor: "pointer", color: "#1E293B", fontSize: "11px" }}
                        >
                          🇮🇳 "पारी चौक के पास गहरा गड्ढा है..."
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulateVoiceSample("High tension 11kV electrical cable sagging dangerously near residential gate in Alpha 1")}
                          style={{ border: "1px solid #CBD5E1", background: "#F1F5F9", padding: "2px 8px", borderRadius: "12px", cursor: "pointer", color: "#1E293B", fontSize: "11px" }}
                        >
                          🇬🇧 "11kV electrical cable sagging..."
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulateVoiceSample("Main stormwater culvert drain clogged with garbage causing heavy waterlogging")}
                          style={{ border: "1px solid #CBD5E1", background: "#F1F5F9", padding: "2px 8px", borderRadius: "12px", cursor: "pointer", color: "#1E293B", fontSize: "11px" }}
                        >
                          🇬🇧 "Culvert drain choked..."
                        </button>
                      </div>
                    </div>

                    {/* GPS Auto-Fetching Status Banner */}
                    {isFetchingGps && (
                      <div className="gps-fetching-alert">
                        <span className="gps-pulse-ping"><Compass size={16} /></span>
                        <span>Extracting Geolocation & Address from image/device...</span>
                      </div>
                    )}

                    {/* 3. LOCATION & WARD */}
                    <div className="form-grid-2">
                      <div className="gov-form-group">
                        <div className="label-with-action-row">
                          <label className="gov-form-label">
                            <span>Exact Location & Landmark (स्थान / लैंडमार्क) *</span>
                            {locationAutoFetched && (
                              <span className="gps-auto-success-pill"><CheckCircle2 size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> GPS Auto-Mapped</span>
                            )}
                          </label>
                          <button
                            type="button"
                            className="refetch-gps-btn"
                            onClick={() => triggerAutoLocationFetch()}
                            disabled={isFetchingGps}
                            title="Re-fetch current device coordinates"
                          >
                            <Compass size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                            {isFetchingGps ? "Locating..." : "Re-fetch GPS"}
                          </button>
                        </div>
                        <input
                          type="text"
                          className="gov-input"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Knowledge Park III, Near Main Metro Corridor"
                          required
                        />
                      </div>

                      <div className="gov-form-group">
                        <label className="gov-form-label">Municipal Ward / Zone (वार्ड / जोन) *</label>
                        <select
                          className="gov-select"
                          value={formWard}
                          onChange={(e) => setFormWard(e.target.value)}
                          required
                        >
                          <option value="Ward 12 - Knowledge Park III">Ward 12 - Knowledge Park III & Expressways</option>
                          <option value="Ward 5 - Sector Alpha 1 & 2">Ward 5 - Sector Alpha 1 & 2 Commercial</option>
                          <option value="Ward 8 - Sector Beta 1 & 2">Ward 8 - Sector Beta 1 & 2</option>
                          <option value="Ward 9 - Sector Delta 1 & 2">Ward 9 - Sector Delta 1 & 2</option>
                          <option value="Ward 1 - Pari Chowk Central Zone">Ward 1 - Pari Chowk Central Zone</option>
                        </select>
                      </div>
                    </div>

                    {/* GPS Geotag Indicator */}
                    <div className="geotag-live-strip">
                      <div className="gps-indicator-item">
                        <span className="gps-live-dot"><MapPin size={14} /></span>
                        <span><strong>Live Geotag:</strong> {formGps}</span>
                      </div>
                      <span className="gps-status-badge"><ShieldCheck size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Verified Municipal Boundary</span>
                    </div>

                    {/* AI Invalid Grievance Feedback / Error Banner */}
                    {aiRejectionDetails ? (
                      <div className="ai-invalid-grievance-card">
                        <div className="invalid-card-header">
                          <span className="invalid-icon"><AlertTriangle size={20} /></span>
                          <div>
                            <h4>Provide Valid Grievance Details (कृपया वैध नागरिक समस्या दर्ज करें)</h4>
                            <p className="invalid-msg-main">{aiRejectionDetails.errorMessage}</p>
                          </div>
                        </div>

                        {aiRejectionDetails.guidance && (
                          <div className="invalid-guidance-box">
                            <span className="guidance-title">Reason for Rejection:</span>
                            <p>{aiRejectionDetails.guidance}</p>
                          </div>
                        )}

                        {/* Quick Retake / Upload Relevant Photo Buttons */}
                        <div className="invalid-quick-actions-bar">
                          <span className="invalid-act-label">Action Required:</span>
                          <div className="invalid-act-buttons">
                            <button
                              type="button"
                              className="invalid-action-cam-btn"
                              onClick={() => {
                                setAiRejectionDetails(null);
                                setFormError(null);
                                handleStartCamera("environment");
                              }}
                            >
                              <Camera size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                              Click Relevant Image via Camera
                            </button>
                            <button
                              type="button"
                              className="invalid-action-upload-btn"
                              onClick={() => {
                                setAiRejectionDetails(null);
                                setFormError(null);
                                fileInputRef.current?.click();
                              }}
                            >
                              <Upload size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                              Upload Relevant Image from Files
                            </button>
                            {photoPreview && (
                              <button
                                type="button"
                                className="invalid-action-clear-btn"
                                onClick={() => {
                                  handleClearPhoto();
                                  setAiRejectionDetails(null);
                                  setFormError(null);
                                }}
                              >
                                <Trash2 size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                Remove Irrelevant Photo
                              </button>
                            )}
                          </div>
                        </div>

                        {aiRejectionDetails.suggestedExamples && (
                          <div className="suggested-examples-section">
                            <span className="sug-label">Or choose a valid civic defect description:</span>
                            <div className="sug-pill-grid">
                              {aiRejectionDetails.suggestedExamples.map((example, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="sug-example-chip"
                                  onClick={() => {
                                    setFormDescription(example);
                                    setAiRejectionDetails(null);
                                    setFormError(null);
                                  }}
                                >
                                  + {example}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : formError ? (
                      <div className="ai-error-banner">
                        <AlertTriangle size={15} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                        {formError}
                      </div>
                    ) : null}

                    {/* Primary AI Triaging Action CTA */}
                    <div className="form-submit-row">
                      <button
                        type="submit"
                        className="ai-run-diagnostic-btn"
                        disabled={isAiAnalyzing}
                      >
                        {isAiAnalyzing ? (
                          <>
                            <span className="spinner-circle"></span>
                            <span>Running Multi-Modal AI Detection & Department Routing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                            <span>Run AI Diagnostic & Triage (समस्या का AI विश्लेषण करें)</span>
                            <ArrowRight size={16} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "6px" }} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: AI REVIEW & CITIZEN CONFIRMATION */}
              {reportStep === "review" && aiResult && (
                <div className="gov-card ai-review-card">
                  <div className="ai-review-header-bar">
                    <div className="review-title-group">
                      <span className="ai-glow-icon"><Sparkles size={18} /></span>
                      <div>
                        <div className="review-tag-row">
                          <span className="ai-verified-tag">AI MULTI-MODAL ANALYSIS COMPLETE</span>
                          <span className="ai-confidence-pill">{aiResult.confidence}% Confidence</span>
                        </div>
                        <h3>Review & Confirm Grievance Triaging</h3>
                        <p>Our AI system has identified the defect and allocated the statutory department. Please verify the findings before submitting.</p>
                      </div>
                    </div>
                  </div>

                  <div className="ai-review-body-grid">
                    {/* Left Evidence Column */}
                    <div className="review-evidence-col">
                      <h4>Multi-Modal Evidence Attached</h4>
                      {photoPreview ? (
                        <div className="review-photo-box">
                          <img src={photoPreview} alt="Evidence" className="review-img-thumb" />
                          <div className="evidence-badge-overlay">Geotagged Photo Evidence</div>
                        </div>
                      ) : (
                        <div className="no-photo-placeholder">
                          <span>Text-Based Grievance Report</span>
                        </div>
                      )}

                      <div className="evidence-desc-box">
                        <span className="k-title">Citizen Description:</span>
                        <p>{formDescription || "No text description entered (Visual evidence provided)."}</p>
                      </div>

                      <div className="evidence-meta-box">
                        <div><strong>Location:</strong> {formLocation}</div>
                        <div><strong>Ward:</strong> {formWard}</div>
                        <div><strong>GPS:</strong> {formGps}</div>
                      </div>
                    </div>

                    {/* Right AI Triaging & Override Column */}
                    <div className="review-decision-col">
                      <div className="ai-triage-verdict-box">
                        <div className="verdict-row highlight-row">
                          <span className="v-label">Identified Defect:</span>
                          <strong className="v-value text-navy">{confirmedTitle}</strong>
                        </div>

                        <div className="verdict-row">
                          <span className="v-label">Civic Category:</span>
                          <select
                            className="gov-select-sm"
                            value={confirmedCategory}
                            onChange={(e) => setConfirmedCategory(e.target.value)}
                          >
                            <option value="Roads & Arterial Infrastructure">Roads & Arterial Infrastructure</option>
                            <option value="Drainage & Flood Control">Drainage & Flood Control</option>
                            <option value="Drinking Water Supply">Drinking Water Supply</option>
                            <option value="Power Grid & Electrical Safety">Power Grid & Electrical Safety</option>
                            <option value="Street Lighting & Public Safety">Street Lighting & Public Safety</option>
                            <option value="Municipal Solid Waste Management">Municipal Solid Waste Management</option>
                            <option value="Traffic Mobility & Road Safety">Traffic Mobility & Road Safety</option>
                          </select>
                        </div>

                        <div className="verdict-row">
                          <span className="v-label">Statutory Department:</span>
                          <select
                            className="gov-select-sm"
                            value={confirmedDepartment}
                            onChange={(e) => setConfirmedDepartment(e.target.value)}
                          >
                            <option value="Public Works Department (PWD - Division 2)">Public Works Department (PWD - Division 2)</option>
                            <option value="UP Jal Nigam (Stormwater & Sewerage Wing)">UP Jal Nigam (Stormwater & Sewerage Wing)</option>
                            <option value="UP Jal Nigam (Water Supply Division)">UP Jal Nigam (Water Supply Division)</option>
                            <option value="NPCL State Power Distribution Grid">NPCL State Power Distribution Grid</option>
                            <option value="NPCL Electrical Maintenance Wing">NPCL Electrical Maintenance Wing</option>
                            <option value="GNIDA Health & Sanitation Department">GNIDA Health & Sanitation Department</option>
                            <option value="Traffic & Mobility Cell">Traffic & Mobility Cell</option>
                          </select>
                        </div>

                        <div className="verdict-row">
                          <span className="v-label">Assigned Nodal Officer:</span>
                          <strong className="v-value">{confirmedOfficer}</strong>
                        </div>

                        <div className="verdict-row">
                          <span className="v-label">Assessed Severity:</span>
                          <div className="severity-toggle-row">
                            <button
                              type="button"
                              className={`sev-btn ${confirmedSeverity === "critical" ? "sev-crit-active" : ""}`}
                              onClick={() => {
                                setConfirmedSeverity("critical");
                                setConfirmedSla("6 Hours Emergency Statutory SLA");
                              }}
                            >
                              CRITICAL
                            </button>
                            <button
                              type="button"
                              className={`sev-btn ${confirmedSeverity === "high" ? "sev-high-active" : ""}`}
                              onClick={() => {
                                setConfirmedSeverity("high");
                                setConfirmedSla("12 Hours Pre-Monsoon SLA");
                              }}
                            >
                              HIGH
                            </button>
                            <button
                              type="button"
                              className={`sev-btn ${confirmedSeverity === "medium" || confirmedSeverity === "moderate" ? "sev-med-active" : ""}`}
                              onClick={() => {
                                setConfirmedSeverity("medium");
                                setConfirmedSla("24 Hours Standard SLA");
                              }}
                            >
                              MODERATE
                            </button>
                          </div>
                        </div>

                        <div className="verdict-row">
                          <span className="v-label">Mandated SLA Timer:</span>
                          <strong className="v-value text-saffron"><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> {confirmedSla}</strong>
                        </div>
                      </div>

                      {/* Detected Hazard Tags */}
                      {aiResult.tags && aiResult.tags.length > 0 && (
                        <div className="detected-tags-strip">
                          <span className="tags-label">Detected Infrastructure Tags:</span>
                          <div className="tags-pill-list">
                            {aiResult.tags.map((tag, i) => (
                              <span key={i} className="hazard-tag-pill">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formError && (
                        <div className="ai-error-banner" style={{ marginTop: "10px" }}>
                          <AlertTriangle size={15} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                          {formError}
                        </div>
                      )}

                      {/* Action Confirmation Buttons */}
                      <div className="review-action-row">
                        <button
                          type="button"
                          className="gov-btn-secondary"
                          onClick={() => setReportStep("input")}
                          disabled={isAiAnalyzing}
                        >
                          <RefreshCw size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                          Modify Input / Re-analyze
                        </button>

                        <button
                          type="button"
                          className="confirm-submit-btn"
                          onClick={handleConfirmAndSubmit}
                          disabled={isAiAnalyzing}
                        >
                          {isAiAnalyzing ? (
                            "Registering Complaint in Central Registry..."
                          ) : (
                            <>
                              <CheckCircle2 size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                              <span>Confirm AI Routing & Officially Submit Grievance (शिकायत जमा करें)</span>
                              <ArrowRight size={16} style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "6px" }} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: OFFICIAL ACKNOWLEDGEMENT SLIP (SUCCESS) */}
              {reportStep === "success" && (
                <div className="gov-card submission-success-card">
                  <div className="success-seal">
                    <ShieldCheck size={36} color="#059669" />
                  </div>
                  <span className="success-badge-official"><CheckCircle2 size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> GRIEVANCE REGISTERED & ROUTED SUCCESSFULLY</span>
                  <h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                    Acknowledgement Reference: <strong style={{ color: "#0F172A", letterSpacing: "0.5px" }}>{generatedRefId}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        if (generatedRefId) {
                          navigator.clipboard?.writeText(generatedRefId);
                          setCopiedRef(true);
                          setTimeout(() => setCopiedRef(false), 2500);
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        background: copiedRef ? "#ECFDF5" : "#F8FAFC",
                        color: copiedRef ? "#059669" : "#334155",
                        cursor: "pointer"
                      }}
                      title="Copy Reference Number"
                    >
                      {copiedRef ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                      {copiedRef ? "Copied!" : "Copy ID"}
                    </button>
                  </h2>
                  <p className="success-desc">
                    Your civic issue has been officially registered with Reference ID <strong>{generatedRefId}</strong> and routed to <strong>{confirmedDepartment}</strong> with an active statutory SLA timer.
                  </p>

                  <div className="official-receipt-box">
                    <div className="receipt-header">
                      <span>GOVERNMENT OF UTTAR PRADESH • OFFICIAL ACKNOWLEDGEMENT SLIP</span>
                      <span>DATE: {new Date().toLocaleDateString("en-IN")}</span>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
                      <div className="receipt-grid">
                        <div><span className="r-label">Grievance Ref ID:</span> <strong style={{ color: "#002B49" }}>{generatedRefId}</strong></div>
                        <div><span className="r-label">Complainant:</span> <strong>{currentUser?.name || "Ananya Sharma"}</strong></div>
                        <div><span className="r-label">Identified Category:</span> <strong>{confirmedCategory}</strong></div>
                        <div><span className="r-label">Nodal Department:</span> <strong>{confirmedDepartment}</strong></div>
                        <div><span className="r-label">Designated Officer:</span> <strong>{confirmedOfficer}</strong></div>
                        <div><span className="r-label">Priority / Mandated SLA:</span> <strong className="text-saffron"><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{confirmedSeverity.toUpperCase()} ({confirmedSla})</strong></div>
                        <div><span className="r-label">GPS Geotag:</span> <span><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />{formGps}</span></div>
                        <div><span className="r-label">Designated Ward:</span> <span>{formWard}</span></div>
                      </div>

                      {/* Official Digital Verification QR Code Card */}
                      <div style={{ background: "#FFF", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "12px", textAlign: "center", minWidth: "120px" }}>
                        <div style={{ background: "#0F172A", color: "#FFF", padding: "8px", borderRadius: "6px", display: "inline-block", marginBottom: "6px" }}>
                          <QrCode size={52} />
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#002B49", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Official QR Seal
                        </div>
                        <div style={{ fontSize: "9px", color: "#64748B" }}>
                          Scan to verify on IN-PACT
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="success-actions">
                    <button
                      className="gov-btn-primary"
                      onClick={() => {
                        setFormDescription("");
                        setPhotoPreview(null);
                        setPhotoFileName("");
                        setSelectedPresetId(null);
                        setAiResult(null);
                        setReportStep("input");
                        setActiveTab("community");
                      }}
                    >
                      <Users size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                      View Live on Community Board →
                    </button>
                    <button className="gov-btn-secondary" onClick={handleResetReport}>
                      <Clock size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                      Track in My Grievances
                    </button>
                    <button className="gov-btn-secondary" onClick={() => window.print()}>
                      <Printer size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                      Print Official Receipt (PDF)
                    </button>
                    <button className="gov-btn-secondary" onClick={() => setReportStep("input")}>
                      <PlusCircle size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                      File Another Grievance
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK GRIEVANCES & HAND-RAISE PRIORITY ESCALATION */}
          {activeTab === "track" && (
            <div className="dash-tab-content">
              {/* Floating Hand-Raise Priority Boost Alert Toast */}
              {raiseHandToast && (
                <div className="hand-raise-floating-toast">
                  <span className="toast-icon"><Flame size={16} /></span>
                  <div className="toast-text-wrap">
                    <strong>Priority Boost Triggered!</strong>
                    <span>{raiseHandToast.message}</span>
                  </div>
                  <button
                    type="button"
                    className="toast-close-btn"
                    onClick={() => setRaiseHandToast(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="gov-card track-list-card">
                <div className="dash-card-header track-header-flex">
                  <div className="card-title-group">
                    <span className="card-icon"><FileText size={18} /></span>
                    <div>
                      <h3>Official Grievance Dossier & Live Priority Tracker</h3>
                      <p>Track audit trails, Nodal Engineers, and raise your hand to escalate critical civic issues to departments.</p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="track-filter-pills">
                    <button
                      type="button"
                      className={`track-filter-pill ${trackFilter === "all" ? "active" : ""}`}
                      onClick={() => setTrackFilter("all")}
                    >
                      <Layers size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                      All Complaints ({communityGrievances.length})
                    </button>
                    <button
                      type="button"
                      className={`track-filter-pill ${trackFilter === "highest_priority" ? "active" : ""}`}
                      onClick={() => setTrackFilter("highest_priority")}
                    >
                      <Flame size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                      Highest Priority / Most Hands Raised
                    </button>
                    <button
                      type="button"
                      className={`track-filter-pill ${trackFilter === "my" ? "active" : ""}`}
                      onClick={() => setTrackFilter("my")}
                    >
                      <Users size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                      My Complaints ({myGrievances.length})
                    </button>
                  </div>
                </div>

                {/* Hand Raise Feature Information Strip */}
                <div className="hand-raise-info-strip">
                  <div className="info-icon-col"><Flame size={20} color="#D97706" /></div>
                  <div className="info-text-col">
                    <strong>Citizen Hand-Raise & Priority Acceleration System:</strong>
                    <span>
                      Civic issues with more citizen hand-raises receive priority escalation in the municipal dispatch queue, alerting the Executive Engineer and accelerating repair team dispatch.
                    </span>
                  </div>
                </div>

                {/* Quick Reference Search Bar */}
                <div style={{ padding: "12px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", gap: "10px", alignItems: "center" }}>
                  <Search size={16} style={{ color: "#64748B", flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search by Reference Number (e.g. RN20260920A4819) or keyword..."
                    value={trackSearchQuery}
                    onChange={(e) => setTrackSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      fontSize: "14px",
                      outline: "none",
                      color: "#1E293B"
                    }}
                  />
                  {trackSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTrackSearchQuery("")}
                      style={{ border: "none", background: "none", cursor: "pointer", color: "#64748B", fontSize: "12px", padding: "2px 6px" }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {loadingMy && loadingCommunity ? (
                  <p style={{ padding: "24px", color: "#64748B", textAlign: "center" }}>Loading official grievance records…</p>
                ) : (
                  <div className="grievance-dossier-list">
                    {(() => {
                      let list = trackFilter === "my" ? myGrievances : communityGrievances;
                      if (trackFilter === "highest_priority") {
                        list = [...communityGrievances].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
                      }
                      if (trackSearchQuery.trim()) {
                        const q = trackSearchQuery.trim().toLowerCase();
                        list = list.filter(g =>
                          (g.refId && g.refId.toLowerCase().includes(q)) ||
                          (g.title && g.title.toLowerCase().includes(q)) ||
                          (g.department && g.department.toLowerCase().includes(q)) ||
                          (g.category && g.category.toLowerCase().includes(q))
                        );
                      }
                      if (!list || list.length === 0) {
                        return (
                          <div style={{ padding: "36px 24px", textAlign: "center", color: "#64748B" }}>
                            <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "6px" }}>No complaints found matching "{trackSearchQuery}".</p>
                            <p style={{ fontSize: "13px" }}>Check the reference number format (e.g., RN20260920A4819) or select "All Complaints".</p>
                          </div>
                        );
                      }
                      return list.map((g) => (
                        <div key={g.id || g._id} className="dossier-card">
                          <div className="dossier-top">
                            <div className="dossier-ref-group">
                              <span className="dossier-ref-pill">{g.refId || "RN-LIVE"}</span>
                              <span className={`priority-badge priority-${g.severity || "medium"}`}>
                                {(g.severity || "medium").toUpperCase()} PRIORITY
                              </span>
                              <span className="dossier-dept">{g.department}</span>
                            </div>
                          </div>

                          {/* HAND-RAISE PRIORITY BOOST BAR */}
                          <div className="dossier-hand-raise-strip">
                            <div className="hand-raise-action-group">
                              <button
                                type="button"
                                className={`hand-raise-boost-btn ${g.hasUpvoted ? "active-raised" : ""}`}
                                onClick={() => handleRaiseHand(g.id || g._id, g.title || g.refId)}
                                title="Raise hand to boost priority and escalate to department"
                              >
                                <span className="hand-raise-icon"><ThumbsUp size={15} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
                                <span className="hand-raise-text">
                                  {g.hasUpvoted ? "Hand Raised (Priority Boost Active)" : "Raise Hand to Escalate Priority"}
                                </span>
                                <span className="hand-raise-counter">{g.upvotes || 0}</span>
                              </button>
                              <span className="hand-raise-hint">
                                {g.hasUpvoted
                                  ? " Your endorsement elevated this complaint in the department queue."
                                  : "Click to endorse & accelerate municipal repair crew dispatch."}
                              </span>
                            </div>

                            {(g.upvotes || 0) >= 30 ? (
                              <span className="priority-escalated-pill">
                                <Flame size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                HIGH COMMUNITY URGENCY (ESCALATED)
                              </span>
                            ) : (
                              <span className="priority-normal-pill">
                                <Users size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                {g.upvotes || 0} Citizens Endorsed
                              </span>
                            )}
                          </div>

                          <h4 className="dossier-title">{g.title}</h4>
                          <p className="dossier-desc">{g.description}</p>

                          <div className="dossier-meta-grid">
                            <div>
                              <span className="m-label"><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Registered Location:</span>
                              <span>{g.location?.address || g.location?.ward || "Greater Noida Ward 12"}</span>
                            </div>
                            <div>
                              <span className="m-label"><Building2 size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Assigned Nodal Officer:</span>
                              <strong>{g.assignedOfficer || "Er. S.K. Sharma (Executive Engineer)"}</strong>
                            </div>
                            <div>
                              <span className="m-label"><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Statutory Target SLA:</span>
                              <strong className="text-saffron">{g.slaRemaining || "6h remaining"}</strong>
                            </div>
                            <div>
                              <span className="m-label"><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /> Registered Timestamp:</span>
                              <span>{new Date(g.createdAt || Date.now()).toLocaleString("en-IN")}</span>
                            </div>
                          </div>

                          {/* Official Timeline */}
                          {g.timeline && (
                            <div className="dossier-timeline-section">
                              <span className="timeline-section-title">Official Action & Resolution Audit Trail:</span>
                              <div className="timeline-steps">
                                {g.timeline.map((step, idx) => (
                                  <div key={idx} className={`timeline-step-item ${step.done ? "completed" : "pending"}`}>
                                    <div className="step-bullet">{step.done ? <CheckCircle2 size={14} color="#059669" /> : <Clock size={14} color="#94A3B8" />}</div>
                                    <div className="step-details">
                                      <span className="step-time">{step.time}</span>
                                      <span className="step-desc">{step.label}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="dossier-footer-actions">
                            <button className="gov-btn-outline-sm" onClick={() => window.print()}>
                              <Printer size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                              Print Acknowledgement Receipt
                            </button>
                            {g.status !== "resolved" && (
                              <span className="esc-notice">
                                Eligible for DM escalation if unresolved past SLA
                              </span>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GIS MAP VIEW */}
          {activeTab === "map" && (
            <div className="dash-tab-content">
              <div className="gov-card map-tab-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon"><MapPin size={18} /></span>
                    <div>
                      <h3>Greater Noida Ward 12 & Metropolitan GIS Telemetry</h3>
                      <p>Visual map of reported infrastructure defects, repair crews, and municipal zones</p>
                    </div>
                  </div>
                </div>
                <MapView city="Greater Noida" />
              </div>
            </div>
          )}

          {/* TAB 5: CLEAN MODERN COMMUNITY GRIEVANCE FEED */}
          {activeTab === "community" && (
            <div className="dash-tab-content community-feed-tab-clean">
              {/* Top Jurisdiction & Header Banner */}
              <div className="community-header-banner">
                <div className="comm-banner-left">
                  <div className="comm-jurisdiction-pill">
                    <span className="live-dot-pulse"></span>
                    <span>Greater Noida Metropolitan • Ward 12 & Knowledge Park Zone</span>
                  </div>
                  <h2>Ward 12 Community Grievance Board</h2>
                  <p className="comm-banner-sub">
                    Public civic defects reported by fellow residents in your jurisdiction. Endorse complaints with a <strong>Hand Raise</strong> to elevate statutory priority for municipal repair squads.
                  </p>
                </div>
                <div className="comm-banner-cta">
                  <button className="gov-btn-primary" onClick={() => setActiveTab("report")}>
                    <PlusCircle size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
                    Report Civic Defect in Ward
                  </button>
                </div>
              </div>

              {/* Community Live Telemetry KPI Metrics */}
              <div className="community-stats-grid">
                <div className="comm-stat-card">
                  <div className="comm-stat-icon-wrap icon-blue"><FileText size={20} /></div>
                  <div className="comm-stat-info">
                    <span className="comm-stat-val">{communityGrievances.length}</span>
                    <span className="comm-stat-lbl">Active Ward Complaints</span>
                  </div>
                </div>

                <div className="comm-stat-card">
                  <div className="comm-stat-icon-wrap icon-purple"><ThumbsUp size={20} /></div>
                  <div className="comm-stat-info">
                    <span className="comm-stat-val">
                      {communityGrievances.reduce((acc, g) => acc + (g.upvotes || 0), 0)}
                    </span>
                    <span className="comm-stat-lbl">Citizen Hand-Raises</span>
                  </div>
                </div>

                <div className="comm-stat-card">
                  <div className="comm-stat-icon-wrap icon-red"><AlertTriangle size={20} /></div>
                  <div className="comm-stat-info">
                    <span className="comm-stat-val">
                      {communityGrievances.filter((g) => g.severity === "critical").length}
                    </span>
                    <span className="comm-stat-lbl">Critical Emergencies</span>
                  </div>
                </div>

                <div className="comm-stat-card">
                  <div className="comm-stat-icon-wrap icon-green"><CheckCircle2 size={20} /></div>
                  <div className="comm-stat-info">
                    <span className="comm-stat-val">{wardStats?.rate || "94.2%"}</span>
                    <span className="comm-stat-lbl">Ward SLA Redressal Rate</span>
                  </div>
                </div>
              </div>

              {/* Search, Filter & Sort Controls Bar */}
              <div className="community-controls-card">
                <div className="comm-controls-top-row">
                  {/* Search Box */}
                  <div className="comm-search-box">
                    <span className="search-icon"><Search size={16} /></span>
                    <input
                      type="text"
                      className="comm-search-input"
                      placeholder="Search community grievances by title, street, department, or keyword..."
                      value={communitySearchQuery}
                      onChange={(e) => setCommunitySearchQuery(e.target.value)}
                    />
                    {communitySearchQuery && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setCommunitySearchQuery("")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Sort Selector */}
                  <div className="comm-sort-box">
                    <label className="comm-sort-label">Sort By:</label>
                    <select
                      className="comm-sort-select"
                      value={communitySortOption}
                      onChange={(e) => setCommunitySortOption(e.target.value)}
                    >
                      <option value="most_supported">Most Supported (Hand-Raises)</option>
                      <option value="highest_priority">Highest Priority First</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="comm-filter-strip">
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "all" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("all")}
                  >
                    <Layers size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    All Grievances ({communityGrievances.length})
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "hand_raised" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("hand_raised")}
                  >
                    <ThumbsUp size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Most Supported
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "critical" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("critical")}
                  >
                    <AlertTriangle size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Critical Priority
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "roads" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("roads")}
                  >
                    <Construction size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Roads & Potholes
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "power" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("power")}
                  >
                    <Zap size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Power & Grid
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "lighting" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("lighting")}
                  >
                    <Lightbulb size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Street Lighting
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "water" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("water")}
                  >
                    <Droplets size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Water & Drainage
                  </button>
                  <button
                    type="button"
                    className={`comm-filter-pill ${communityCategoryFilter === "sanitation" ? "active" : ""}`}
                    onClick={() => setCommunityCategoryFilter("sanitation")}
                  >
                    <Trash2 size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                    Sanitation & Waste
                  </button>
                </div>
              </div>

              {/* Community Grievance Cards List */}
              {loadingCommunity ? (
                <div className="comm-loading-box">
                  <span className="spinner-circle"></span>
                  <p>Loading Ward 12 community grievance feed…</p>
                </div>
              ) : communityError ? (
                <div className="comm-error-box">
                  <p>Couldn't load community feed: {communityError}</p>
                  <button className="gov-btn-outline-sm" onClick={loadCommunityFeed}>
                    Retry
                  </button>
                </div>
              ) : (
                (() => {
                  // Filter and sort items
                  let items = [...communityGrievances];

                  // 1. Search filter
                  if (communitySearchQuery.trim()) {
                    const q = communitySearchQuery.toLowerCase();
                    items = items.filter(
                      (g) =>
                        (g.title || "").toLowerCase().includes(q) ||
                        (g.description || "").toLowerCase().includes(q) ||
                        (g.department || "").toLowerCase().includes(q) ||
                        (g.category || "").toLowerCase().includes(q) ||
                        (g.refId || "").toLowerCase().includes(q) ||
                        (g.location?.address || "").toLowerCase().includes(q) ||
                        (g.location?.ward || "").toLowerCase().includes(q)
                    );
                  }

                  // 2. Category filter
                  if (communityCategoryFilter === "hand_raised") {
                    items = items.filter((g) => (g.upvotes || 0) > 0);
                  } else if (communityCategoryFilter === "critical") {
                    items = items.filter((g) => (g.severity || "").toLowerCase() === "critical");
                  } else if (communityCategoryFilter === "roads") {
                    items = items.filter((g) =>
                      (g.category || "").toLowerCase().includes("road") ||
                      (g.title || "").toLowerCase().includes("pothole") ||
                      (g.department || "").toLowerCase().includes("pwd")
                    );
                  } else if (communityCategoryFilter === "power") {
                    items = items.filter((g) =>
                      (g.category || "").toLowerCase().includes("power") ||
                      (g.category || "").toLowerCase().includes("electric") ||
                      (g.department || "").toLowerCase().includes("npcl")
                    );
                  } else if (communityCategoryFilter === "lighting") {
                    items = items.filter((g) =>
                      (g.category || "").toLowerCase().includes("light") ||
                      (g.title || "").toLowerCase().includes("light")
                    );
                  } else if (communityCategoryFilter === "water") {
                    items = items.filter((g) =>
                      (g.category || "").toLowerCase().includes("water") ||
                      (g.category || "").toLowerCase().includes("drain") ||
                      (g.department || "").toLowerCase().includes("jal")
                    );
                  } else if (communityCategoryFilter === "sanitation") {
                    items = items.filter((g) =>
                      (g.category || "").toLowerCase().includes("waste") ||
                      (g.category || "").toLowerCase().includes("sanitat") ||
                      (g.category || "").toLowerCase().includes("garbage") ||
                      (g.department || "").toLowerCase().includes("health")
                    );
                  }

                  // 3. Sorting
                  if (communitySortOption === "most_supported") {
                    items.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
                  } else if (communitySortOption === "highest_priority") {
                    const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
                    items.sort(
                      (a, b) =>
                        (priorityWeight[(b.severity || "").toLowerCase()] || 0) -
                        (priorityWeight[(a.severity || "").toLowerCase()] || 0)
                    );
                  } else if (communitySortOption === "newest") {
                    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                  }

                  if (items.length === 0) {
                    return (
                      <div className="comm-empty-state">
                        <span className="empty-icon"><FileText size={36} color="#94A3B8" /></span>
                        <h3>No community complaints found</h3>
                        <p>No grievances match your current search or category filter criteria.</p>
                        <button
                          type="button"
                          className="gov-btn-outline-sm"
                          onClick={() => {
                            setCommunitySearchQuery("");
                            setCommunityCategoryFilter("all");
                          }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="community-grievance-cards-grid">
                      {items.map((g) => {
                        const isCritical = (g.severity || "").toLowerCase() === "critical";
                        const isHigh = (g.severity || "").toLowerCase() === "high";

                        return (
                          <div
                            key={g.id || g._id}
                            className={`community-card-clean severity-border-${g.severity || "medium"}`}
                          >
                            {/* Card Top Metadata */}
                            <div className="comm-card-top-bar">
                              <div className="comm-card-badges-row">
                                <span className="comm-ref-badge">{g.refId || "UP-GND-2026-LIVE"}</span>
                                <span className={`priority-badge priority-${g.severity || "medium"}`}>
                                  {(g.severity || "medium").toUpperCase()} PRIORITY
                                </span>
                                <span className="comm-dept-badge">{g.department || "Municipal Division"}</span>
                                {g.category && <span className="comm-cat-badge">{g.category}</span>}
                                {g.isUserSubmitted && <span className="comm-user-filed-badge">You Filed This</span>}
                              </div>

                              <span
                                className={`status-pill ${
                                  g.status === "resolved" ? "status-resolved" : "status-progress"
                                }`}
                              >
                                {g.status === "resolved" ? "Resolved & Verified" : "In Progress (Field Action)"}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div className="comm-card-main-body">
                              <div className="comm-card-text-col">
                                <h4
                                  className="comm-card-title"
                                  onClick={() => {
                                    setSelectedIssue(g);
                                    setActiveTab("track");
                                  }}
                                >
                                  {g.title}
                                </h4>
                                <p className="comm-card-desc">{g.description}</p>
                              </div>

                              {/* Photo Attachment if Present */}
                              {(g.imageUrl || g.image) && (
                                <div className="comm-card-thumb-wrap">
                                  <img
                                    src={g.imageUrl || g.image}
                                    alt="Defect proof"
                                    className="comm-card-thumb"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Key Geotag & SLA Details */}
                            <div className="comm-card-meta-strip">
                              <div className="comm-meta-item">
                                <span className="meta-icon"><MapPin size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /></span>
                                <span className="meta-val">{g.location?.address || g.location?.ward || "Ward 12, Greater Noida"}</span>
                              </div>
                              <div className="comm-meta-item">
                                <span className="meta-icon"><Clock size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /></span>
                                <span className="meta-val">
                                  {g.createdAt ? new Date(g.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "Recently Reported"}
                                </span>
                              </div>
                              <div className="comm-meta-item sla-pill-comm">
                                <span className="meta-icon"><Clock size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /></span>
                                <span className="meta-val">{g.slaRemaining || "Standard SLA"}</span>
                              </div>
                              {g.assignedOfficer && (
                                <div className="comm-meta-item officer-pill">
                                  <span className="meta-icon"><Building2 size={13} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} /></span>
                                  <span className="meta-val">{g.assignedOfficer}</span>
                                </div>
                              )}
                            </div>

                            {/* Card Footer: Hand-Raise Booster & Audit Trail */}
                            <div className="comm-card-footer-bar">
                              {/* Hand-Raise Priority Booster */}
                              <button
                                type="button"
                                className={`comm-hand-raise-btn ${g.hasUpvoted ? "active-raised" : ""}`}
                                onClick={() => handleRaiseHand(g.id || g._id, g.title || g.refId)}
                                title="Raise hand to boost priority and escalate to department"
                              >
                                <span className="hand-icon"><ThumbsUp size={15} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
                                <span className="hand-label">
                                  {g.hasUpvoted ? "Hand Raised (Priority Boost Active)" : "Raise Hand (Boost Priority)"}
                                </span>
                                <span className="hand-counter-badge">{g.upvotes || 0}</span>
                              </button>

                              {/* Status / Urgency Pill */}
                              {(g.upvotes || 0) >= 25 ? (
                                <span className="comm-urgency-badge urgent-glow">
                                  <Flame size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                  High Community Urgency (Escalated)
                                </span>
                              ) : (
                                <span className="comm-urgency-badge">
                                  <Users size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                                  {g.upvotes || 0} Residents Endorsed
                                </span>
                              )}

                              {/* View Details Action */}
                              <button
                                type="button"
                                className="comm-view-dossier-btn"
                                onClick={() => {
                                  setSelectedIssue(g);
                                  setActiveTab("track");
                                }}
                              >
                                View Dossier & Audit Trail →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
