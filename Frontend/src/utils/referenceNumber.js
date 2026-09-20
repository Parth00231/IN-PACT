/**
 * Utility for generating and validating Grievance Reference Numbers in format:
 * RNYYYYMMDD(A to Z)XXXX
 * Example: RN20260920A4819
 */

/**
 * Generate an official Grievance Reference Number
 * Format: RN + YYYYMMDD + [A-Z] + [1000-9999]
 * @returns {string} e.g. "RN20260920K4819"
 */
export function generateReferenceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit positive integer
  return `RN${year}${month}${day}${letter}${num}`;
}

/**
 * Validates whether a string matches the reference number format
 * @param {string} refId 
 * @returns {boolean}
 */
export function isValidReferenceNumber(refId) {
  if (!refId || typeof refId !== "string") return false;
  const regex = /^RN\d{8}[A-Z]\d{4}$/i;
  return regex.test(refId.trim()) || /^UP-GND-\d{4}-\d{4}$/i.test(refId.trim());
}

/**
 * Save user grievance to localStorage history for persistent tracking
 * @param {object} grievance 
 */
export function saveGrievanceHistory(grievance) {
  try {
    const existing = JSON.parse(localStorage.getItem("inpact_grievances_history") || "[]");
    const filtered = existing.filter(g => g.refId !== grievance.refId && g.id !== grievance.id);
    const updated = [grievance, ...filtered];
    localStorage.setItem("inpact_grievances_history", JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.warn("Could not save grievance to local storage:", err);
  }
}

/**
 * Retrieve saved grievances from localStorage
 * @returns {Array}
 */
export function getSavedGrievancesHistory() {
  try {
    return JSON.parse(localStorage.getItem("inpact_grievances_history") || "[]");
  } catch (err) {
    return [];
  }
}
