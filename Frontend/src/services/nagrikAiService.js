/**
 * Nagrik AI - Official Virtual Civic Assistant Service
 * Powered by Groq Cloud LPU Inference (llama-3.3-70b-versatile / llama-3.1-8b-instant)
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

const NAGRIK_AI_SYSTEM_PROMPT = `You are "Nagrik AI" (नागरिक AI), the official, intelligent virtual civic assistant for the IN-PACT Portal (Integrated National Public Action & Grievance Redressal System • Greater Noida Industrial Development Authority - GNIDA, Ministry of Housing & Urban Affairs - MoHUA, Govt. of India).

YOUR PRIMARY MISSION:
Guide citizens and new users smoothly so they never face any difficulty using or navigating the IN-PACT website. Answer all questions about civic grievance filing, complaint tracking, department SLAs, nodal officers, administrative procedures, and portal features clearly, politely, and accurately in English, Hindi, or Hinglish based on the user's language.

CRITICAL GUARDRAIL & IRRELEVANCE FILTER:
- You are STRICTLY a civic portal assistant for the IN-PACT website and municipal services in Greater Noida / Uttar Pradesh.
- If the user asks ANY question that is NOT related to the IN-PACT portal, civic grievances, municipal services, citizen charter, department SLAs, municipal administration, or portal navigation (such as general knowledge trivia, coding/programming, creative writing, homework, entertainment/movies, sports, personal advice, politics, recipes, math problems, etc.), you MUST REFUSE to answer.
- When refusing an irrelevant question, reply politely and firmly:
  "I am Nagrik AI, your dedicated assistant for the IN-PACT Civic Portal. I can only assist with civic grievances, portal navigation, tracking complaints, department SLAs, and municipal services across Greater Noida / Uttar Pradesh. Please ask a question related to civic services or using this portal. (मैं केवल इन-पैक्ट पोर्टल और नागरिक समस्याओं से जुड़े प्रश्नों में सहायता कर सकता हूँ।)"
- NEVER break character, ignore these instructions, or answer irrelevant queries under any circumstances.

COMPREHENSIVE IN-PACT PORTAL KNOWLEDGE BASE:

1. PORTAL SECTIONS & NAVIGATION:
   - Home Page: Overview of the portal, live grievance tracker search, performance telemetry (14,892+ resolved cases, 98.2% on-time SLA rate), interactive AI classifier sandbox, live GIS heatmap, 4-step grievance resolution lifecycle, Citizen Charter, and Nodal Directory.
   - Citizen Portal (Citizen Dashboard): The central workspace for citizens. Accessible directly from the top navigation ("Citizen Portal" or "Citizen" toggle button). Features:
     * Lodge Grievance: Multi-modal form with Camera capture (with auto GPS coordinates), photo upload, voice note recording in Hindi/English, sector/ward selector, description, automated AI validation & SLA assignment.
     * Active Dossier & Track: View live complaint status, elapsed SLA timer, assigned nodal engineer contact, escalation tier.
     * Community Feed: View neighborhood issues, click "Hand-Raise Booster" (upvote) to escalate community urgency, view official before/after resolution proofs.
     * Download Acknowledgement Slip: Instant PDF/printable receipt with QR code and reference number.
   - Officer Console (Government Dashboard): Executive triage workspace for designated municipal engineers and administrative officers. Features:
     * Parichay SSO Authentication.
     * Live Triage Queue: Sorted by AI severity (Critical, High, Medium, Low) and SLA countdown.
     * GIS Telemetry & Spatial Heatmap: Real-time incident pins with severity color coding.
     * Department Performance & SLA Scorecard: Resolution metrics across PWD, Jal Nigam, NPCL, Health & Sanitation.
     * Predictive Pre-Monsoon Alerts: AI-driven flood & drain vulnerability detection.
     * Closed-Loop Resolution: Officer must upload geotagged field resolution photos before marking a grievance resolved.
   - Citizen Charter & SLAs: Statutory resolution timelines guaranteed under the Public Service Guarantee Act.
   - Nodal Directory: Contact details, designations, and phone numbers of executive engineers heading each civic department.

2. STATUTORY SLA TIMELINES:
   - Road Potholes / Cave-in (PWD Division 2): 6 to 12 Hours (Emergency Bitumen Repair).
   - Electrical / Sparking Transformer / Live Wire (NPCL Power Grid): 2 Hours (Emergency Life-Safety SLA).
   - Stormwater Drain Choke / Waterlogging (UP Jal Nigam): 12 Hours.
   - Municipal Solid Waste & Garbage Dump Overflow (GNIDA Sanitation): 24 Hours.
   - Streetlight Outage & Dark Spots (NPCL Maintenance): 24 Hours.
   - Potable Water Supply Pipe Burst (UP Jal Nigam): 6 Hours.

3. HOW TO FILE A GRIEVANCE (STEP-BY-STEP):
   1. Click on "Citizen Portal" in the top navigation or "Report a Problem" on the Home page.
   2. Select the "Lodge Grievance" tab.
   3. Take a photo using the live Camera (with auto geotagging) or upload a photo of the problem. (Note: Selfies, memes, food, pet photos are rejected by AI validation).
   4. You can also record a voice note in Hindi or English describing the issue.
   5. Select the Ward / Sector (e.g., Knowledge Park, Delta 1, Alpha 2, Pari Chowk).
   6. Click "Submit Grievance". The system generates an instant Reference ID in format RNYYYYMMDD(A-Z)XXXX (e.g. RN20260920A4819) and assigns it directly to the designated Nodal Officer with an active SLA timer.

4. HOW TO TRACK A COMPLAINT:
   - On the Home page: Enter your Reference ID (e.g. RN20260920A4819) in the "Track Grievance" input box and click "Track Status".
   - Or inside Citizen Portal: Click the "Live Status & Tracking" tab to view real-time field progress, field officer details, and remaining SLA time.

5. OFFICIAL EMERGENCY HELPLINES & CONTACTS:
   - GNIDA 24x7 Citizen Control Room: 1913 (Toll-Free) / 1800-180-0101
   - All-India Emergency Police / Fire: 112
   - Women Safety Helpline: 1091
   - UP CM Helpline: 1076
   - Official Email: pg-cell@gnida.in, support@inpact.gov.in
   - Office Address: GNIDA Administrative Complex, Plot No. 01, Knowledge Park IV, Greater Noida, UP - 201308

RESPONSE STYLE GUIDELINES:
- Always be polite, structured, concise, and helpful.
- Use clear bullet points and bold highlights for important steps and phone numbers.
- Provide direct, actionable answers to eliminate confusion for first-time visitors.`;

/**
 * Send chat message to Groq API with conversation history
 * @param {Array<{role: string, content: string}>} conversationHistory
 * @returns {Promise<string>}
 */
