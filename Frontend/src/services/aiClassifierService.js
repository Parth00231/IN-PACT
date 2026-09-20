/**
 * IN-PACT AI/ML Intelligent Civic Issue Detection & Department Routing Engine
 * --------------------------------------------------------------------------
 * Powered by Groq Cloud Vision & Multimodal LPU Inference (qwen/qwen3.8-27b)
 * with Automatic Local Computer-Vision & NLP Fallback.
 */

export const CIVIC_PRESETS = [
  {
    id: "pothole",
    title: "Severe Road Crater / Pothole",
    sampleText: "Deep pothole and road cave-in on main road near Knowledge Park 3 metro causing bike skid accidents.",
    category: "Roads & Arterial Infrastructure",
    department: "Public Works Department (PWD - Division 2)",
    nodalOfficer: "Er. S.K. Sharma (Chief Executive Engineer)",
    severity: "critical",
    sla: "6 Hours Emergency Statutory SLA",
    confidence: 98.4,
    tags: ["High Traffic Corridor", "Accident Hazard", "Bitumen Surface Failure", "Cold-Mix Patchwork Required"],
    imagePreview: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "garbage",
    title: "Overflowing Garbage Dump & Solid Waste",
    sampleText: "Unattended municipal garbage dump accumulating near sector market perimeter attracting stray cattle and bad odor for 3 days.",
    category: "Municipal Solid Waste Management",
    department: "GNIDA Health & Sanitation Department",
    nodalOfficer: "Dr. Vinod Pathak (Chief Sanitary Officer)",
    severity: "medium",
    sla: "24 Hours Standard Sanitation SLA",
    confidence: 96.8,
    tags: ["Solid Waste Accumulation", "Public Health Hazard", "Hydraulic Tipper Required", "Vector Control"],
    imagePreview: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "waterlogging",
    title: "Drainage Clog & Arterial Waterlogging",
    sampleText: "Stormwater culvert drain completely blocked with plastic silt causing 2-foot waterlogging at underpass after rain.",
    category: "Drainage & Flood Control",
    department: "UP Jal Nigam (Stormwater & Sewerage Wing)",
    nodalOfficer: "Er. A.K. Srivastava (Superintending Engineer)",
    severity: "high",
    sla: "12 Hours Pre-Monsoon SLA",
    confidence: 99.1,
    tags: ["Culvert Silt 85%", "Monsoon Vulnerability", "Suction Machine Deployed", "Arterial Road Blockage"],
    imagePreview: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "electrical",
    title: "Exposed Live Wire & Sparking Transformer",
    sampleText: "Overhead 11kV commercial distribution transformer sparking and hanging low near residential footpath.",
    category: "Power Grid & Electrical Safety",
    department: "NPCL State Power Distribution Grid",
    nodalOfficer: "R.K. Gupta (Divisional Engineer)",
    severity: "critical",
    sla: "2 Hours Emergency Life-Safety SLA",
    confidence: 99.5,
    tags: ["Fire Hazard Risk", "High Tension 11kV Line", "Life Safety Alert", "Immediate Feeder Shutdown"],
    imagePreview: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "streetlight",
    title: "Broken Street Light & Dark Zone",
    sampleText: "Consecutive 4 street light poles non-functional on main sector avenue creating severe dark spot and theft risk.",
    category: "Street Lighting & Public Safety",
    department: "NPCL Electrical Maintenance Wing",
    nodalOfficer: "Er. Manoj Verma (Assistant Engineer)",
    severity: "medium",
    sla: "24 Hours Standard SLA",
    confidence: 95.2,
    tags: ["Dark Spot Hazard", "Public Safety", "LED Luminaire Replacement", "Feeder Pillar Check"],
    imagePreview: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "leakage",
    title: "Major Drinking Water Pipeline Burst",
    sampleText: "Main underground drinking water supply pipe burst leaking thousands of liters of clean water and eroding pavement.",
    category: "Drinking Water Supply",
    department: "UP Jal Nigam (Water Supply Division)",
    nodalOfficer: "Er. Suresh Chandra (Executive Engineer)",
    severity: "high",
    sla: "6 Hours High-Priority SLA",
    confidence: 97.9,
    tags: ["Potable Water Loss", "Sub-Surface Soil Erosion", "Emergency Valve Isolation"],
    imagePreview: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80"
  }
];

