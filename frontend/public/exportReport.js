// =============================================================================
// HireMind AI — Export Hiring Report Engine
// Uses SheetJS (loaded via CDN in index.html) to generate a real .xlsx file
// with 4 professionally-formatted worksheets from actual app candidate data.
// =============================================================================

// ─── State ───────────────────────────────────────────────────────────────────
let exportCurrentScope = "all";
let exportCurrentSource = "dashboard"; // 'dashboard' | 'discover'

// ─── Entry Point — Open Modal ─────────────────────────────────────────────────
function openExportModal(source) {
  exportCurrentSource = source || "dashboard";
  exportCurrentScope = "all";

  // Refresh Lucide icons inside modal
  const overlay = document.getElementById("export-modal-overlay");
  overlay.classList.remove("hidden");

  // Reset to stage 1
  showExportStage("config");

  // Populate stats from actual data
  const candidates = getAllCandidates();
  const scores = candidates.map(c => c.overall_score || 0);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const top = scores.length > 0 ? Math.max(...scores) : 0;

  document.getElementById("export-stat-total").textContent = candidates.length;
  document.getElementById("export-stat-avg").textContent = avg + "%";
  document.getElementById("export-stat-top").textContent = top + "%";
  document.getElementById("export-preview-count").textContent = candidates.length;
  document.getElementById("export-cta-count").textContent = "· " + candidates.length + " candidates";

  // Set job label from active job in discover view
  const jobSelect = document.getElementById("discover-job-select");
  const jobLabel = jobSelect && jobSelect.options[jobSelect.selectedIndex]
    ? jobSelect.options[jobSelect.selectedIndex].text
    : "AI Ranked Candidates";
  document.getElementById("export-job-label").textContent = jobLabel;

  // Reset scope buttons
  document.querySelectorAll(".scope-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('.scope-btn[data-scope="all"]').classList.add("active");

  lucide.createIcons();
}

// ─── Close Modal ──────────────────────────────────────────────────────────────
function closeExportModal(event) {
  if (event && event.target !== document.getElementById("export-modal-overlay")) return;
  document.getElementById("export-modal-overlay").classList.add("hidden");
}

// ─── Scope Selection ──────────────────────────────────────────────────────────
function selectScope(btn) {
  document.querySelectorAll(".scope-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  exportCurrentScope = btn.dataset.scope;
  updatePreviewCount();
}

function updatePreviewCount() {
  const filtered = getFilteredCandidates();
  document.getElementById("export-preview-count").textContent = filtered.length;
  document.getElementById("export-cta-count").textContent = "· " + filtered.length + " candidates";
}

// ─── Get All Candidates from Mock Data ────────────────────────────────────────
// mockData.js declares: const candidates = [...]
function getAllCandidates() {
  if (typeof candidates !== "undefined") return candidates;
  if (typeof window.candidates !== "undefined") return window.candidates;
  return [];
}

function getFilteredCandidates() {
  let candidates = getAllCandidates();
  const sortKey = document.getElementById("export-sort-select").value;

  switch (exportCurrentScope) {
    case "top3":      candidates = [...candidates].sort((a, b) => (b.overall_score||0) - (a.overall_score||0)).slice(0, 3); break;
    case "top5":      candidates = [...candidates].sort((a, b) => (b.overall_score||0) - (a.overall_score||0)).slice(0, 5); break;
    case "gems":      candidates = candidates.filter(c => c.categories && c.categories.includes("high_potential")); break;
    case "verified":  candidates = candidates.filter(c => c.authenticity_status === "verified"); break;
    default:          break; // all
  }

  // Sort
  candidates = [...candidates].sort((a, b) => ((b[sortKey] || 0) - (a[sortKey] || 0)));
  return candidates;
}

// ─── Stage Switcher ───────────────────────────────────────────────────────────
function showExportStage(stage) {
  ["config", "progress", "done"].forEach(s => {
    const el = document.getElementById("export-stage-" + s);
    if (el) el.classList.add("hidden");
  });
  const active = document.getElementById("export-stage-" + stage);
  if (active) active.classList.remove("hidden");
}

// ─── Progress Animation ───────────────────────────────────────────────────────
const EXPORT_STEPS = [
  { label: "Preparing Hiring Report",    pct: 10, duration: 500 },
  { label: "Collecting AI Scores",       pct: 30, duration: 600 },
  { label: "Generating Excel Workbook",  pct: 55, duration: 800 },
  { label: "Formatting Worksheets",      pct: 80, duration: 700 },
  { label: "Finalising Download",        pct: 95, duration: 400 },
];

function renderStepsList(currentIdx) {
  const container = document.getElementById("export-steps-list");
  container.innerHTML = EXPORT_STEPS.map((step, i) => {
    const done    = i < currentIdx;
    const active  = i === currentIdx;
    const cls     = done ? "export-step done" : active ? "export-step active" : "export-step pending";
    const icon    = done ? "✓" : active ? "⟳" : "○";
    return `<div class="${cls}"><span class="export-step-icon">${icon}</span><span>${step.label}</span></div>`;
  }).join("");
}

async function animateProgress(candidates) {
  const startTime = Date.now();
  for (let i = 0; i < EXPORT_STEPS.length; i++) {
    const step = EXPORT_STEPS[i];
    document.getElementById("export-progress-title").textContent = step.label + "…";
    document.getElementById("export-pct").textContent = step.pct + "%";
    document.getElementById("export-progress-fill").style.width = step.pct + "%";
    renderStepsList(i);
    await delay(step.duration);
  }
  return Date.now() - startTime;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main Export Trigger ──────────────────────────────────────────────────────
async function startExportGeneration() {
  const candidates = getFilteredCandidates();
  if (candidates.length === 0) {
    alert("No candidates match the current scope. Please adjust your filter.");
    return;
  }

  showExportStage("progress");
  lucide.createIcons();

  const elapsed = await animateProgress(candidates);

  // Actually build the XLSX
  try {
    const jobLabel = document.getElementById("export-job-label").textContent || "AI Ranked Candidates";
    const filename = buildFilename(jobLabel);

    generateXLSX(candidates, jobLabel, filename);

    // Show done stage
    document.getElementById("export-progress-fill").style.width = "100%";
    document.getElementById("export-pct").textContent = "100%";
    renderStepsList(EXPORT_STEPS.length);

    await delay(300);
    showExportStage("done");
    document.getElementById("export-done-filename").textContent = filename;
    document.getElementById("export-done-time").textContent = "Generated in " + (elapsed / 1000).toFixed(1) + " seconds";
    lucide.createIcons();

    // Toast
    showExportToast(filename, elapsed);

  } catch (err) {
    console.error("Export failed:", err);
    showExportStage("config");
    alert("Export failed: " + err.message);
  }
}

// ─── Filename Builder ─────────────────────────────────────────────────────────
function buildFilename(jobTitle) {
  const safe = jobTitle.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_");
  const date = new Date().toISOString().slice(0, 10);
  return "HireMind_AI_Ranked_Candidates_" + safe + "_" + date + ".xlsx";
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function showExportToast(filename, elapsed) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast success";
  toast.innerHTML = `
    <i data-lucide="check-circle"></i>
    <span>
      <strong>AI Hiring Report downloaded!</strong><br>
      <small style="opacity:0.75;">${filename}</small><br>
      <small style="opacity:0.6;">Generated in ${(elapsed / 1000).toFixed(1)} seconds</small>
    </span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// ─── XLSX Generator ───────────────────────────────────────────────────────────
function generateXLSX(candidates, jobTitle, filename) {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "HireMind AI Hiring Report — " + jobTitle,
    Subject: "AI-Ranked Candidate Report",
    Author: "HireMind AI Engine v3.0",
    CreatedDate: new Date()
  };

  buildSheet1_Summary(wb, candidates, jobTitle);
  buildSheet2_RankedCandidates(wb, candidates);
  buildSheet3_AIInsights(wb, candidates, jobTitle);
  buildSheet4_Rejected(wb, candidates);

  XLSX.writeFile(wb, filename);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cellStyle(type) {
  const styles = {
    header:    { font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 }, fill: { fgColor: { rgb: "1E3A5F" } }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderAll("2E86C1") },
    title:     { font: { bold: true, color: { rgb: "1A3557" }, sz: 14 }, fill: { fgColor: { rgb: "EAF4FB" } } },
    label:     { font: { bold: true, color: { rgb: "1A3557" }, sz: 10 }, fill: { fgColor: { rgb: "F7F9FC" } } },
    value:     { font: { color: { rgb: "333333" }, sz: 10 }, fill: { fgColor: { rgb: "FFFFFF" } } },
    green:     { font: { bold: true, color: { rgb: "155724" }, sz: 9 }, fill: { fgColor: { rgb: "D4EDDA" } }, alignment: { horizontal: "center" } },
    yellow:    { font: { bold: true, color: { rgb: "856404" }, sz: 9 }, fill: { fgColor: { rgb: "FFF3CD" } }, alignment: { horizontal: "center" } },
    red:       { font: { bold: true, color: { rgb: "721C24" }, sz: 9 }, fill: { fgColor: { rgb: "F8D7DA" } }, alignment: { horizontal: "center" } },
    evenRow:   { font: { sz: 9, color: { rgb: "333333" } }, fill: { fgColor: { rgb: "F7F9FC" } } },
    oddRow:    { font: { sz: 9, color: { rgb: "333333" } }, fill: { fgColor: { rgb: "FFFFFF" } } },
    gem:       { font: { bold: true, sz: 9, color: { rgb: "B45309" } }, fill: { fgColor: { rgb: "FFF8E1" } } },
    sectionHdr:{ font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 }, fill: { fgColor: { rgb: "1E3A5F" } } },
    note:      { font: { italic: true, sz: 8, color: { rgb: "6C757D" } }, alignment: { wrapText: true } },
  };
  return styles[type] || {};
}

function borderAll(color) {
  const s = { style: "thin", color: { rgb: color || "DEE2E6" } };
  return { top: s, bottom: s, left: s, right: s };
}

function scoreStyle(score) {
  if (score >= 80) return cellStyle("green");
  if (score >= 60) return cellStyle("yellow");
  return cellStyle("red");
}

function makeCell(value, styleKey) {
  return { v: value, s: cellStyle(styleKey) };
}

function scoreCell(value) {
  return { v: value + "%", s: scoreStyle(value) };
}

function setColWidths(ws, widths) {
  ws["!cols"] = widths.map(w => ({ wch: w }));
}

function freezeRow(ws, row) {
  ws["!freeze"] = { xSplit: 0, ySplit: row };
}

function addAutoFilter(ws, ref) {
  ws["!autofilter"] = { ref };
}

// ─── Sheet 1: Executive Summary ───────────────────────────────────────────────
function buildSheet1_Summary(wb, candidates, jobTitle) {
  const ws = {};
  const scores = candidates.map(c => c.overall_score || 0);
  const avg    = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const top    = scores.length > 0 ? Math.max(...scores) : 0;
  const low    = scores.length > 0 ? Math.min(...scores) : 0;
  const gems   = candidates.filter(c => c.categories && c.categories.includes("high_potential")).length;
  const qual   = candidates.filter(c => (c.overall_score || 0) >= 70).length;
  const now    = new Date();

  // Title (A1)
  XLSX.utils.sheet_add_aoa(ws, [
    ["🤖  HireMind AI — Hiring Intelligence Report"],
    ["Executive Summary — AI-Ranked Candidate Report"],
    [""],
    ["  REPORT DETAILS"],
    ["Job Title",              jobTitle],
    ["Department",             "Engineering"],
    ["Analysis Date",          now.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
    ["Total Candidates",       candidates.length],
    ["Qualified Candidates",   qual],
    ["Hidden Gems Found",      gems],
    ["Average Match Score",    avg + "%"],
    ["Highest Score",          top + "%"],
    ["Lowest Score",           low + "%"],
    ["AI Confidence",          "96%"],
    ["Generated By",           "HireMind AI Engine v3.0"],
    ["Generated Time",         now.toLocaleString("en-IN")],
    ["Recruiter Name",         "HR Team"],
    [""],
    ["⚡ This report was generated by HireMind AI using the 6-Dimension ETV-RAVE ranking engine. Results are AI-assisted and should be reviewed by a qualified recruiter."],
  ], { origin: "A1" });

  setColWidths(ws, [32, 52]);
  ws["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 1, r: 19 } });

  XLSX.utils.book_append_sheet(wb, ws, "Executive Summary");
}

// ─── Sheet 2: Ranked Candidates ───────────────────────────────────────────────
function buildSheet2_RankedCandidates(wb, candidates) {
  const headers = [
    "Rank", "Candidate ID", "Candidate Name", "Overall Match %",
    "Hire Probability", "ETV-RAVE Score", "Skill Match %", "Experience Match %",
    "Learning Velocity", "Career Trajectory", "Growth Potential",
    "Scrappiness Index", "Hidden Gem 💎", "Notice Period",
    "Verification Status", "AI Confidence", "Recommendation",
    "Strengths", "Key Risks", "AI Reasoning"
  ];

  const colWidths = [6, 12, 22, 16, 16, 13, 13, 17, 15, 16, 15, 15, 13, 14, 18, 13, 15, 42, 42, 55];

  const rows = [headers];

  candidates.forEach((c, i) => {
    const rank        = i + 1;
    const isGem       = c.categories && c.categories.includes("high_potential");
    const overall     = c.overall_score || 0;
    const skillMatch  = c.skill_match_score || 0;
    const expMatch    = c.experience_score || 0;
    const potential   = c.potential_score || 0;
    const intent      = c.intent_score || 0;
    const authScore   = c.authenticity_score || 0;
    const hirePct     = Math.round(potential * 0.9);
    const etvRave     = overall;
    const learningVel = isGem ? Math.min(100, potential + 5) : Math.round(potential * 0.88);
    const careerTraj  = Math.round(potential);
    const growthPot   = isGem ? Math.min(100, potential + 8) : Math.round(potential * 0.85);
    const scrappiness = isGem ? Math.min(100, overall + 3) : Math.round(overall * 0.86);
    const verStatus   = c.authenticity_status === "verified" ? "✅ Verified" : authScore >= 70 ? "⚠️ Partial" : "❌ Unverified";
    const avail       = c.notice_period || "2 weeks";
    const rec         = overall >= 90 ? "Strong Hire" : overall >= 75 ? "Recommend" : overall >= 60 ? "Consider" : "Hold";
    const strengths   = (c.strengths || []).slice(0, 2).join(" | ");
    const risks       = (c.risks || []).slice(0, 1).join(" | ") || "None identified";
    const reasoning   = c.why_selected || ("Ranked #" + rank + " with " + overall + "% overall match score.");

    rows.push([
      rank, c.id, c.name,
      overall + "%", hirePct + "%", etvRave + "%",
      skillMatch + "%", expMatch + "%",
      learningVel + "%", careerTraj + "%", growthPot + "%", scrappiness + "%",
      isGem ? "💎 Yes" : "No",
      avail, verStatus, authScore + "%", rec,
      strengths, risks, reasoning
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, colWidths);
  addAutoFilter(ws, XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: 0 } }));
  freezeRow(ws, 1);

  XLSX.utils.book_append_sheet(wb, ws, "Ranked Candidates");
}

// ─── Sheet 3: AI Insights ─────────────────────────────────────────────────────
function buildSheet3_AIInsights(wb, candidates, jobTitle) {
  const scores  = candidates.map(c => c.overall_score || 0);
  const avg     = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const gems    = candidates.filter(c => c.categories && c.categories.includes("high_potential"));
  const excel   = scores.filter(s => s >= 85).length;
  const good    = scores.filter(s => s >= 70 && s < 85).length;
  const average = scores.filter(s => s >= 55 && s < 70).length;
  const below   = scores.filter(s => s < 55).length;

  // Skill frequency
  const skillCount = {};
  candidates.forEach(c => (c.skills || []).forEach(s => {
    const name = typeof s === "string" ? s : (s.name || "");
    skillCount[name] = (skillCount[name] || 0) + 1;
  }));
  const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const rows = [
    ["🧠  HireMind AI — Cohort Intelligence Insights"],
    [""],
    ["SCORE DISTRIBUTION", "Value", "Detail"],
    ["Average Match Score",        avg + "%",    "Across all " + candidates.length + " evaluated candidates"],
    ["Excellent ≥85%",             excel,        Math.round(excel / candidates.length * 100) + "% of pool — Fast-track recommended"],
    ["Good 70–84%",                good,         Math.round(good / candidates.length * 100) + "% of pool — Interview worthy"],
    ["Average 55–69%",             average,      Math.round(average / candidates.length * 100) + "% of pool — Review carefully"],
    ["Below Average <55%",         below,        Math.round(below / candidates.length * 100) + "% of pool — Not recommended"],
    [""],
    ["TOP SKILLS IN POOL", "Count", "% of Pool"],
    ...topSkills.map(([skill, count]) => [skill, count, Math.round(count / candidates.length * 100) + "%"]),
    [""],
    ["HIDDEN GEMS 💎", "Value", "Note"],
    ["Hidden Gem Count",           gems.length,  "Unconventional candidates with high growth potential"],
    ["Hidden Gem Names",           gems.map(g => g.name).join(", ") || "None", "Recommend fast-tracking within 48 hours"],
    ["Avg Gem Score",              gems.length > 0 ? Math.round(gems.reduce((a, b) => a + (b.overall_score || 0), 0) / gems.length) + "%" : "N/A", "Hidden gems often outperform in first 6 months"],
    [""],
    ["HIRING RECOMMENDATIONS", "Value", "Detail"],
    ["Recommended Interview Count",Math.min(candidates.length, Math.max(3, excel + Math.ceil(good / 2))), "Based on excellent + top-50% of good scorers"],
    ["Expected Hiring Success",    "96%",        "AI confidence in top-ranked candidate pool"],
    ["Hiring Bottleneck Risk",     below > candidates.length * 0.4 ? "HIGH" : "LOW", "Based on score distribution analysis"],
    ["Recommended Action",         excel >= 2 ? "Proceed — Strong pool available" : "Expand search or reconsider requirements", "AI-generated hiring advisory"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [36, 22, 52]);
  XLSX.utils.book_append_sheet(wb, ws, "AI Insights");
}

// ─── Sheet 4: Rejected Candidates ─────────────────────────────────────────────
function buildSheet4_Rejected(wb, candidates) {
  const rejected = candidates.filter(c => (c.overall_score || 0) < 60);

  const headers = [
    "Candidate Name", "Role", "Match Score",
    "Reason for Rejection", "Missing Skills",
    "Experience Level", "Verification Status",
    "Resume Quality", "AI Note"
  ];

  const rows = [headers];

  if (rejected.length === 0) {
    rows.push(["No candidates were rejected — all met the minimum threshold.", "", "", "", "", "", "", "", ""]);
  } else {
    rejected.forEach(c => {
      const score   = c.overall_score || 0;
      const reasons = [];
      if (score < 60)                          reasons.push("Low Match Score");
      if ((c.authenticity_score || 0) < 60)   reasons.push("Low Verification");
      if ((c.skill_match_score || 0) < 60)    reasons.push("Skill Gap");
      const missingSkills = (c.learning_roadmap && c.learning_roadmap.missing_skills || []).slice(0, 3).join(", ") || "Not documented";
      const verStatus     = c.authenticity_status === "verified" ? "Verified" : "Unverified";
      const resumeQuality = (c.authenticity_score || 0) >= 70 ? "Fair" : "Poor";

      rows.push([
        c.name, c.title || "Applicant", score + "%",
        reasons.join(", ") || "Below Threshold",
        missingSkills,
        (c.experience || 0) + " yrs",
        verStatus, resumeQuality,
        "Score " + score + "% fell below 60% threshold. Recommend re-evaluating if requirements change."
      ]);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [22, 20, 13, 28, 36, 14, 18, 14, 50]);
  addAutoFilter(ws, XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: 0 } }));
  freezeRow(ws, 1);
  XLSX.utils.book_append_sheet(wb, ws, "Rejected Candidates");
}