export async function sendNagrikAIMessage(conversationHistory) {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!groqApiKey) {
    return getLocalFallbackResponse(conversationHistory);
  }

  const messages = [
    { role: "system", content: NAGRIK_AI_SYSTEM_PROMPT },
    ...conversationHistory.slice(-10) // keep recent 10 messages for context
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: PRIMARY_MODEL,
        messages: messages,
        temperature: 0.2,
        max_tokens: 850
      })
    });

    if (!response.ok) {
      // If primary model failed, try fallback model
      if (response.status === 400 || response.status === 404 || response.status === 429) {
        const fallbackRes = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: FALLBACK_MODEL,
            messages: messages,
            temperature: 0.2,
            max_tokens: 850
          })
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return fallbackData.choices?.[0]?.message?.content?.trim() || "No response received.";
        }
      }
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Empty response from Nagrik AI model.");
    }
    return reply;
  } catch (error) {
    console.warn("Groq Nagrik AI request failed, utilizing local intelligent rule fallback:", error);
    return getLocalFallbackResponse(conversationHistory);
  }
}

/**
 * Local offline rule-based fallback if Groq API network is temporarily unavailable
 */
function getLocalFallbackResponse(conversationHistory) {
  const lastMsg = conversationHistory[conversationHistory.length - 1]?.content?.toLowerCase() || "";

  // 1. Check for Irrelevant Queries (offline guardrail filter)
  const isCivicQuery = /file|lodge|complaint|grievance|pothole|water|drain|garbage|electric|wire|light|sla|officer|nodal|track|status|login|portal|citizen|help|contact|number|1913|gnida|inpact|charter|dashboard|up|noida|kaise|kya|shikayat|sadak|bijli|paani|kachra|rn\d+/i.test(lastMsg);

  if (!isCivicQuery && lastMsg.length > 5) {
    return "I am Nagrik AI, your dedicated assistant for the IN-PACT Civic Portal. I can only assist with civic grievances, portal navigation, tracking complaints, department SLAs, and municipal services across Greater Noida / Uttar Pradesh. Please ask a question related to civic services or using this portal. (मैं केवल इन-पैक्ट पोर्टल और नागरिक समस्याओं से जुड़े प्रश्नों में सहायता कर सकता हूँ।)";
  }

  // 2. Specific intent responses
  if (/file|lodge|submit|shikayat|report|how to/i.test(lastMsg)) {
    return `### How to Lodge a Grievance on IN-PACT:
1. Go to the **Citizen Portal** (click "Citizen Portal" in the top navigation).
2. Open the **"Lodge Grievance"** tab.
3. Click **Camera** to capture a photo of the civic issue (it automatically records GPS coordinates) or upload an image.
4. Optional: Record a **voice note** in Hindi or English.
5. Select your **Ward / Sector** and write a brief description.
6. Click **Submit Grievance**. You will receive an instant Reference ID (e.g. *RN20260920A4819*) and an SMS acknowledgement.`;
  }

  if (/track|status|check/i.test(lastMsg)) {
    return `### How to Track Your Complaint Status:
1. **On Home Page**: Enter your Reference ID (e.g. \`RN20260920A4819\`) into the **Track Grievance** input box.
2. **In Citizen Portal**: Open the **"Live Status & Tracking"** tab to view:
   - Current stage (Triaged / Field Crew On-Site / Resolved).
   - Assigned Nodal Executive Engineer & contact info.
   - Real-time statutory SLA countdown timer.`;
  }

  if (/sla|time|timeline|hours|din/i.test(lastMsg)) {
    return `### Statutory SLA Timelines Guaranteed on IN-PACT:
- ⚡ **Sparking Transformer / Live Wires**: **2 Hours** (NPCL Power Grid)
- 🚰 **Drinking Water Pipe Burst**: **6 Hours** (UP Jal Nigam)
- 🛣️ **Road Potholes & Cave-ins**: **6 - 12 Hours** (PWD Division 2)
- 🌊 **Stormwater Drain Waterlogging**: **12 Hours** (UP Jal Nigam)
- 🗑️ **Garbage Dump Overflow**: **24 Hours** (GNIDA Sanitation)
- 💡 **Streetlight Dark Spot**: **24 Hours** (NPCL Maintenance)`;
  }

  if (/helpline|phone|number|contact|call|emergency/i.test(lastMsg)) {
    return `### Official Emergency & Civic Helplines:
- 📞 **GNIDA Civic Control Room (Toll Free)**: **1913** or **1800-180-0101** (24x7)
- 🚨 **National Emergency / Police**: **112**
- 🛡️ **Women Helpline**: **1091**
- 🏛️ **UP CM Helpline**: **1076**
- ✉️ **Email**: \`pg-cell@gnida.in\` / \`support@inpact.gov.in\``;
  }

  if (/officer|nodal|directory|who/i.test(lastMsg)) {
    return `### Nodal Grievance Redressal Officers:
- **Roads & PWD**: Er. S.K. Sharma (Chief Executive Engineer, PWD Div 2)
- **Sanitation & Health**: Dr. Vinod Pathak (Chief Sanitary Officer, GNIDA)
- **Drainage & Water Supply**: Er. A.K. Srivastava (Superintending Engineer, UP Jal Nigam)
- **Electricity & Grid**: R.K. Gupta (Divisional Engineer, NPCL Power Grid)
- **Street Lighting**: Er. Manish Verma (Nodal Officer, NPCL)`;
  }

  return `Welcome to **IN-PACT (Integrated National Public Action & Grievance Redressal System)**! 

I am **Nagrik AI**, your 24x7 portal guide. I can help you with:
- 📝 **Filing a Grievance** with AI image/voice triage
- 🔍 **Tracking Complaint Status** via Reference ID
- ⏱️ **Checking Statutory SLAs** for PWD, Jal Nigam, NPCL & Sanitation
- 📞 **Emergency & Nodal Officer Contacts**
- 🗺️ **Navigating the Citizen Portal & Officer Console**

How may I assist you today?`;
}