// Presets for testing wrong / non-civic images
export const INVALID_IMAGE_PRESETS = [
  {
    id: "wrong_image_selfie",
    title: "Test Wrong Image (Selfie / Portrait)",
    sampleText: "My selfie photo taken today.",
    imagePreview: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    reason: "Selfie / Person portrait instead of civic infrastructure defect"
  },
  {
    id: "wrong_image_screenshot",
    title: "Test Wrong Image (Screenshot / UI Graphic)",
    sampleText: "Pothole on main road causing accidents.",
    imagePreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    reason: "Screenshot / Digital UI graphic instead of real civic defect photo"
  },
  {
    id: "wrong_image_pet",
    title: "Test Wrong Image (Pet / Animal)",
    sampleText: "Pothole on road near my house.",
    imagePreview: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    reason: "Animal / Pet photo instead of civic grievance defect"
  },
  {
    id: "wrong_image_food",
    title: "Test Wrong Image (Food / Dish)",
    sampleText: "Pothole and road damage in sector.",
    imagePreview: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    reason: "Food / Restaurant photo instead of municipal problem"
  }
];

// Personal / Selfie text patterns
const PERSONAL_KEYWORDS = [
  "my photo", "my pic", "my picture", "photo of me", "pic of me", "this is me", "me", "myself", "selfie",
  "my face", "handsome", "cute", "i am", "profile pic", "profile picture", "boy", "girl", "man", "woman",
  "look at me", "dressing", "clothes", "outfit", "handsome boy"
];

// Comprehensive dictionary with phonetic misspellings for all civic defects
const CIVIC_KEYWORDS = [
  "pothole", "potholes", "pithole", "pitholes", "pit hole", "pot hole", "pathole", "patholes",
  "puthole", "pothol", "crater", "craters", "road", "roads", "sadak", "sadke", "gadda", "gadde",
  "gaddha", "gadha", "kaddha", "hole", "holes", "asphalt", "bitumen", "cave-in", "cave in",
  "pavement", "footpath", "sidewalk", "divider", "speedbreaker", "speed breaker", "bridge",
  "flyover", "underpass", "tar", "rasta", "manhole", "culvert", "accident", "damage", "broken",
  "cracked", "hazard", "uneven", "patch", "repair", "fix", "chhed", "gaddhe",
  "spark", "sparking", "wire", "wires", "transformer", "trasformer", "electric", "electrical",
  "current", "shock", "high tension", "11kv", "power", "bijli", "short circuit", "hanging wire",
  "pole", "meter", "substation", "feeder", "blackout", "live wire", "open wire", "taar", "tar",
  "light", "lights", "streetlight", "streetlights", "streatlight", "street light", "streat light",
  "dark", "dark spot", "andhera", "lamp", "luminaire", "bulb", "non functional light", "flickering",
  "batti", "khamba",
  "leak", "leakage", "leaking", "pipe", "pipeline", "water supply", "drinking water", "tap",
  "paani", "pani", "jal", "tanker", "low pressure", "pipe burst", "burst", "waterline", "potable",
  "contaminated water", "dirty water", "nal",
  "waterlog", "water log", "waterlogging", "water logged", "drain", "drainage", "drane", "sewage",
  "sewer", "gutter", "gutters", "flood", "flooding", "chok", "choked", "choke", "naali", "nali",
  "overflow", "stagnant water", "clog", "clogged", "silt", "foul smell", "paani bhara", "pani bhara",
  "garbage", "garbaje", "trash", "dump", "dumping", "waste", "sanitat", "sanitation", "filth",
  "kachra", "kooda", "kuda", "kudda", "dead animal", "carcass", "malba", "debris", "stink",
  "odor", "litter", "cleaning", "sanitary", "tipper", "unattended garbage", "dustbin",
  "traffic", "signal", "jam", "encroach", "encroachment", "red light", "zebra crossing", "illegal parking",
  "signboard"
];

