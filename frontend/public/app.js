// Main Application Engine for HireMind AI Platform

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Globals
  let activeJobFilter = "job-1";
  let activeSort = "score";
  let showGemsOnly = false;
  let currentCandidateDnaId = "cand-1";
  let currentRecCandidateId = "cand-1";
  let globalSearchQuery = "";
  let marketFilterTag = null;
  
  // V2 Globals
  let currentPortalMode = "recruiter"; // recruiter or candidate
  let activeCandidateId = "cand-1"; // Helena Rostova (default user for Candidate view)
  let quizQuestionIdx = 0;
  let quizCorrectAnswers = 0;

  // Chart References (to prevent canvas reuse issues)
  let dnaChartInstance = null;
  let distributionChartInstance = null;
  let predictionChartInstance = null;

  // 1. Hash-based Router
  const routes = {
    landing: "landing-view",
    dashboard: "dashboard-view",
    candidates: "candidates-view",
    hiddengems: "hiddengems-view",
    marketplace: "marketplace-view",
    pipeline: "pipeline-view",
    dna: "dna-view",
    insights: "insights-view",
    notifications: "notifications-view",
    recommendation: "recommendation-view",
    "candidate-dashboard": "candidate-dashboard-view"
  };

  function handleRouting() {
    // Sync portal mode with logged in user type if available
    const loggedInType = localStorage.getItem('hm-user-type');
    if (loggedInType) {
      currentPortalMode = loggedInType;
      // Sync portal switch UI buttons if they exist
      const recSwitch = document.getElementById("portal-switch-recruiter");
      const candSwitch = document.getElementById("portal-switch-candidate");
      const recGroup = document.getElementById("nav-recruiter-group");
      const candGroup = document.getElementById("nav-candidate-group");
      
      if (recSwitch && candSwitch) {
        if (currentPortalMode === 'candidate') {
          candSwitch.classList.add("active");
          recSwitch.classList.remove("active");
          if (candGroup && recGroup) {
            candGroup.classList.remove("hidden");
            recGroup.classList.add("hidden");
          }
        } else {
          recSwitch.classList.add("active");
          candSwitch.classList.remove("active");
          if (candGroup && recGroup) {
            recGroup.classList.remove("hidden");
            candGroup.classList.add("hidden");
          }
        }
      }
    }

    let hash = window.location.hash.substring(1);
    if (!hash || hash === "" || hash === "landing") {
      hash = "landing";
    }

    // Safeguard route redirects when portal mode changes
    if (hash === "dashboard" && currentPortalMode === "candidate") {
      hash = "candidate-dashboard";
      window.location.hash = "#candidate-dashboard";
      return;
    }
    if (hash === "candidate-dashboard" && currentPortalMode === "recruiter") {
      hash = "dashboard";
      window.location.hash = "#dashboard";
      return;
    }

    // Determine Layout (Hide sidebar for landing page)
    const dashboardLayout = document.getElementById("dashboard-layout");
    const landingView = document.getElementById("landing-view");
    
    if (hash === "landing") {
      dashboardLayout.classList.add("layout-hidden");
      landingView.classList.add("active");
      landingView.classList.remove("hidden");
    } else {
      landingView.classList.add("hidden");
      landingView.classList.remove("active");
      dashboardLayout.classList.remove("layout-hidden");

      // Update sidebar nav highlighting
      document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("data-view") === hash) {
          item.classList.add("active");
        }
      });

      // Update page header title
      const pageTitles = {
        dashboard: "Recruiter Dashboard",
        candidates: "Candidate Intelligence Dashboard",
        hiddengems: "Hidden Gems Dashboard",
        marketplace: "AI Talent Marketplace",
        pipeline: "Future Talent Pipeline",
        dna: currentPortalMode === "candidate" ? "My Skill DNA Profile" : "Candidate DNA Profiler",
        insights: "AI System Insights",
        notifications: "Notifications Center",
        recommendation: "Explainable AI Match Matrix",
        "candidate-dashboard": "Candidate Talent Dashboard"
      };
      
      const titleEl = document.getElementById("page-title");
      if (titleEl && pageTitles[hash]) {
        titleEl.textContent = pageTitles[hash];
      }
    }

    // Hide all view panels
    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.add("hidden");
    });

    // Show the active panel
    const activePanelId = routes[hash];
    const activePanel = document.getElementById(activePanelId);
    if (activePanel) {
      activePanel.classList.remove("hidden");
    }

    // Trigger View Loaders
    if (hash === "dashboard") loadDashboardView();
    if (hash === "candidates") loadCandidatesView();
    if (hash === "hiddengems") loadHiddenGemsView();
    if (hash === "marketplace") loadMarketplaceView();
    if (hash === "pipeline") loadPipelineView();
    if (hash === "dna") {
      if (currentPortalMode === "candidate") {
        currentCandidateDnaId = activeCandidateId;
      }
      loadCandidateDnaView();
    }
    if (hash === "insights") loadInsightsView();
    if (hash === "notifications") loadNotificationsView();
    if (hash === "recommendation") loadExplainableAiView();
    if (hash === "candidate-dashboard") loadCandidateDashboardView();

    lucide.createIcons();
  }

  window.addEventListener("hashchange", handleRouting);
  // Initial route execution
  handleRouting();

  // 2. Sidebar Navigation Actions
  const collapseBtn = document.getElementById("collapse-sidebar");
  const sidebar = document.querySelector(".sidebar");
  collapseBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const isColl = sidebar.classList.contains("collapsed");
    collapseBtn.querySelector("i").setAttribute("data-lucide", isColl ? "chevron-right" : "chevron-left");
    lucide.createIcons();
  });

  // Global search input handling
  const globalSearch = document.getElementById("global-search");
  globalSearch.addEventListener("input", (e) => {
    globalSearchQuery = e.target.value.toLowerCase();
    const hash = window.location.hash.substring(1);
    if (hash === "candidates") {
      loadCandidatesView();
    } else if (hash === "marketplace") {
      document.getElementById("market-search-input").value = e.target.value;
      loadMarketplaceView();
    }
  });

  // JD Upload Modal Interactivity
  const uploadJdBtn = document.getElementById("upload-jd-btn");
  const uploadModal = document.getElementById("upload-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const cancelUploadBtn = document.getElementById("cancel-upload-btn");
  const analyzeJdBtn = document.getElementById("analyze-jd-btn");
  const dragDropArea = document.getElementById("drag-drop-area");
  const jdFileInput = document.getElementById("jd-file-input");

  function openJdModal() {
    uploadModal.classList.remove("hidden");
  }

  function closeJdModal() {
    uploadModal.classList.add("hidden");
    document.getElementById("jd-text-input").value = "";
  }

  uploadJdBtn.addEventListener("click", openJdModal);
  closeModalBtn.addEventListener("click", closeJdModal);
  cancelUploadBtn.addEventListener("click", closeJdModal);
  
  dragDropArea.addEventListener("click", () => jdFileInput.click());
  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = "var(--cyan)";
    dragDropArea.style.background = "rgba(6, 182, 212, 0.04)";
  });
  dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.style.borderColor = "rgba(255, 255, 255, 0.15)";
    dragDropArea.style.background = "transparent";
  });
  dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = "var(--green)";
    dragDropArea.style.background = "rgba(16, 185, 129, 0.04)";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateJdProcessing(files[0].name);
    }
  });
  jdFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      simulateJdProcessing(e.target.files[0].name);
    }
  });

  analyzeJdBtn.addEventListener("click", () => {
    const textVal = document.getElementById("jd-text-input").value;
    if (textVal.trim() !== "") {
      simulateJdProcessing("Custom Text Upload");
    }
  });

  function simulateJdProcessing(name) {
    closeJdModal();
    // 1. Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: "jd",
      title: "New Job Analysis Complete",
      body: `Successfully mapped competencies for target role: "${name}". Identified 3 skill adjacencies.`,
      time: "Just now",
      unread: true,
      actionLink: "#candidates"
    };
    initialNotifications.unshift(newNotif);
    updateNotifBadge();

    // 2. Add Job Pipeline row
    const newJob = {
      job_id: `job-${initialJobs.length + 1}`,
      title: name.split(".")[0].replace("_", " ").replace("-", " "),
      department: "Engineering",
      active_candidates: 3,
      match_health: 89,
      required_skills: ["Python", "AWS", "Kubernetes"]
    };
    initialJobs.push(newJob);
    
    // 3. Add mock candidates matching this job
    const newCand = {
      id: `cand-${candidates.length + 1}`,
      name: "Dimitri Belov",
      title: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      experience: 5,
      overall_score: 91,
      categories: ["hidden_gem", "fast_learner"],
      skill_match_score: 88,
      experience_score: 85,
      potential_score: 93,
      intent_score: 90,
      alignment_score: 91,
      skills: [
        { name: "Python", level: 90, matchType: "exact" },
        { name: "Docker", level: 88, matchType: "adjacent", equivalentTo: "Kubernetes" },
        { name: "GCP Cloud", level: 82, matchType: "adjacent", equivalentTo: "AWS" }
      ],
      why_selected: "Dimitri was automatically mapped from our Talent Marketplace to the newly uploaded Job description. His docker and GCP competencies map cleanly to Kubernetes and AWS requirements.",
      strengths: ["Strong systems scripting", "High adaptability across Cloud Environments"],
      risks: ["Minimal container orchestration in production scales"],
      predicted_role_2yr: "Senior Systems Engineer",
      prediction_confidence: "88%",
      prediction_rationale: "Shows highly analytical system design capabilities.",
      readiness: { technical: 88, communication: 90, domain: 85, culture: 92 },
      target_job_id: newJob.job_id
    };
    candidates.push(newCand);

    // Refresh active panel if in Dashboard
    if (window.location.hash === "#dashboard" || window.location.hash === "") {
      loadDashboardView();
    }
  }

  // Notif badge count update
  function updateNotifBadge() {
    const unreadCount = initialNotifications.filter(n => n.unread).length;
    const badgeEl = document.getElementById("notif-count");
    if (badgeEl) {
      badgeEl.textContent = unreadCount;
      badgeEl.style.display = unreadCount === 0 ? "none" : "block";
    }
  }
  updateNotifBadge();

  // Bind bell button and logout
  document.getElementById("notif-bell-btn").addEventListener("click", () => {
    window.location.hash = "#notifications";
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem('hm-logged-in');
    localStorage.removeItem('hm-user-email');
    localStorage.removeItem('hm-user-type');
    localStorage.removeItem('hm-onboarded');
    window.location.hash = "#landing";
  });

  // --- VIEW 2: RECRUITER DASHBOARD ---
  function loadDashboardView() {
    const pipelineList = document.getElementById("jobs-pipeline-list");
    if (pipelineList) {
      pipelineList.innerHTML = "";
      initialJobs.forEach(job => {
        const row = document.createElement("div");
        row.className = "job-row";
        row.addEventListener("click", () => {
          activeJobFilter = job.job_id;
          window.location.hash = "#candidates";
        });

        row.innerHTML = `
          <div class="job-main">
            <span class="job-title">${job.title}</span>
            <span class="job-meta">${job.department}</span>
          </div>
          <div>
            <span class="job-stat-label">Applicants</span>
            <span class="job-stat-val">${job.active_candidates}</span>
          </div>
          <div>
            <span class="job-stat-label">Match Health</span>
            <span class="job-stat-val text-green">${job.match_health}%</span>
          </div>
          <div>
            <span class="job-stat-label">Core Tech</span>
            <span class="job-badge bg-blue-tint text-blue">${job.required_skills[0]}</span>
          </div>
          <div>
            <span class="job-stat-label">Action</span>
            <span class="job-badge bg-purple-tint text-purple" style="cursor: pointer;">Analyze DNA</span>
          </div>
        `;
        pipelineList.appendChild(row);
      });
    }

    const rematchesList = document.getElementById("recent-rematches-list");
    if (rematchesList) {
      rematchesList.innerHTML = "";
      rematches.forEach(rematch => {
        const item = document.createElement("div");
        item.className = "rematch-item";
        item.innerHTML = `
          <img src="${rematch.avatar}" alt="Avatar" class="rematch-avatar">
          <div class="rematch-info">
            <span class="rematch-candidate">${rematch.candidateName}</span>
            <span class="rematch-role">${rematch.newMatchRole}</span>
          </div>
          <span class="rematch-score">${rematch.score}%</span>
        `;
        rematchesList.appendChild(item);
      });
    }

    // Populate Recruiter Dashboard widgets dynamically
    const gemsContainer = document.getElementById("widget-top-gems");
    if (gemsContainer) {
      gemsContainer.innerHTML = "";
      // Grab top candidates / hidden gems
      const topGemsList = candidates.slice(0, 3);
      topGemsList.forEach(c => {
        const isGem = c.categories.includes("hidden_gem");
        const badge = isGem ? `<span class="badge badge-purple" style="font-size:9px;">GEM</span>` : `<span class="badge badge-cyan" style="font-size:9px;">TOP</span>`;
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.padding = "8px";
        div.style.background = "rgba(255,255,255,0.01)";
        div.style.borderRadius = "8px";
        div.style.border = "1px solid rgba(255,255,255,0.03)";
        div.style.cursor = "pointer";
        div.onclick = () => {
          currentRecCandidateId = c.id;
          window.location.hash = "#recommendation";
        };
        div.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${c.avatar}" style="width:28px; height:28px; border-radius:50%; border:1px solid var(--border-color);">
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:12px; font-weight:600;">${c.name}</span>
              <span style="font-size:10px; color:var(--text-muted);">${c.title}</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:var(--cyan);">${c.overall_score}%</span>
            ${badge}
          </div>
        `;
        gemsContainer.appendChild(div);
      });
    }

    const leadersContainer = document.getElementById("widget-dna-leaders");
    if (leadersContainer) {
      leadersContainer.innerHTML = "";
      const leadersList = [...candidates].sort((a, b) => b.potential_score - a.potential_score).slice(0, 3);
      leadersList.forEach(c => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.padding = "8px";
        div.style.background = "rgba(255,255,255,0.01)";
        div.style.borderRadius = "8px";
        div.style.border = "1px solid rgba(255,255,255,0.03)";
        div.style.cursor = "pointer";
        div.onclick = () => {
          currentCandidateDnaId = c.id;
          window.location.hash = "#dna";
        };
        div.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${c.avatar}" style="width:28px; height:28px; border-radius:50%; border:1px solid var(--border-color);">
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:12px; font-weight:600;">${c.name}</span>
              <span style="font-size:10px; color:var(--text-muted); Future: ${c.predicted_role_2yr}</span>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <span style="font-size:11px; color:var(--purple); font-weight:600;">Potential: ${c.potential_score}</span>
            <span style="font-size:10px; color:var(--green);">Intent: ${c.intent_score}</span>
          </div>
        `;
        leadersContainer.appendChild(div);
      });
    }

    const authenticityContainer = document.getElementById("widget-authenticity-list");
    if (authenticityContainer) {
      authenticityContainer.innerHTML = "";
      const authList = candidates.slice(0, 3);
      authList.forEach(c => {
        const isVerified = c.authenticity_status === "verified";
        const statusChip = isVerified 
          ? `<span class="opp-badge interview" style="padding:2px 6px; font-size:9px;"><i data-lucide="shield-check" class="icon-tiny"></i> Verified (${c.authenticity_score}%)</span>` 
          : `<span class="opp-badge nurture" style="padding:2px 6px; font-size:9px;"><i data-lucide="clock" class="icon-tiny"></i> Pending</span>`;
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.padding = "8px";
        div.style.background = "rgba(255,255,255,0.01)";
        div.style.borderRadius = "8px";
        div.style.border = "1px solid rgba(255,255,255,0.03)";
        div.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${c.avatar}" style="width:28px; height:28px; border-radius:50%; border:1px solid var(--border-color);">
            <span style="font-size:12px; font-weight:600;">${c.name}</span>
          </div>
          <div>
            ${statusChip}
          </div>
        `;
        authenticityContainer.appendChild(div);
      });
    }
  }

  // --- VIEW 3: CANDIDATE INTELLIGENCE ---
  function loadCandidatesView() {
    // Populate job filter select
    const selectFilter = document.getElementById("job-select-filter");
    selectFilter.innerHTML = "";
    initialJobs.forEach(j => {
      const opt = document.createElement("option");
      opt.value = j.job_id;
      opt.textContent = j.title;
      if (j.job_id === activeJobFilter) opt.selected = true;
      selectFilter.appendChild(opt);
    });

    // Event listeners for filters
    selectFilter.onchange = (e) => {
      activeJobFilter = e.target.value;
      loadCandidatesView();
    };

    const sortSelect = document.getElementById("sort-select");
    sortSelect.value = activeSort;
    sortSelect.onchange = (e) => {
      activeSort = e.target.value;
      loadCandidatesView();
    };

    const gemsCheckbox = document.getElementById("filter-gems-only");
    gemsCheckbox.checked = showGemsOnly;
    gemsCheckbox.onchange = (e) => {
      showGemsOnly = e.target.checked;
      loadCandidatesView();
    };

    // Filter and Sort Candidates
    let filtered = candidates.filter(c => c.target_job_id === activeJobFilter);
    
    if (showGemsOnly) {
      filtered = filtered.filter(c => c.categories.includes("hidden_gem"));
    }

    if (globalSearchQuery !== "") {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(globalSearchQuery) || 
        c.title.toLowerCase().includes(globalSearchQuery) ||
        c.skills.some(s => s.name.toLowerCase().includes(globalSearchQuery))
      );
    }

    // Sort mapping
    filtered.sort((a, b) => {
      if (activeSort === "score") return b.overall_score - a.overall_score;
      if (activeSort === "potential") return b.potential_score - a.potential_score;
      if (activeSort === "intent") return b.intent_score - a.intent_score;
      if (activeSort === "experience") return b.experience - a.experience;
      return 0;
    });

    // Update count header
    const currentJob = initialJobs.find(j => j.job_id === activeJobFilter);
    document.getElementById("job-title-header").textContent = currentJob ? `Candidates for ${currentJob.title}` : "Candidates";
    document.getElementById("candidate-count").textContent = `${filtered.length} candidates matches found`;

    // Populate candidates list UI
    const container = document.getElementById("candidates-list-container");
    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">No candidates matching the current filters.</div>`;
      document.getElementById("candidate-quickview").classList.add("hidden");
      return;
    }

    filtered.forEach((c, idx) => {
      const row = document.createElement("div");
      row.className = `candidate-card-row ${c.id === currentRecCandidateId ? 'selected' : ''}`;
      row.addEventListener("click", () => {
        currentRecCandidateId = c.id;
        loadCandidatesView();
      });

      const isGem = c.categories.includes("hidden_gem");
      const gemBadge = isGem ? `<i data-lucide="gem" class="text-purple icon-tiny" title="Hidden Gem"></i>` : "";

      row.innerHTML = `
        <img src="${c.avatar}" alt="Avatar" class="candidate-avatar">
        <div class="c-name-col">
          <span class="c-name">${c.name} ${gemBadge}</span>
          <span class="c-title">${c.title}</span>
        </div>
        <div class="score-col">
          <span class="score-lbl">Hire Prob</span>
          <span class="score-val text-cyan">${c.overall_score}%</span>
        </div>
        <div class="score-col">
          <span class="score-lbl">Qualified</span>
          <span class="score-val text-purple">${Math.round((c.hire_probability?.qualified || 0.8) * 100)}%</span>
        </div>
        <div class="score-col">
          <span class="score-lbl">Available</span>
          <span class="score-val text-green">${Math.round((c.hire_probability?.available || 0.8) * 100)}%</span>
        </div>
      `;
      container.appendChild(row);
    });

    // Load Quickview Detail Card
    const selectedCand = filtered.find(c => c.id === currentRecCandidateId) || filtered[0];
    if (selectedCand) {
      currentRecCandidateId = selectedCand.id;
      showQuickviewCard(selectedCand);
    }
  }

  function showQuickviewCard(cand) {
    const qvPanel = document.getElementById("candidate-quickview");
    qvPanel.classList.remove("hidden");

    let badgeHtml = "";
    if (cand.honeypot_risk) {
      badgeHtml += `<span class="badge" style="background: var(--orange); margin-right: 4px;">⚠️ HONEYPOT RISK</span>`;
    }
    if (cand.hidden_gem) {
      badgeHtml += `<span class="badge badge-purple" style="margin-right: 4px;">💎 HIDDEN GEM</span>`;
    }

    const categoryBadges = badgeHtml + cand.categories.map(cat => {
      const name = cat.replace("_", " ").toUpperCase();
      const color = cat === "hidden_gem" ? "badge-purple" : cat === "honeypot_risk" ? "badge-orange" : "badge-cyan";
      return `<span class="badge ${color}">${name}</span>`;
    }).join(" ");

    const skillsHtml = cand.skills.map(s => {
      const typeClass = s.matchType === "exact" ? "match" : s.matchType === "adjacent" ? "adjacent" : "";
      return `<span class="skill-tag ${typeClass}">${s.name} (${s.level})</span>`;
    }).join("");

    // Fallback probability values if they don't exist on older/custom candidates
    const hp = cand.hire_probability || {
      qualified: (cand.candidate_dna?.technical_fit || cand.skill_match_score || 80) / 100,
      available: (cand.candidate_dna?.experience_fit || cand.experience_score || 80) / 100,
      engageable: (cand.candidate_dna?.career_trajectory || cand.potential_score || 85) / 100,
      legitimate: cand.honeypot_risk ? 0.10 : (cand.candidate_dna?.behavioral_intent || cand.alignment_score || 90) / 100,
      growth: (cand.candidate_dna?.credibility || 80) / 100,
      scrappiness: (cand.candidate_dna?.hidden_gem_score || (cand.categories.includes("hidden_gem") ? 90 : 60)) / 100,
      hire_score: cand.overall_score
    };

    // Recalculate if mismatch
    const calculatedScore = Math.round(hp.qualified * hp.available * hp.engageable * hp.legitimate * hp.growth * hp.scrappiness * 100);
    const finalScore = hp.hire_score || calculatedScore;

    // Detect "zero-killer" factor (factor < 0.15)
    let zeroKillerMsg = "";
    if (hp.qualified < 0.15) zeroKillerMsg = `Critical deficiency in Qualification (${Math.round(hp.qualified*100)}%)`;
    else if (hp.available < 0.15) zeroKillerMsg = `Critical deficiency in Availability (${Math.round(hp.available*100)}%)`;
    else if (hp.engageable < 0.15) zeroKillerMsg = `Critical deficiency in Engageability (${Math.round(hp.engageable*100)}%)`;
    else if (hp.legitimate < 0.15) zeroKillerMsg = `Critical deficiency in Legitimacy / Credibility (${Math.round(hp.legitimate*100)}%)`;
    else if (hp.growth < 0.15) zeroKillerMsg = `Critical deficiency in Growth Potential (${Math.round(hp.growth*100)}%)`;
    else if (hp.scrappiness < 0.15) zeroKillerMsg = `Critical deficiency in Scrappiness (${Math.round(hp.scrappiness*100)}%)`;

    qvPanel.innerHTML = `
      <div class="qv-header">
        <div class="qv-profile-block">
          <img src="${cand.avatar}" alt="Avatar" class="avatar-large">
          <div class="qv-profile-meta">
            <h3>${cand.name}</h3>
            <p>${cand.title} • ${cand.experience} yrs exp</p>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center; max-width: 50%; justify-content: flex-end;">${categoryBadges}</div>
      </div>

      ${zeroKillerMsg ? `
        <div class="p-factor-zero-alert">
          <i data-lucide="alert-octagon"></i>
          <div>
            <strong>Zero-Killer Alert</strong>
            <p style="margin: 0; margin-top: 2px;">${zeroKillerMsg}. Final Hire Probability is suppressed due to multiplicative constraints.</p>
          </div>
        </div>
      ` : ''}

      ${cand.honeypot_risk && !zeroKillerMsg ? `
        <div class="honeypot-alert-banner" style="background: rgba(249, 115, 22, 0.1); border: 1px solid var(--orange); padding: 12px; border-radius: 8px; margin: 16px 0; display: flex; gap: 10px; align-items: center;">
          <i data-lucide="alert-triangle" style="color: var(--orange); flex-shrink: 0;"></i>
          <div>
            <strong style="color: var(--orange); font-size: 13px; display: block; margin-bottom: 2px;">Honeypot Profile Alert</strong>
            <p style="margin: 0; font-size: 11px; color: var(--text-muted); line-height: 1.3;">This candidate profile shows suspicious keyword matching indicators and timeline anomalies.</p>
          </div>
        </div>
      ` : ''}

      <div class="hire-prob-score-badge">
        <span class="score-title">Evidence-Driven Hire Probability</span>
        <span class="score-value">${finalScore}%</span>
        <span class="score-label">${finalScore >= 70 ? '✓ High Recruit Confidence' : finalScore >= 40 ? '⚡ Moderate Recruit Confidence' : '⚠️ Elevated Risk'}</span>
      </div>

      <div class="qv-insights-section">
        <h4>Probability Dimensions (Multiplicative)</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
          
          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Qualified) — Execution Capability</span>
              <span class="p-label-val">${Math.round(hp.qualified * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.qualified * 100}%; background: var(--cyan);"></div>
            </div>
          </div>

          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Available) — Market Readiness</span>
              <span class="p-label-val">${Math.round(hp.available * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.available * 100}%; background: var(--blue);"></div>
            </div>
          </div>

          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Engageable) — Response Velocity</span>
              <span class="p-label-val">${Math.round(hp.engageable * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.engageable * 100}%; background: var(--green);"></div>
            </div>
          </div>

          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Legitimate) — Verification Integrity</span>
              <span class="p-label-val" style="color: ${hp.legitimate < 0.15 ? 'var(--orange)' : 'inherit'};">${Math.round(hp.legitimate * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.legitimate * 100}%; background: ${hp.legitimate < 0.15 ? 'var(--orange)' : 'var(--purple)'};"></div>
            </div>
          </div>

          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Growth) — Adaptive Potential</span>
              <span class="p-label-val">${Math.round(hp.growth * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.growth * 100}%; background: #ec4899;"></div>
            </div>
          </div>

          <div class="p-factor-bar">
            <div class="p-label-row">
              <span class="p-label-name">P(Scrappiness) — Self-Direction</span>
              <span class="p-label-val">${Math.round(hp.scrappiness * 100)}%</span>
            </div>
            <div class="p-progress-bg">
              <div class="p-progress-fill" style="width: ${hp.scrappiness * 100}%; background: #eab308;"></div>
            </div>
          </div>

        </div>
      </div>

      <div class="qv-insights-section reasoning-section">
        <div class="reasoning-toggle" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; padding: 6px 0;" onclick="const det = this.nextElementSibling; det.classList.toggle('hidden'); const icon = this.querySelector('.chevron-icon'); if(det.classList.contains('hidden')){ icon.style.transform='rotate(0deg)'; }else{ icon.style.transform='rotate(180deg)'; }">
          <h4 style="margin:0;">Recruiter Reasoning Analysis</h4>
          <i data-lucide="chevron-down" class="chevron-icon icon-tiny text-muted" style="transition: transform 0.2s;"></i>
        </div>
        <div class="qv-insight-text hidden" style="margin-top: 8px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border-left: 3px solid var(--purple); font-size: 12px; line-height: 1.4; color: var(--text-main);">
          ${cand.reasoning || cand.why_selected}
        </div>
      </div>

      <div class="qv-insights-section">
        <h4>Match Rationale</h4>
        <p class="qv-insight-text">${cand.why_selected}</p>
      </div>

      <div class="qv-insights-section">
        <h4>Mapped Skill Matrix</h4>
        <div class="skills-wrap">${skillsHtml}</div>
      </div>

      <div class="qv-insights-section" style="margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px;">
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <a href="#dna" class="btn btn-secondary btn-small" id="qv-dna-link">View DNA Radar</a>
          <a href="#recommendation" class="btn btn-primary btn-small" id="qv-rec-link">Explain Match Decision</a>
        </div>
      </div>
    `;

    document.getElementById("qv-dna-link").addEventListener("click", () => {
      currentCandidateDnaId = cand.id;
    });

    document.getElementById("qv-rec-link").addEventListener("click", () => {
      currentRecCandidateId = cand.id;
    });

    lucide.createIcons();
  }

  // --- VIEW 4: HIDDEN GEMS DASHBOARD ---
  function loadHiddenGemsView() {
    const container = document.getElementById("gems-grid-container");
    container.innerHTML = "";

    const gems = candidates.filter(c => c.categories.includes("hidden_gem"));

    gems.forEach(gem => {
      const card = document.createElement("div");
      card.className = "gem-card glass-card";
      
      const skillRepl = gem.skills.filter(s => s.matchType === "adjacent").map(s => {
        return `<div class="adj-chain">
                  <span class="skill-tag match">${s.name}</span>
                  <i data-lucide="arrow-right" class="gap-arrow"></i>
                  <span class="skill-tag adjacent">${s.equivalentTo}</span>
                </div>`;
      }).join("");

      card.innerHTML = `
        <div class="gem-card-header">
          <div class="gem-candidate-info">
            <img src="${gem.avatar}" alt="Avatar" class="avatar-small">
            <div>
              <h4 style="font-size: 15px;">${gem.name}</h4>
              <p style="font-size: 11px; color: var(--text-muted);">${gem.title}</p>
            </div>
          </div>
          <div class="gem-scores">
            <span class="gem-score-badge">${gem.overall_score}%</span>
            <span class="gem-score-label" style="display:block;">Match</span>
          </div>
        </div>

        <div class="gem-expl-box">
          <div class="gem-expl-title"><i data-lucide="brain" class="icon-tiny"></i> Cognitive Competency Match</div>
          <p class="gem-expl-text">${gem.why_selected.substring(0, 140)}...</p>
        </div>

        <div class="qv-insights-section">
          <h4 style="font-size: 11px;">Skill Equivalence Translation</h4>
          <div style="display:flex; flex-direction:column; gap: 8px;">
            ${skillRepl}
          </div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; gap: 10px;">
          <a href="#recommendation" class="btn btn-primary btn-small" id="gem-rec-${gem.id}">Deep Explanation</a>
        </div>
      `;
      
      container.appendChild(card);
      
      document.getElementById(`gem-rec-${gem.id}`).addEventListener("click", () => {
        currentRecCandidateId = gem.id;
      });
    });

    lucide.createIcons();
  }

  // --- VIEW 5: TALENT MARKETPLACE ---
  function loadMarketplaceView() {
    const searchInput = document.getElementById("market-search-input");
    const container = document.getElementById("market-cards-container");
    
    // Bind search run trigger
    document.getElementById("market-search-btn").onclick = () => {
      loadMarketplaceView();
    };

    // Filter tags buttons
    document.querySelectorAll(".tag-btn").forEach(btn => {
      btn.onclick = (e) => {
        const tag = btn.getAttribute("data-tag");
        if (marketFilterTag === tag) {
          marketFilterTag = null;
          btn.classList.remove("active");
        } else {
          document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
          marketFilterTag = tag;
          btn.classList.add("active");
        }
        loadMarketplaceView();
      };
    });

    let pool = [...candidates];
    const query = searchInput.value.toLowerCase();

    // Query filters
    if (query !== "") {
      pool = pool.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.title.toLowerCase().includes(query) ||
        c.skills.some(s => s.name.toLowerCase().includes(query))
      );
    }

    // Tag filter mapping
    if (marketFilterTag) {
      if (marketFilterTag === "Fast Learners") pool = pool.filter(c => c.potential_score >= 90);
      if (marketFilterTag === "High Intent") pool = pool.filter(c => c.intent_score >= 90);
      if (marketFilterTag === "Hidden Gems") pool = pool.filter(c => c.categories.includes("hidden_gem"));
      if (marketFilterTag === "Future Leaders") pool = pool.filter(c => c.categories.includes("future_leader"));
    }

    document.getElementById("market-results-count").textContent = `Showing ${pool.length} Candidates`;
    container.innerHTML = "";

    pool.forEach(c => {
      const card = document.createElement("div");
      card.className = "market-card glass-card";
      
      const skillsHtml = c.skills.slice(0, 3).map(s => {
        return `<span class="skill-tag">${s.name}</span>`;
      }).join("");

      card.innerHTML = `
        <div class="market-profile-row">
          <img src="${c.avatar}" alt="Avatar" class="avatar-large">
          <div>
            <h4 style="font-size: 16px;">${c.name}</h4>
            <p style="font-size: 12px; color: var(--text-muted);">${c.title}</p>
          </div>
        </div>

        <div class="market-metrics">
          <div class="market-metric-box">
            <span class="label">Potential</span>
            <span class="val text-purple">${c.potential_score}</span>
          </div>
          <div class="market-metric-box">
            <span class="label">Intent</span>
            <span class="val text-cyan">${c.intent_score}</span>
          </div>
        </div>

        <div>
          <h5 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Skills Preview</h5>
          <div class="skills-wrap">${skillsHtml}</div>
        </div>

        <div style="margin-top: auto; display: flex; gap: 8px;">
          <a href="#recommendation" class="btn btn-secondary btn-small flex-grow" id="market-rec-${c.id}">View Match</a>
          <a href="#dna" class="btn btn-outline btn-small" id="market-dna-${c.id}" title="DNA Graph"><i data-lucide="fingerprint" class="icon-tiny"></i></a>
        </div>
      `;
      container.appendChild(card);

      document.getElementById(`market-rec-${c.id}`).addEventListener("click", () => {
        currentRecCandidateId = c.id;
      });
      document.getElementById(`market-dna-${c.id}`).addEventListener("click", () => {
        currentCandidateDnaId = c.id;
      });
    });

    lucide.createIcons();
  }

  // --- VIEW 6: FUTURE TALENT PIPELINE ---
  function loadPipelineView() {
    const pipelineFrontend = document.getElementById("pipeline-frontend-fullstack");
    const pipelineBackend = document.getElementById("pipeline-backend-architect");
    const pipelineAI = document.getElementById("pipeline-engineer-ai");

    pipelineFrontend.innerHTML = "";
    pipelineBackend.innerHTML = "";
    pipelineAI.innerHTML = "";

    candidates.forEach(c => {
      const card = document.createElement("div");
      card.className = "pipeline-item-card";
      
      card.innerHTML = `
        <div class="pipeline-c-info">
          <img src="${c.avatar}" alt="Avatar" class="avatar-small">
          <div>
            <h4 style="font-size: 14px;">${c.name}</h4>
            <span style="font-size: 10px; color: var(--text-muted);">${c.title}</span>
          </div>
        </div>

        <div class="pipeline-trajectory">
          <div class="trajectory-path">
            <strong>Current:</strong> <span>${c.title}</span>
          </div>
          <div style="text-align: center; margin: 4px 0;"><i data-lucide="arrow-down-right" class="trajectory-arrow icon-tiny"></i></div>
          <div class="trajectory-path">
            <strong>Predict:</strong> <span class="text-purple">${c.predicted_role_2yr}</span>
          </div>
        </div>

        <div class="pipeline-tagline">
          <strong>Rationale:</strong> ${c.prediction_rationale.substring(0, 80)}...
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <span style="font-size: 10px; color: var(--text-muted);">Conf: <strong class="text-purple">${c.prediction_confidence}</strong></span>
          <a href="#recommendation" class="btn btn-secondary btn-small" id="pipe-rec-${c.id}" style="padding: 4px 8px; font-size: 10px;">Explain Arc</a>
        </div>
      `;

      // Distribute candidates to columns based on target prediction profile
      if (c.predicted_role_2yr.includes("UI") || c.predicted_role_2yr.includes("Frontend") || c.predicted_role_2yr.includes("Full Stack")) {
        pipelineFrontend.appendChild(card);
      } else if (c.predicted_role_2yr.includes("Infrastructure") || c.predicted_role_2yr.includes("Backend") || c.predicted_role_2yr.includes("Operations")) {
        pipelineBackend.appendChild(card);
      } else {
        pipelineAI.appendChild(card);
      }

      document.getElementById(`pipe-rec-${c.id}`).addEventListener("click", () => {
        currentRecCandidateId = c.id;
      });
    });

    lucide.createIcons();
  }

  // --- VIEW 7: CANDIDATE DNA VISUALIZATION ---
  function loadCandidateDnaView() {
    const listContainer = document.getElementById("dna-candidates-selection");
    listContainer.innerHTML = "";

    candidates.forEach(c => {
      const item = document.createElement("div");
      item.className = `dna-sel-item ${c.id === currentCandidateDnaId ? "selected" : ""}`;
      item.addEventListener("click", () => {
        currentCandidateDnaId = c.id;
        loadCandidateDnaView();
      });

      item.innerHTML = `
        <img src="${c.avatar}" alt="Avatar" class="avatar-small">
        <div style="display:flex; flex-direction:column; overflow:hidden;">
          <span style="font-size:13px; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${c.name}</span>
          <span style="font-size:10px; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${c.title}</span>
        </div>
      `;
      listContainer.appendChild(item);
    });

    const activeCand = candidates.find(c => c.id === currentCandidateDnaId) || candidates[0];
    if (!activeCand) return;

    // Update profiles details
    document.getElementById("dna-avatar").src = activeCand.avatar;
    document.getElementById("dna-name").textContent = activeCand.name;
    document.getElementById("dna-title").textContent = `${activeCand.title} • ${activeCand.experience} Yrs Exp`;
    document.getElementById("dna-potential-score").textContent = activeCand.potential_score;
    document.getElementById("dna-intent-score").textContent = activeCand.intent_score;

    // Generate Explanations list
    const explContainer = document.getElementById("dna-traits-explanation");
    explContainer.innerHTML = `
      <div class="dna-trait-card">
        <h4>🧠 Learning Agility (${activeCand.potential_score})</h4>
        <p>Measured rate of skill transition, certification logs, and complexity in new repositories.</p>
      </div>
      <div class="dna-trait-card">
        <h4>🎯 High Intent (${activeCand.intent_score})</h4>
        <p>Continuous commitment to technology domains verified by hackathons and open-source updates.</p>
      </div>
      <div class="dna-trait-card">
        <h4>🤝 Collaboration Index (${activeCand.readiness.communication})</h4>
        <p>Predicted alignment with community architectures and cross-functional task matrices.</p>
      </div>
    `;

    // Render Radar Chart
    const canvas = document.getElementById("candidateDnaChart");
    if (dnaChartInstance) {
      dnaChartInstance.destroy();
    }

    dnaChartInstance = new Chart(canvas, {
      type: "radar",
      data: {
        labels: [
          "Technical Strength",
          "Leadership Potential",
          "Learning Agility",
          "Collaboration Score",
          "Innovation Score",
          "Intent Score",
          "Growth Potential"
        ],
        datasets: [{
          label: `${activeCand.name} DNA Index`,
          data: [
            activeCand.skill_match_score,
            activeCand.alignment_score - 5,
            activeCand.potential_score,
            activeCand.readiness.communication,
            activeCand.alignment_score + 2,
            activeCand.intent_score,
            (activeCand.potential_score + activeCand.overall_score) / 2
          ],
          backgroundColor: "rgba(6, 182, 212, 0.2)",
          borderColor: "#06b6d4",
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#06b6d4"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#f3f4f6" }
          }
        },
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.08)" },
            grid: { color: "rgba(255,255,255,0.08)" },
            pointLabels: { color: "#9ca3af", font: { size: 10 } },
            ticks: { display: false },
            suggestedMin: 50,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // --- VIEW 8: AI INSIGHTS ---
  function loadInsightsView() {
    // 1. Match distribution chart
    const distributionCanvas = document.getElementById("matchDistributionChart");
    if (distributionChartInstance) distributionChartInstance.destroy();
    
    distributionChartInstance = new Chart(distributionCanvas, {
      type: "bar",
      data: {
        labels: ["60-70%", "70-80%", "80-90%", "90-100%"],
        datasets: [{
          label: "Number of Candidates",
          data: [142, 532, 680, 128],
          backgroundColor: "rgba(168, 85, 247, 0.4)",
          borderColor: "#a855f7",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } }
        }
      }
    });

    // 2. Success prediction chart
    const successCanvas = document.getElementById("successPredictionChart");
    if (predictionChartInstance) predictionChartInstance.destroy();

    predictionChartInstance = new Chart(successCanvas, {
      type: "line",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Predicted High Potential",
            data: [82, 85, 89, 94],
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.05)",
            tension: 0.3,
            fill: true
          },
          {
            label: "Actual Success Rate",
            data: [79, 84, 88, 91],
            borderColor: "#10b981",
            backgroundColor: "transparent",
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af" } }
        },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } }
        }
      }
    });

    // 3. Render Skill Adjacency Graph Nodes
    const adjGrid = document.getElementById("skill-adjacency-grid");
    adjGrid.innerHTML = "";

    // Simulated node placements
    const nodes = [
      { id: "n1", name: "AWS Cloud", class: "core", x: 45, y: 45 },
      { id: "n2", name: "GCP Services", class: "match", x: 15, y: 25 },
      { id: "n3", name: "Azure Cloud", class: "adjacent", x: 75, y: 20 },
      { id: "n4", name: "React Framework", class: "core", x: 50, y: 75 },
      { id: "n5", name: "Vue.js Layouts", class: "match", x: 20, y: 80 },
      { id: "n6", name: "Svelte Component", class: "adjacent", x: 80, y: 70 }
    ];

    nodes.forEach(n => {
      const nodeEl = document.createElement("div");
      nodeEl.className = `adj-node ${n.class}`;
      nodeEl.style.left = `${n.x}%`;
      nodeEl.style.top = `${n.y}%`;
      
      let icon = "cloud";
      if (n.name.includes("React") || n.name.includes("Vue") || n.name.includes("Svelte")) icon = "layout";
      
      nodeEl.innerHTML = `<i data-lucide="${icon}" class="icon-tiny"></i> ${n.name}`;
      adjGrid.appendChild(nodeEl);
    });

    // Render connection lines SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "adj-svg-connections");
    
    // Add connection lines from Core to match/adjacents
    const lines = [
      { from: nodes[0], to: nodes[1], color: "rgba(6, 182, 212, 0.4)" },
      { from: nodes[0], to: nodes[2], color: "rgba(6, 182, 212, 0.3)" },
      { from: nodes[3], to: nodes[4], color: "rgba(168, 85, 247, 0.4)" },
      { from: nodes[3], to: nodes[5], color: "rgba(168, 85, 247, 0.3)" }
    ];

    setTimeout(() => {
      lines.forEach(l => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const fromEl = adjGrid.querySelector(`.adj-node:contains(${l.from.name})`) || adjGrid.children[nodes.indexOf(l.from)];
        const toEl = adjGrid.querySelector(`.adj-node:contains(${l.to.name})`) || adjGrid.children[nodes.indexOf(l.to)];
        
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const gridRect = adjGrid.getBoundingClientRect();

          const x1 = fromRect.left - gridRect.left + fromRect.width / 2;
          const y1 = fromRect.top - gridRect.top + fromRect.height / 2;
          const x2 = toRect.left - gridRect.left + toRect.width / 2;
          const y2 = toRect.top - gridRect.top + toRect.height / 2;

          line.setAttribute("x1", x1);
          line.setAttribute("y1", y1);
          line.setAttribute("x2", x2);
          line.setAttribute("y2", y2);
          line.setAttribute("stroke", l.color);
          line.setAttribute("stroke-width", "1.5");
          line.setAttribute("stroke-dasharray", "4 4");
          svg.appendChild(line);
        }
      });
      adjGrid.appendChild(svg);
    }, 100);

    lucide.createIcons();
  }

  // --- VIEW 9: NOTIFICATIONS CENTER ---
  function loadNotificationsView() {
    const container = document.getElementById("notifications-list-container");
    container.innerHTML = "";

    document.getElementById("mark-all-read").onclick = () => {
      initialNotifications.forEach(n => n.unread = false);
      updateNotifBadge();
      loadNotificationsView();
    };

    initialNotifications.forEach(n => {
      const item = document.createElement("div");
      item.className = `notification-item ${n.unread ? 'unread' : ''}`;
      
      let icon = "bell";
      let bg = "bg-blue-tint text-blue";
      if (n.type === "rematch") { icon = "refresh-cw"; bg = "bg-green-tint text-green"; }
      if (n.type === "growth") { icon = "trending-up"; bg = "bg-purple-tint text-purple"; }
      if (n.type === "jd") { icon = "file-text"; bg = "bg-cyan-tint text-cyan"; }

      item.innerHTML = `
        <div class="notif-icon-circle ${bg}">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="notif-content">
          <div class="notif-title-row">
            <span class="notif-title">${n.title}</span>
            <span class="notif-time">${n.time}</span>
          </div>
          <p class="notif-body">${n.body}</p>
          <div class="notif-action-row">
            <a href="${n.actionLink}" class="btn btn-secondary btn-small" id="notif-act-${n.id}">View details</a>
          </div>
        </div>
      `;
      container.appendChild(item);

      document.getElementById(`notif-act-${n.id}`).onclick = () => {
        n.unread = false;
        updateNotifBadge();
      };
    });

    lucide.createIcons();
  }

  // --- VIEW 10: EXPLAINABLE AI MATRIX ---
  function loadExplainableAiView() {
    const cand = candidates.find(c => c.id === currentRecCandidateId) || candidates[0];
    if (!cand) return;

    // Headings
    document.getElementById("rec-avatar").src = cand.avatar;
    document.getElementById("rec-name").textContent = cand.name;
    document.getElementById("rec-role-sub").textContent = `Ecosystem Match Matrix for: ${cand.title}`;
    
    // Overall match score circle
    document.getElementById("rec-score-value").textContent = cand.overall_score;
    const circle = document.getElementById("rec-score-ring");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (cand.overall_score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Gem check
    const isGem = cand.categories.includes("hidden_gem");
    const gemBadge = document.getElementById("rec-gem-badge");
    if (cand.honeypot_risk) {
      gemBadge.className = "badge animate-pulse";
      gemBadge.style.background = "var(--orange)";
      gemBadge.innerHTML = `<i data-lucide="alert-triangle" class="icon-tiny"></i> HONEYPOT PROFILE FLAG`;
    } else if (isGem) {
      gemBadge.className = "badge badge-purple animate-pulse";
      gemBadge.style.background = "";
      gemBadge.innerHTML = `<i data-lucide="gem" class="icon-tiny"></i> HIDDEN GEM MATCH`;
    } else {
      gemBadge.className = "badge badge-cyan";
      gemBadge.style.background = "";
      gemBadge.innerHTML = `<i data-lucide="user" class="icon-tiny"></i> REGULAR MATCH`;
    }

    // Why selected body
    document.getElementById("rec-why-selected").textContent = cand.why_selected;

    // Strengths list
    const strengthsUl = document.getElementById("rec-strengths-list");
    strengthsUl.innerHTML = cand.strengths.map(s => `<li>${s}</li>`).join("");

    // Risks list
    const risksUl = document.getElementById("rec-risks-list");
    risksUl.innerHTML = cand.risks.map(r => `<li>${r}</li>`).join("");

    // Skill Gap & Adjacency Translation
    const gapAnalysisDiv = document.getElementById("rec-gap-analysis");
    gapAnalysisDiv.innerHTML = "";
    
    cand.skills.forEach(s => {
      if (s.matchType === "adjacent") {
        gapAnalysisDiv.innerHTML += `
          <div class="gap-item">
            <div class="gap-skill-names">
              <strong>${s.name} (Possessed skill)</strong>
              <span class="text-purple">Adjacency Level: 92%</span>
            </div>
            <div class="adjacent-chain">
              <span class="skill-tag match">${s.name} (${s.level})</span>
              <i data-lucide="arrow-right-left" class="gap-arrow icon-tiny"></i>
              <span class="skill-tag adjacent">${s.equivalentTo} (Required skill)</span>
            </div>
          </div>
        `;
      }
      if (s.matchType === "gap") {
        gapAnalysisDiv.innerHTML += `
          <div class="gap-item">
            <div class="gap-skill-names">
              <strong>${s.name} (Critical Skill Gap)</strong>
              <span class="text-orange">Required ramp-up: High</span>
            </div>
            <div class="adjacent-chain">
              <span class="skill-tag" style="background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.25); color: var(--orange);">Missing: ${s.name}</span>
            </div>
          </div>
        `;
      }
    });

    if (gapAnalysisDiv.innerHTML === "") {
      gapAnalysisDiv.innerHTML = `<div style="color: var(--text-muted); font-size:12px;">Candidate fully satisfies all technical framework layers. No skill gaps identified.</div>`;
    }

    const hp = cand.hire_probability || {
      qualified: (cand.candidate_dna?.technical_fit || cand.skill_match_score || 80) / 100,
      available: (cand.candidate_dna?.experience_fit || cand.experience_score || 80) / 100,
      engageable: (cand.candidate_dna?.career_trajectory || cand.potential_score || 85) / 100,
      legitimate: cand.honeypot_risk ? 0.10 : (cand.candidate_dna?.behavioral_intent || cand.alignment_score || 90) / 100,
      growth: (cand.candidate_dna?.credibility || 80) / 100,
      scrappiness: (cand.candidate_dna?.hidden_gem_score || (cand.categories.includes("hidden_gem") ? 90 : 60)) / 100,
      hire_score: cand.overall_score
    };

    const calculatedScore = Math.round(hp.qualified * hp.available * hp.engageable * hp.legitimate * hp.growth * hp.scrappiness * 100);
    const finalScore = hp.hire_score || calculatedScore;

    // Subscores progress bars replaced with Multiplicative Formula Display and deep-dive cards
    const subscoresDiv = document.getElementById("rec-subscores");
    subscoresDiv.innerHTML = `
      <div class="prob-formula-display">
        <div class="formula-title">Hire Probability Formula Execution</div>
        <div class="formula-chain">
          <span class="f-factor" title="P(Qualified)">P(Q): ${Math.round(hp.qualified*100)}%</span>
          <span class="f-operator">×</span>
          <span class="f-factor" title="P(Available)">P(A): ${Math.round(hp.available*100)}%</span>
          <span class="f-operator">×</span>
          <span class="f-factor" title="P(Engageable)">P(E): ${Math.round(hp.engageable*100)}%</span>
          <span class="f-operator">×</span>
          <span class="f-factor" title="P(Legitimate)" style="color: ${hp.legitimate < 0.15 ? 'var(--orange)' : 'var(--cyan)'};">P(L): ${Math.round(hp.legitimate*100)}%</span>
          <span class="f-operator">×</span>
          <span class="f-factor" title="P(Growth)">P(G): ${Math.round(hp.growth*100)}%</span>
          <span class="f-operator">×</span>
          <span class="f-factor" title="P(Scrappiness)">P(S): ${Math.round(hp.scrappiness*100)}%</span>
          <span class="f-operator">=</span>
          <span class="f-result" title="Final Score">${finalScore}%</span>
        </div>
      </div>

      <div class="p-factor-grid">
        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Qualified)</span>
            <span class="factor-value">${Math.round(hp.qualified*100)}%</span>
          </div>
          <p class="factor-desc">Matches requirements of job description against candidate experience level and core competence tags.</p>
        </div>

        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Available)</span>
            <span class="factor-value">${Math.round(hp.available*100)}%</span>
          </div>
          <p class="factor-desc">Tenure stability model and active search status signals from market data indicators.</p>
        </div>

        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Engageable)</span>
            <span class="factor-value">${Math.round(hp.engageable*100)}%</span>
          </div>
          <p class="factor-desc">Likelihood of recruiter engagement based on response history and profile interaction telemetry.</p>
        </div>

        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Legitimate)</span>
            <span class="factor-value" style="color: ${hp.legitimate < 0.15 ? 'var(--orange)' : 'var(--cyan)'};">${Math.round(hp.legitimate*100)}%</span>
          </div>
          <p class="factor-desc">${hp.legitimate < 0.15 ? 'CRITICAL: Suspicious anomalies detected in timeline / keywords.' : 'Authenticity verification and verification challenge results.'}</p>
        </div>

        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Growth)</span>
            <span class="factor-value">${Math.round(hp.growth*100)}%</span>
          </div>
          <p class="factor-desc">Adaptive capacity, promotion velocity, and YoY skills expansion track record.</p>
        </div>

        <div class="p-factor-card">
          <div class="factor-header">
            <span class="factor-name">P(Scrappiness)</span>
            <span class="factor-value">${Math.round(hp.scrappiness*100)}%</span>
          </div>
          <p class="factor-desc">Self-starting traits, open source work, hackathon participation, and side projects.</p>
        </div>
      </div>
    `;

    // 2-Year predictions
    document.getElementById("rec-predicted-role").textContent = cand.predicted_role_2yr;
    document.getElementById("rec-prediction-confidence").textContent = cand.prediction_confidence;
    document.getElementById("rec-prediction-rationale").textContent = cand.prediction_rationale;

    // Interview readiness predictors
    const readinessDiv = document.getElementById("rec-readiness-metrics");
    readinessDiv.innerHTML = `
      <div class="subscore-item">
        <div class="subscore-label-row"><span>Technical Readiness</span><strong>${cand.readiness.technical}%</strong></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.readiness.technical}%; background: var(--blue);"></div></div>
      </div>
      <div class="subscore-item">
        <div class="subscore-label-row"><span>Communication Capability</span><strong>${cand.readiness.communication}%</strong></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.readiness.communication}%; background: var(--cyan);"></div></div>
      </div>
      <div class="subscore-item">
        <div class="subscore-label-row"><span>Domain Comprehension</span><strong>${cand.readiness.domain}%</strong></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.readiness.domain}%; background: var(--orange);"></div></div>
      </div>
    `;

    // Bind action buttons
    document.getElementById("rec-schedule-btn").onclick = () => {
      alert(`Interview successfully requested for ${cand.name}! Email invitation dispatched.`);
    };

    document.getElementById("rec-pipeline-btn").onclick = () => {
      alert(`${cand.name} pinned to long-term succession planning pipeline!`);
    };

    lucide.createIcons();
  }

  // --- V2 INTERACTIVE ECOSYSTEM FEATURES ---

  function loadCandidateDashboardView() {
    const cand = candidates.find(c => c.id === activeCandidateId) || candidates[0];
    if (!cand) return;

    // Opportunities
    const oppList = document.getElementById("candidate-opp-list");
    if (oppList) {
      oppList.innerHTML = "";
      cand.active_opportunities.forEach(opp => {
        const item = document.createElement("div");
        item.className = "opp-item-card";
        
        let statusClass = "review";
        if (opp.status === "Pre-Screened" || opp.status === "Interview Scheduled") statusClass = "interview";
        if (opp.status === "Stored in Talent Pool" || opp.status === "Nurturing Pipeline") statusClass = "nurture";
        
        item.innerHTML = `
          <div class="opp-meta">
            <h4>${opp.role}</h4>
            <span>Match Probability: <strong class="text-cyan">${opp.match}%</strong></span>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="opp-badge ${statusClass}">${opp.status}</span>
            <button class="btn btn-secondary btn-small" id="cand-opp-view-btn-${opp.job_id}">View DNA Match</button>
          </div>
        `;
        oppList.appendChild(item);

        document.getElementById(`cand-opp-view-btn-${opp.job_id}`).onclick = () => {
          currentRecCandidateId = cand.id;
          window.location.hash = "#recommendation";
        };
      });
    }

    // Timeline Learning Roadmap (Second Chance AI)
    const timeline = document.getElementById("candidate-roadmap-timeline");
    if (timeline) {
      timeline.innerHTML = "";
      cand.learning_roadmap.timeline.forEach((step, idx) => {
        const stepDiv = document.createElement("div");
        stepDiv.className = `timeline-roadmap-step ${step.completed ? "completed" : ""}`;
        stepDiv.id = `roadmap-step-${idx}`;
        
        // Let them click the step to simulate completing it!
        stepDiv.style.cursor = step.completed ? "default" : "pointer";
        
        stepDiv.innerHTML = `
          <div class="timeline-node-dot"></div>
          <div class="timeline-step-content">
            <h5>${step.goal}</h5>
            <span>Target timeframe: ${step.term}</span>
          </div>
          <div>
            ${step.completed 
              ? `<i data-lucide="check" class="text-green" style="width:16px; height:16px;"></i>` 
              : `<i data-lucide="circle" class="text-muted" style="width:16px; height:16px;"></i>`
            }
          </div>
        `;
        timeline.appendChild(stepDiv);

        if (!step.completed) {
          stepDiv.title = "Click to mark as completed and update your DNA!";
          stepDiv.onclick = () => {
            step.completed = true;
            // Update scores!
            cand.potential_score = Math.min(100, cand.potential_score + 2);
            cand.overall_score = Math.min(100, cand.overall_score + 1);
            cand.skill_match_score = Math.min(100, cand.skill_match_score + 2);
            
            // Show alert
            alert(`Congratulations! You completed: "${step.goal}". Your Skill DNA and Match scores have been updated in real-time.`);
            loadCandidateDashboardView();
            loadDashboardView(); // sync recruiter widget
          };
        }
      });
    }

    // Authenticity challenge box rendering
    renderQuizWidget(cand);

    // Prediction card details
    const roleBadge = document.getElementById("cand-predicted-role-val");
    if (roleBadge) roleBadge.textContent = cand.predicted_role_2yr;
    
    const confVal = document.getElementById("cand-predicted-conf-val");
    if (confVal) confVal.textContent = cand.prediction_confidence;

    const ratVal = document.getElementById("cand-prediction-rationale-val");
    if (ratVal) ratVal.textContent = cand.prediction_rationale;

    lucide.createIcons();
  }

  function renderQuizWidget(cand) {
    const quizBody = document.getElementById("quiz-widget-body");
    if (!quizBody) return;

    if (cand.authenticity_status === "verified") {
      quizBody.innerHTML = `
        <div style="text-align:center; padding:12px; display:flex; flex-direction:column; align-items:center; gap:8px;">
          <i data-lucide="shield-check" class="text-green" style="width:48px; height:48px;"></i>
          <h4 style="margin:0; color:var(--green);">Claim Authenticity Verified</h4>
          <p style="font-size:12px; color:var(--text-muted); line-height:1.4;">
            Your skill assertions in <strong>${cand.authenticity_challenge.topic}</strong> have been validated through our dynamic challenger.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; margin-top:8px;">
            <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
              <span style="font-size:9px; color:var(--text-muted); text-transform:uppercase; display:block;">Authenticity Score</span>
              <strong style="font-size:16px; color:var(--cyan);">${cand.authenticity_score}%</strong>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
              <span style="font-size:9px; color:var(--text-muted); text-transform:uppercase; display:block;">Knowledge Confidence</span>
              <strong style="font-size:16px; color:var(--purple);">${cand.knowledge_confidence_score}%</strong>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Otherwise, we load the quiz status
    if (cand.authenticity_challenge.questions_answered === 0) {
      quizBody.innerHTML = `
        <div style="text-align:center; padding:8px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:center;"><i data-lucide="award" class="text-purple" style="width:36px; height:36px;"></i></div>
          <h4 style="margin:0; font-size:14px;">Dynamic Verification Challenge</h4>
          <p style="font-size:11px; color:var(--text-muted); line-height:1.4; margin:0;">
            Based on your resume, our AI generated a challenge on <strong>${cand.authenticity_challenge.topic}</strong>. Answer these 3 adaptive questions.
          </p>
          <button class="btn btn-primary btn-small" id="start-auth-quiz-btn" style="margin-top:5px; width:100%;">Start Challenge</button>
        </div>
      `;

      document.getElementById("start-auth-quiz-btn").onclick = () => {
        cand.authenticity_challenge.questions_answered = 1;
        quizQuestionIdx = 0;
        quizCorrectAnswers = 0;
        renderQuizWidget(cand);
      };
    } else {
      // Quiz in progress
      const questions = authenticityQuestionDb[cand.authenticity_challenge.topic];
      const q = questions[quizQuestionIdx];

      let optionsHtml = "";
      q.options.forEach((opt, oIdx) => {
        optionsHtml += `<button class="quiz-option-btn" data-idx="${oIdx}">${opt}</button>`;
      });

      quizBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
            <span>Topic: ${cand.authenticity_challenge.topic}</span>
            <span>Question ${quizQuestionIdx + 1} of 3</span>
          </div>
          <div class="quiz-question-header">${q.question}</div>
          <div class="quiz-options-list">${optionsHtml}</div>
          <div class="quiz-feedback-box hidden" id="quiz-feedback"></div>
          <button class="btn btn-secondary btn-small hidden" id="quiz-next-btn" style="width:100%;">Next Question</button>
        </div>
      `;

      // Option button clicks
      const optBtns = quizBody.querySelectorAll(".quiz-option-btn");
      const feedbackBox = quizBody.querySelector("#quiz-feedback");
      const nextBtn = quizBody.querySelector("#quiz-next-btn");

      optBtns.forEach(btn => {
        btn.onclick = () => {
          // disable all
          optBtns.forEach(b => b.disabled = true);
          
          const chosen = parseInt(btn.getAttribute("data-idx"));
          if (chosen === q.correct) {
            btn.classList.add("correct-choice");
            quizCorrectAnswers++;
            feedbackBox.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
            feedbackBox.style.borderColor = "var(--green)";
            feedbackBox.style.color = "var(--green)";
          } else {
            btn.classList.add("wrong-choice");
            optBtns[q.correct].classList.add("correct-choice");
            feedbackBox.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
            feedbackBox.style.borderColor = "#ef4444";
            feedbackBox.style.color = "#ef4444";
          }
          feedbackBox.classList.remove("hidden");
          nextBtn.classList.remove("hidden");
        };
      });

      nextBtn.onclick = () => {
        quizQuestionIdx++;
        if (quizQuestionIdx < 3) {
          renderQuizWidget(cand);
        } else {
          // Finished!
          cand.authenticity_status = "verified";
          cand.authenticity_score = Math.round((quizCorrectAnswers / 3) * 100);
          cand.knowledge_confidence_score = Math.round((quizCorrectAnswers / 3) * 100) - Math.floor(Math.random() * 8);
          // Clamp score minimum
          if (cand.knowledge_confidence_score < 50) cand.knowledge_confidence_score = 62;
          
          // Boost matching score in ecosystem!
          cand.overall_score = Math.min(100, cand.overall_score + 4);
          cand.skill_match_score = Math.min(100, cand.skill_match_score + 5);
          
          alert(`Verification challenge complete! Authenticity verified at ${cand.authenticity_score}%. Match Score updated in real-time.`);
          loadCandidateDashboardView();
          loadDashboardView(); // sync recruiter widget
        }
      };
    }
    lucide.createIcons();
  }

  function initEcosystemV2Features() {
    // 3D Parallax Rotation
    const heroBox = document.getElementById("landing-view");
    const heroCard = document.getElementById("hero-3d-card");
    if (heroBox && heroCard) {
      heroBox.addEventListener("mousemove", (e) => {
        const boxRect = heroBox.getBoundingClientRect();
        const x = e.clientX - boxRect.left - boxRect.width / 2;
        const y = e.clientY - boxRect.top - boxRect.height / 2;
        
        const rotY = (x / (boxRect.width / 2)) * 20; // max 20deg
        const rotX = -(y / (boxRect.height / 2)) * 20;
        
        heroCard.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      });

      heroBox.addEventListener("mouseleave", () => {
        heroCard.style.transform = "rotateY(15deg) rotateX(10deg)"; // reset
      });
    }

    // Portal SWITCHER Click logic
    const recSwitch = document.getElementById("portal-switch-recruiter");
    const candSwitch = document.getElementById("portal-switch-candidate");
    
    const recGroup = document.getElementById("nav-recruiter-group");
    const candGroup = document.getElementById("nav-candidate-group");

    if (recSwitch && candSwitch) {
      recSwitch.addEventListener("click", () => {
        currentPortalMode = "recruiter";
        recSwitch.classList.add("active");
        candSwitch.classList.remove("active");
        
        recGroup.classList.remove("hidden");
        candGroup.classList.add("hidden");
        
        window.location.hash = "#dashboard";
      });

      candSwitch.addEventListener("click", () => {
        currentPortalMode = "candidate";
        candSwitch.classList.add("active");
        recSwitch.classList.remove("active");
        
        candGroup.classList.remove("hidden");
        recGroup.classList.add("hidden");
        
        window.location.hash = "#candidate-dashboard";
      });
    }

    // Landing Page CTAs mapping
    const recCta = document.getElementById("landing-recruiter-cta");
    const candCta = document.getElementById("landing-candidate-cta");

    if (recCta && candCta) {
      recCta.onclick = (e) => {
        e.preventDefault();
        currentPortalMode = "recruiter";
        if (recSwitch) {
          recSwitch.click();
        } else {
          window.location.hash = "#dashboard";
        }
      };

      candCta.onclick = (e) => {
        e.preventDefault();
        currentPortalMode = "candidate";
        if (candSwitch) {
          candSwitch.click();
        } else {
          window.location.hash = "#candidate-dashboard";
        }
      };
    }

    // Live Product Demo Simulator
    const demoBtn = document.getElementById("demo-trigger-btn");
    const demoEmpty = document.getElementById("demo-empty-result");
    const demoActual = document.getElementById("demo-actual-result");
    const scanLine = document.getElementById("demo-scan-line");
    
    const demoStep1 = document.getElementById("demo-step-1");
    const demoStep2 = document.getElementById("demo-step-2");
    const demoStep3 = document.getElementById("demo-step-3");

    if (demoBtn) {
      demoBtn.onclick = () => {
        demoBtn.disabled = true;
        demoBtn.textContent = "AI Sourcing Engine Running...";
        demoEmpty.classList.remove("hidden");
        demoActual.classList.add("hidden");
        scanLine.style.display = "block";

        // Step animations
        demoStep1.className = "pipeline-step-item active";
        demoStep1.querySelector("i").setAttribute("data-lucide", "loader");
        demoStep2.className = "pipeline-step-item";
        demoStep2.querySelector("i").setAttribute("data-lucide", "circle");
        demoStep3.className = "pipeline-step-item";
        demoStep3.querySelector("i").setAttribute("data-lucide", "circle");
        lucide.createIcons();

        setTimeout(() => {
          demoStep1.className = "pipeline-step-item completed";
          demoStep1.querySelector("i").setAttribute("data-lucide", "check-circle");
          demoStep2.className = "pipeline-step-item active";
          demoStep2.querySelector("i").setAttribute("data-lucide", "loader");
          lucide.createIcons();
          
          setTimeout(() => {
            demoStep2.className = "pipeline-step-item completed";
            demoStep2.querySelector("i").setAttribute("data-lucide", "check-circle");
            demoStep3.className = "pipeline-step-item active";
            demoStep3.querySelector("i").setAttribute("data-lucide", "loader");
            lucide.createIcons();

            setTimeout(() => {
              demoStep3.className = "pipeline-step-item completed";
              demoStep3.querySelector("i").setAttribute("data-lucide", "check-circle");
              lucide.createIcons();
              
              // End scan
              scanLine.style.display = "none";
              demoEmpty.classList.add("hidden");
              demoActual.classList.remove("hidden");
              demoBtn.disabled = false;
              demoBtn.textContent = "Run AI Intelligence Scan";
            }, 1000);
          }, 1200);
        }, 1000);
      };
    }

    // AI Chat drawer toggles
    const chatToggle = document.getElementById("chat-drawer-toggle");
    const chatDrawer = document.getElementById("ai-chat-drawer");
    const chatChevron = document.getElementById("chat-chevron");

    if (chatToggle && chatDrawer) {
      chatToggle.onclick = () => {
        chatDrawer.classList.toggle("chat-collapsed");
        const isCollapsed = chatDrawer.classList.contains("chat-collapsed");
        chatChevron.setAttribute("data-lucide", isCollapsed ? "chevron-up" : "chevron-down");
        lucide.createIcons();
        if (!isCollapsed) {
          renderChatChips();
        }
      };
    }

    // Send chat message
    const sendBtn = document.getElementById("chat-send-btn");
    const chatInput = document.getElementById("chat-user-input");
    if (sendBtn && chatInput) {
      sendBtn.onclick = () => {
        submitChatMessage(chatInput.value);
      };
      chatInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          submitChatMessage(chatInput.value);
        }
      };
    }
  }

  function renderChatChips() {
    const chipsContainer = document.getElementById("chat-chips-container");
    if (!chipsContainer) return;
    
    chipsContainer.innerHTML = "";
    let chips = [];
    if (currentPortalMode === "recruiter") {
      chips = ["Show Backend gems", "Highest growth potential?", "Likely to become Tech Leads?"];
    } else {
      chips = ["What skills am I missing?", "How to improve my score?", "View matching jobs"];
    }

    chips.forEach(text => {
      const chip = document.createElement("button");
      chip.className = "chat-chip";
      chip.textContent = text;
      chip.onclick = () => {
        submitChatMessage(text);
      };
      chipsContainer.appendChild(chip);
    });
  }

  function submitChatMessage(msgText) {
    if (!msgText.trim()) return;
    const msgWrap = document.getElementById("chat-messages-container");
    const input = document.getElementById("chat-user-input");
    if (!msgWrap) return;

    // Clear input
    if (input) input.value = "";

    // Append user message
    const userMsg = document.createElement("div");
    userMsg.className = "chat-msg user";
    userMsg.textContent = msgText;
    msgWrap.appendChild(userMsg);
    msgWrap.scrollTop = msgWrap.scrollHeight;

    // Simulate typing and reply
    setTimeout(() => {
      let replyText = "";
      const text = msgText.toLowerCase();

      if (text.includes("backend gems")) {
        replyText = "I identified Helena Rostova (Vue.js/GCP → React/AWS, Match: 93%) and Marcus Vance (Docker/Python → Kubernetes/Go, Match: 89%) as top backend and frontend hidden gems in the ecosystem.";
      } else if (text.includes("growth potential") || text.includes("potential")) {
        replyText = "Helena Rostova holds the highest True Potential index of 96, showing rapid progression to Principal Architect roles within 24 months.";
      } else if (text.includes("tech leads") || text.includes("leaders")) {
        replyText = "Liam O'Connor (VP of Cloud Ops prediction) and Kenji Tanaka (Director of AI Research prediction) are flagged as high-potential tech leads.";
      } else if (text.includes("skills am i missing") || text.includes("missing")) {
        replyText = "You have gaps in AWS Cloud Infrastructure and GraphQL Federation. Check your customized Learning Hub roadmap to begin training.";
      } else if (text.includes("improve my score") || text.includes("improve")) {
        replyText = "You can improve your overall Match score by verifying your skills in the Resume Authenticity Challenge (+15%) or completing the AWS/GraphQL certs in your Learning Hub (+12%).";
      } else if (text.includes("matching jobs") || text.includes("jobs")) {
        replyText = "You currently correlate to Senior Frontend Architect (93% match) and Full Stack Engineer (86% match).";
      } else {
        replyText = "I've analyzed the Talent DNA profiles, mapped skill adjacencies, and scored verification rates. Let me know if you would like me to summarize any candidate or job match.";
      }

      const botMsg = document.createElement("div");
      botMsg.className = "chat-msg bot";
      botMsg.textContent = replyText;
      msgWrap.appendChild(botMsg);
      msgWrap.scrollTop = msgWrap.scrollHeight;
    }, 800);
  }

  // Initialize V2 Ecosystem Features once
  initEcosystemV2Features();

  lucide.createIcons();
});