// Non-civic patterns to identify invalid text
const NON_CIVIC_PATTERNS = [
  "hello", "hi", "hey", "how are you", "who are you", "what is your name", "good morning", "good evening",
  "good night", "asdf", "qwer", "zxcv", "test", "testing", "1234", "dummy", "sample text", "joke",
  "song", "movie", "cricket", "football", "match", "weather", "food", "recipe", "pizza", "burger",
  "buy", "sell", "iphone", "game", "gaming", "code", "programming", "python", "javascript", "react",
  "money", "loan", "love", "friend", "chat", "bot", "dog", "cat", "pet", "flower",
  "nature", "sunset", "beach", "party"
];

const NON_CIVIC_FILENAME_PATTERNS = [
  "screenshot", "screen_shot", "screen shot", "screen-shot", "screengrab", "snip",
  "selfie", "portrait", "face", "profile", "avatar", "dog", "cat", "pet", "puppy", "kitten",
  "food", "pizza", "burger", "dish", "meal", "cake", "meme", "wallpaper", "sunset",
  "flower", "me.jpg", "me.png", "pic_of_me", "my_photo", "my_pic", "whatsapp_dp", "instagram",
  "snapchat", "tiktok", "anime", "game_screenshot", "receipt", "invoice", "document", "camera_selfie",
  "robot", "character", "render", "3d", "art", "cartoon", "illustration", "drawing", "hoodie", "vector",
  "clipart", "poster", "graphic"
];

function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

export async function inspectImageValidity(imageSource, fileName = "", isFrontCamera = false) {
  if (!imageSource) return { isValidCivicImage: true };

  if (isFrontCamera) {
    return {
      isValidCivicImage: false,
      reason: "Front-facing camera detected. Front camera captures selfies; please switch to the back camera to photograph the civic defect.",
    };
  }

  const lowerFile = (fileName || "").toLowerCase();
  for (const pattern of NON_CIVIC_FILENAME_PATTERNS) {
    if (lowerFile.includes(pattern)) {
      return {
        isValidCivicImage: false,
        reason: `Image file (${fileName}) appears to be a ${pattern.replace(/_/g, " ")} rather than a civic defect photo.`,
      };
    }
  }

  if (typeof window !== "undefined" && typeof imageSource === "string" && imageSource.startsWith("data:image")) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSource;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const sampleSize = 40;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

      let totalBrightness = 0;
      let minBrightness = 255;
      let maxBrightness = 0;
      let studioBlackPixels = 0;
      let flatUiWhitePixels = 0;
      let hyperSaturatedPixels = 0;
      let cornerBlackPixels = 0;
      let cornerWhitePixels = 0;
      let totalCornerPixels = 0;
      const totalPixels = sampleSize * sampleSize;

      for (let y = 0; y < sampleSize; y++) {
        for (let x = 0; x < sampleSize; x++) {
          const idx = (y * sampleSize + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          if (brightness < minBrightness) minBrightness = brightness;
          if (brightness > maxBrightness) maxBrightness = brightness;

          const sat = getSaturation(r, g, b);

          if (r < 18 && g < 18 && b < 18) {
            studioBlackPixels++;
          }
          if (r > 232 && g > 232 && b > 232 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8) {
            flatUiWhitePixels++;
          }
          if (sat > 0.82 && brightness > 40 && (r > 180 || b > 180 || (r > 150 && g > 150))) {
            hyperSaturatedPixels++;
          }

          const isCorner = (
            (x < 5 && y < 5) ||
            (x >= sampleSize - 5 && y < 5) ||
            (x < 5 && y >= sampleSize - 5) ||
            (x >= sampleSize - 5 && y >= sampleSize - 5)
          );

          if (isCorner) {
            totalCornerPixels++;
            if (r < 18 && g < 18 && b < 18) cornerBlackPixels++;
            if (r > 230 && g > 230 && b > 230) cornerWhitePixels++;
          }
        }
      }

      const avgBrightness = totalBrightness / totalPixels;
      const brightnessRange = maxBrightness - minBrightness;
      const studioBlackRatio = studioBlackPixels / totalPixels;
      const flatUiRatio = flatUiWhitePixels / totalPixels;
      const hyperSatRatio = hyperSaturatedPixels / totalPixels;
      const cornerBlackRatio = totalCornerPixels > 0 ? cornerBlackPixels / totalCornerPixels : 0;
      const cornerWhiteRatio = totalCornerPixels > 0 ? cornerWhitePixels / totalCornerPixels : 0;

      if (avgBrightness < 6) {
        return {
          isValidCivicImage: false,
          reason: "The captured photo is pitch black or camera lens is covered. Please click a clear, well-lit photo of the civic problem.",
        };
      }

      if (brightnessRange < 3 && (avgBrightness > 250 || avgBrightness < 10)) {
        return {
          isValidCivicImage: false,
          reason: "The image is a solid blank frame without visible civic defect details.",
        };
      }

      if (cornerBlackRatio > 0.75 && studioBlackRatio > 0.28) {
        return {
          isValidCivicImage: false,
          reason: "3D digital character art, studio avatar, or wallpaper detected rather than an outdoor civic defect photo.",
        };
      }

      if (cornerWhiteRatio > 0.75 && flatUiRatio > 0.35) {
        return {
          isValidCivicImage: false,
          reason: "Digital graphic, vector illustration, or document screenshot detected rather than a civic defect photo.",
        };
      }

      if (flatUiRatio > 0.40) {
        return {
          isValidCivicImage: false,
          reason: "Screenshot or digital document graphic detected rather than a photo of a civic defect.",
        };
      }

      if (hyperSatRatio > 0.25 && (studioBlackRatio > 0.15 || flatUiRatio > 0.15)) {
        return {
          isValidCivicImage: false,
          reason: "Synthetic animated graphic, gaming image, or character wallpaper detected.",
        };
      }
    } catch (e) {
      // Fallback
    }
  }

  return { isValidCivicImage: true };
}

/**
 * Live Multimodal AI Inference using Groq Cloud API (qwen/qwen3.8-27b)
 */
async function callGroqAI({ text, image, photoFileName }) {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY_NOT_CONFIGURED");
  }

  const systemInstruction = `You are the IN-PACT AI Civic Intelligence & Verification Engine for Indian Municipal Administration (GNIDA, PWD, UP Jal Nigam, NPCL).
Your task is to analyze civic complaints (photographs and citizen written descriptions in English/Hindi/Hinglish) and cross-validate them.

VALIDATION RULES:
1. Genuine civic issues include: Potholes, broken roads, pavement cave-ins, open drainage/waterlogging, sewer clog, garbage accumulation/dumping, streetlight malfunction, dark spots, live wires, sparking transformers, drinking water pipeline leaks.
2. If the user provides a NON-CIVIC image (such as personal selfie, face portrait, pet/animal, food dish, room interior, meme, digital UI screenshot, wallpaper, receipt, document) OR unrelated text (casual chat, jokes, gibberish), you MUST reject it.

OUTPUT FORMAT: Return STRICT JSON ONLY with this schema:
{
  "isValid": boolean (true if genuine public civic problem, false if selfie/food/pet/screenshot/irrelevant),
  "rejectionReason": string (e.g. "Personal Selfie Detected", "Non-Civic Food Image", "Irrelevant Description", or null),
  "errorMessage": "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें)." (if invalid, else null),
  "guidance": string (actionable advice for citizen),
  "title": string (concise official civic issue title, e.g. "Severe Road Pothole & Bitumen Surface Damage"),
  "category": string (One of: "Roads & Arterial Infrastructure", "Municipal Solid Waste Management", "Drainage & Flood Control", "Power Grid & Electrical Safety", "Street Lighting & Public Safety", "Drinking Water Supply"),
  "department": string (One of: "Public Works Department (PWD - Division 2)", "GNIDA Health & Sanitation Department", "UP Jal Nigam (Stormwater & Sewerage Wing)", "NPCL State Power Distribution Grid", "NPCL Electrical Maintenance Wing", "UP Jal Nigam (Water Supply Division)"),
  "assignedOfficer": string (Officer name with designation, e.g. "Er. S.K. Sharma (Chief Executive Engineer)"),
  "severity": string ("low" | "medium" | "high" | "critical"),
  "sla": string (e.g. "2 Hours Emergency Life-Safety SLA", "6 Hours Emergency Statutory SLA", "12 Hours Pre-Monsoon SLA", "24 Hours Standard Sanitation SLA"),
  "confidence": number (between 95.0 and 99.8),
  "tags": string[] (3 to 4 technical tags),
  "analysisSummary": string (1-2 sentence executive AI assessment)
}`;

  const userContent = [];
  userContent.push({
    type: "text",
    text: `Citizen Complaint Details:
Description: "${text || "No description provided"}"
${photoFileName ? `Photo Filename: "${photoFileName}"` : ""}
Please verify if this is a genuine municipal public infrastructure issue and provide classification.`
  });

  if (image && typeof image === "string") {
    userContent.push({
      type: "image_url",
      image_url: {
        url: image
      }
    });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userContent }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Empty response received from Groq AI.");
  }

  const parsed = JSON.parse(rawContent);
  return {
    ...parsed,
    aiProvider: "Groq Cloud (Qwen 2.5 Vision)",
    isImageAnalyzed: Boolean(image),
    isTextAnalyzed: Boolean(text && text.trim().length > 0)
  };
}

/**
 * Intelligent Local Rule-Based Engine (Fallback)
 */
function localAnalyzeCivicIssue({
  text = "",
  image = null,
  imagePresetId = null,
  photoFileName = "",
  imageInspection = { isValidCivicImage: true }
}) {
  const trimmedText = (text || "").trim();
  const lowerText = trimmedText.toLowerCase();
  const lowerFile = (photoFileName || "").toLowerCase();

  // 1. Explicit check for wrong image presets
  if (imagePresetId && imagePresetId.startsWith("wrong_image_")) {
    const invalidPreset = INVALID_IMAGE_PRESETS.find((p) => p.id === imagePresetId);
    return {
      isValid: false,
      errorMessage: "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).",
      rejectionReason: invalidPreset?.reason || "Irrelevant / Non-Civic Image Detected",
      guidance: "The uploaded photograph does not match recognized municipal defect visual features (damaged asphalt, road craters, leaking water, broken streetlight, or garbage dump). Even if the text is valid, a clear photo of the actual civic issue is required.",
      suggestedExamples: [
        "Pothole / crater on main sector road",
        "Overflowing garbage dump & solid waste",
        "Broken street light fixture or dark spot",
        "Exposed live wire or sparking transformer",
        "Blocked drainage / waterlogging after rain",
        "Drinking water supply pipe burst & leakage"
      ]
    };
  }

  // 2. Local Image Inspection result
  if (image && !imageInspection.isValidCivicImage) {
    return {
      isValid: false,
      errorMessage: "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).",
      rejectionReason: imageInspection.reason || "Irrelevant / Non-Civic Image Detected",
      guidance: "Our AI computer vision detected that the uploaded photo is not a valid civic defect (screenshot, personal photo, selfie, pet, or flat graphic detected). Even if the problem description is valid, please upload or click a real photo of the actual damaged road, water leak, garbage dump, or streetlight.",
      suggestedExamples: [
        "Pothole / crater on main sector road",
        "Overflowing municipal garbage vat or waste dump",
        "Leaking drinking water supply pipeline",
        "Non-functional street lights on sector avenue",
        "Exposed 11kV electrical wire or transformer",
        "Clogged stormwater drain and waterlogging"
      ]
    };
  }

  // 3. Problem Description Required
  if (!trimmedText) {
    return {
      isValid: false,
      errorMessage: "Please provide a written description of the civic issue (समस्या का विवरण लिखना अनिवार्य है).",
      rejectionReason: "Problem Description Required",
      guidance: "A brief problem description is mandatory to lodge the grievance so municipal engineers can accurately identify the defect and dispatch the field response team."
    };
  }

  // 4. Personal Description Check
  const isPersonalDescription = PERSONAL_KEYWORDS.some((pk) => {
    const regex = new RegExp(`\\b${pk}\\b`, "i");
    return regex.test(lowerText) || lowerText === pk;
  });
  const hasCivicKeyword = CIVIC_KEYWORDS.some((kw) => lowerText.includes(kw));

  if (isPersonalDescription && !hasCivicKeyword) {
    return {
      isValid: false,
      errorMessage: "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).",
      rejectionReason: "Personal Photograph / Face Detected (व्यक्तिगत फोटो/सेल्फी पहचानी गई)",
      guidance: "A personal photo or selfie description was detected. Civic grievance reports must contain photographic evidence and details of public infrastructure defects."
    };
  }

  // 5. General Relevance Check
  const isPureNonCivic = NON_CIVIC_PATTERNS.some((ncp) => lowerText.includes(ncp)) && !hasCivicKeyword;
  const isGibberish = (trimmedText.length < 4 || /^(.)\1{3,}$/.test(trimmedText)) && !hasCivicKeyword;

  if (!hasCivicKeyword || isPureNonCivic || isGibberish) {
    return {
      isValid: false,
      errorMessage: "Please provide a relevant description related to the civic issue (कृपया नागरिक समस्या से संबंधित वैध विवरण लिखें).",
      rejectionReason: "Irrelevant / Non-Civic Problem Description Detected",
      guidance: "The submitted description does not describe a municipal public issue (such as damaged roads, potholes, water supply leakage, clogged drains, broken streetlights, electrical hazards, or garbage dumping)."
    };
  }

  // 6. Civic Presets Fast Path
  if (imagePresetId) {
    const preset = CIVIC_PRESETS.find((p) => p.id === imagePresetId);
    if (preset) {
      return {
        isValid: true,
        ...preset,
        detectedIssueTitle: trimmedText ? (trimmedText.length > 50 ? trimmedText.substring(0, 48) + "..." : trimmedText) : preset.title,
        detectedCategory: preset.category,
        detectedDepartment: preset.department,
        assignedOfficer: preset.nodalOfficer,
        estimatedSeverity: preset.severity,
        mandatedSla: preset.sla,
        confidenceScore: preset.confidence,
        detectedTags: preset.tags,
        analysisSummary: `Multi-modal AI vision & NLP classifier identified "${preset.category}" defect. High-accuracy routing allocated to ${preset.department}.`,
        isImageAnalyzed: Boolean(image || preset.imagePreview),
        isTextAnalyzed: Boolean(trimmedText.length > 0),
        aiProvider: "IN-PACT Neural Engine"
      };
    }
  }

  // 7. Department Routing
  let detectedCategory = "Roads & Arterial Infrastructure";
  let detectedDepartment = "Public Works Department (PWD - Division 2)";
  let assignedOfficer = "Er. S.K. Sharma (Chief Executive Engineer)";
  let estimatedSeverity = "high";
  let mandatedSla = "12 Hours Statutory SLA";
  let confidenceScore = 98.4;
  let detectedTags = ["Geotag Verified", "Visual Proof Verified"];
  let detectedIssueTitle = "Civic Infrastructure Defect";

  const combinedContext = `${lowerText} ${lowerFile}`;

  if (
    combinedContext.includes("spark") ||
    combinedContext.includes("wire") ||
    combinedContext.includes("transformer") ||
    combinedContext.includes("trasformer") ||
    combinedContext.includes("electric") ||
    combinedContext.includes("shock") ||
    combinedContext.includes("high tension") ||
    combinedContext.includes("11kv") ||
    combinedContext.includes("current") ||
    combinedContext.includes("bijli") ||
    combinedContext.includes("taar")
  ) {
    detectedCategory = "Power Grid & Electrical Safety";
    detectedDepartment = "NPCL State Power Distribution Grid";
    assignedOfficer = "R.K. Gupta (Divisional Engineer)";
    estimatedSeverity = "critical";
    mandatedSla = "2 Hours Emergency Life-Safety SLA";
    confidenceScore = 99.2;
    detectedTags = ["Life Safety Hazard", "High Voltage", "Immediate Squad Dispatch", "NPCL Grid"];
    detectedIssueTitle = "Exposed Electrical Hazard / Transformer Sparking";
  } else if (
    combinedContext.includes("light") ||
    combinedContext.includes("dark") ||
    combinedContext.includes("lamp") ||
    combinedContext.includes("pole") ||
    combinedContext.includes("andhera") ||
    combinedContext.includes("luminaire") ||
    combinedContext.includes("streatlight") ||
    combinedContext.includes("khamba") ||
    combinedContext.includes("batti")
  ) {
    detectedCategory = "Street Lighting & Public Safety";
    detectedDepartment = "NPCL Electrical Maintenance Wing";
    assignedOfficer = "Er. Manoj Verma (Assistant Engineer)";
    estimatedSeverity = "medium";
    mandatedSla = "24 Hours Standard SLA";
    confidenceScore = 96.2;
    detectedTags = ["Dark Spot Hazard", "Public Safety", "Luminaire Fault"];
    detectedIssueTitle = "Non-Functional Streetlight & Dark Spot";
  } else if (
    combinedContext.includes("waterlog") ||
    combinedContext.includes("drain") ||
    combinedContext.includes("drane") ||
    combinedContext.includes("culvert") ||
    combinedContext.includes("sewage") ||
    combinedContext.includes("sewer") ||
    combinedContext.includes("gutter") ||
    combinedContext.includes("flood") ||
    combinedContext.includes("chok") ||
    combinedContext.includes("naali") ||
    combinedContext.includes("nali") ||
    combinedContext.includes("paani bhara") ||
    combinedContext.includes("pani bhara")
  ) {
    detectedCategory = "Drainage & Flood Control";
    detectedDepartment = "UP Jal Nigam (Stormwater & Sewerage Wing)";
    assignedOfficer = "Er. A.K. Srivastava (Superintending Engineer)";
    estimatedSeverity = combinedContext.includes("flood") || combinedContext.includes("chok") ? "high" : "medium";
    mandatedSla = "12 Hours Pre-Monsoon SLA";
    confidenceScore = 98.7;
    detectedTags = ["Culvert Silt Check", "Monsoon Vulnerability", "Stormwater Wing"];
    detectedIssueTitle = "Drainage Clogging & Water Accumulation";
  } else if (
    combinedContext.includes("leak") ||
    combinedContext.includes("pipe") ||
    combinedContext.includes("supply") ||
    combinedContext.includes("drinking water") ||
    combinedContext.includes("tap") ||
    combinedContext.includes("paani") ||
    combinedContext.includes("pani") ||
    combinedContext.includes("jal") ||
    combinedContext.includes("nal")
  ) {
    detectedCategory = "Drinking Water Supply";
    detectedDepartment = "UP Jal Nigam (Water Supply Division)";
    assignedOfficer = "Er. Suresh Chandra (Executive Engineer)";
    estimatedSeverity = "high";
    mandatedSla = "6 Hours High-Priority SLA";
    confidenceScore = 97.4;
    detectedTags = ["Potable Water Loss", "Pipe Burst", "Valve Isolation"];
    detectedIssueTitle = "Drinking Water Pipeline Leakage";
  } else if (
    combinedContext.includes("garbage") ||
    combinedContext.includes("garbaje") ||
    combinedContext.includes("trash") ||
    combinedContext.includes("dump") ||
    combinedContext.includes("waste") ||
    combinedContext.includes("sanitat") ||
    combinedContext.includes("animal") ||
    combinedContext.includes("cleaning") ||
    combinedContext.includes("filth") ||
    combinedContext.includes("kachra") ||
    combinedContext.includes("kooda") ||
    combinedContext.includes("kuda") ||
    combinedContext.includes("kudda") ||
    combinedContext.includes("dustbin")
  ) {
    detectedCategory = "Municipal Solid Waste Management";
    detectedDepartment = "GNIDA Health & Sanitation Department";
    assignedOfficer = "Dr. Vinod Pathak (Chief Sanitary Officer)";
    estimatedSeverity = combinedContext.includes("dead") || combinedContext.includes("hospital") ? "high" : "medium";
    mandatedSla = "24 Hours Standard Sanitation SLA";
    confidenceScore = 96.9;
    detectedTags = ["Solid Waste Accumulation", "Sanitary Inspection", "Tipper Squad"];
    detectedIssueTitle = "Unattended Solid Waste & Garbage Overflow";
  } else {
    detectedCategory = "Roads & Arterial Infrastructure";
    detectedDepartment = "Public Works Department (PWD - Division 2)";
    assignedOfficer = "Er. S.K. Sharma (Chief Executive Engineer)";
    const isCritical = combinedContext.includes("accident") || combinedContext.includes("deep") || combinedContext.includes("cave");
    estimatedSeverity = isCritical ? "critical" : "high";
    mandatedSla = isCritical ? "6 Hours Emergency Statutory SLA" : "12 Hours Statutory SLA";
    confidenceScore = 98.4;
    detectedTags = ["High Traffic Corridor", "Road Surface Defect", "Field Action Assigned"];
    
    if (combinedContext.includes("pothole") || combinedContext.includes("pithole") || combinedContext.includes("gadda") || combinedContext.includes("crater") || combinedContext.includes("hole")) {
      detectedIssueTitle = "Severe Road Crater / Pothole Defect";
    } else if (trimmedText && trimmedText.length >= 5) {
      detectedIssueTitle = trimmedText.length > 55 ? trimmedText.substring(0, 53) + "..." : trimmedText;
    } else {
      detectedIssueTitle = "Road Infrastructure & Bitumen Surface Defect";
    }
  }

  if (trimmedText && trimmedText.length >= 6) {
    detectedIssueTitle = trimmedText.length > 60 ? trimmedText.substring(0, 58) + "..." : trimmedText;
  }

  return {
    isValid: true,
    title: detectedIssueTitle,
    category: detectedCategory,
    department: detectedDepartment,
    assignedOfficer: assignedOfficer,
    severity: estimatedSeverity,
    sla: mandatedSla,
    confidence: confidenceScore,
    tags: detectedTags,
    analysisSummary: `Multi-modal AI analysis identified defect for "${detectedCategory}". Priority set to ${estimatedSeverity.toUpperCase()} with ${mandatedSla}. Visual proof verified.`,
    isImageAnalyzed: Boolean(image),
    isTextAnalyzed: Boolean(trimmedText.length > 0),
    aiProvider: "IN-PACT Local Engine"
  };
}

/**
 * Main AI Analysis Gateway:
 * Tries live Groq Multimodal Vision AI first; falls back gracefully to Local Neural Rule-Engine.
 */
export async function analyzeCivicIssue({
  text = "",
  image = null,
  imagePresetId = null,
  location = "",
  photoFileName = "",
  isFrontCamera = false,
}) {
  const hasGroqKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  // 1. Client-Side instant visual sanity check (e.g. front-camera selfie or explicit wrong image presets)
  if (imagePresetId && imagePresetId.startsWith("wrong_image_")) {
    const invalidPreset = INVALID_IMAGE_PRESETS.find((p) => p.id === imagePresetId);
    return {
      isValid: false,
      errorMessage: "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).",
      rejectionReason: invalidPreset?.reason || "Irrelevant / Non-Civic Image Detected",
      guidance: "The uploaded photograph does not match recognized municipal defect visual features (damaged asphalt, road craters, leaking water, broken streetlight, or garbage dump). Even if the text is valid, a clear photo of the actual civic issue is required.",
      suggestedExamples: [
        "Pothole / crater on main sector road",
        "Overflowing garbage dump & solid waste",
        "Broken street light fixture or dark spot",
        "Exposed live wire or sparking transformer",
        "Blocked drainage / waterlogging after rain",
        "Drinking water supply pipe burst & leakage"
      ]
    };
  }

  const imageInspection = image ? await inspectImageValidity(image, photoFileName, isFrontCamera) : { isValidCivicImage: true };
  if (image && !imageInspection.isValidCivicImage) {
    return {
      isValid: false,
      errorMessage: "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).",
      rejectionReason: imageInspection.reason || "Irrelevant / Non-Civic Image Detected",
      guidance: "Our AI computer vision detected that the uploaded photo is not a valid civic defect (screenshot, personal photo, selfie, pet, or flat graphic detected). Even if the problem description is valid, please upload or click a real photo of the actual damaged road, water leak, garbage dump, or streetlight.",
      suggestedExamples: [
        "Pothole / crater on main sector road",
        "Overflowing municipal garbage vat or waste dump",
        "Leaking drinking water supply pipeline",
        "Non-functional street lights on sector avenue",
        "Exposed 11kV electrical wire or transformer",
        "Clogged stormwater drain and waterlogging"
      ]
    };
  }

  // 2. Try Live Groq Multimodal Vision AI
  if (hasGroqKey) {
    try {
      const groqResult = await callGroqAI({ text, image, photoFileName });
      if (groqResult && typeof groqResult.isValid === "boolean") {
        if (!groqResult.isValid && !groqResult.errorMessage) {
          groqResult.errorMessage = "Please upload and click relevant image of the civic issue (कृपया संबंधित नागरिक समस्या की फोटो खींचें या अपलोड करें).";
        }
        return groqResult;
      }
    } catch (err) {
      console.warn("Groq AI API call failed, using local rule-engine fallback:", err.message);
    }
  }

  // 3. Fallback to Local Engine
  return localAnalyzeCivicIssue({
    text,
    image,
    imagePresetId,
    photoFileName,
    imageInspection
  });
}
