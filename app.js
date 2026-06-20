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
    recommendation: "recommendation-view"
  };

  function handleRouting() {
    let hash = window.location.hash.substring(1);
    if (!hash || hash === "" || hash === "landing") {
      hash = "landing";
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
        dna: "Candidate DNA Profiler",
        insights: "AI System Insights",
        notifications: "Notifications Center",
        recommendation: "Explainable AI Match Matrix"
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
    if (hash === "dna") loadCandidateDnaView();
    if (hash === "insights") loadInsightsView();
    if (hash === "notifications") loadNotificationsView();
    if (hash === "recommendation") loadExplainableAiView();

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
    window.location.hash = "#landing";
  });

  // --- VIEW 2: RECRUITER DASHBOARD ---
  function loadDashboardView() {
    const pipelineList = document.getElementById("jobs-pipeline-list");
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

    const rematchesList = document.getElementById("recent-rematches-list");
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
          <span class="score-lbl">Match</span>
          <span class="score-val text-cyan">${c.overall_score}%</span>
        </div>
        <div class="score-col">
          <span class="score-lbl">Potential</span>
          <span class="score-val text-purple">${c.potential_score}</span>
        </div>
        <div class="score-col">
          <span class="score-lbl">Intent</span>
          <span class="score-val text-green">${c.intent_score}</span>
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

    const categoryBadges = cand.categories.map(cat => {
      const name = cat.replace("_", " ").toUpperCase();
      const color = cat === "hidden_gem" ? "badge-purple" : "badge-cyan";
      return `<span class="badge ${color}">${name}</span>`;
    }).join(" ");

    const skillsHtml = cand.skills.map(s => {
      const typeClass = s.matchType === "exact" ? "match" : s.matchType === "adjacent" ? "adjacent" : "";
      return `<span class="skill-tag ${typeClass}">${s.name} (${s.level})</span>`;
    }).join("");

    qvPanel.innerHTML = `
      <div class="qv-header">
        <div class="qv-profile-block">
          <img src="${cand.avatar}" alt="Avatar" class="avatar-large">
          <div class="qv-profile-meta">
            <h3>${cand.name}</h3>
            <p>${cand.title} • ${cand.experience} yrs exp</p>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">${categoryBadges}</div>
      </div>

      <div class="qv-scores-grid">
        <div class="qv-score-box">
          <span class="num text-cyan">${cand.overall_score}%</span>
          <span class="label">Overall Score</span>
        </div>
        <div class="qv-score-box">
          <span class="num text-purple">${cand.potential_score}</span>
          <span class="label">Potential Score</span>
        </div>
        <div class="qv-score-box">
          <span class="num text-green">${cand.intent_score}</span>
          <span class="label">Intent Score</span>
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
    if (isGem) {
      gemBadge.className = "badge badge-purple animate-pulse";
      gemBadge.innerHTML = `<i data-lucide="gem" class="icon-tiny"></i> HIDDEN GEM MATCH`;
    } else {
      gemBadge.className = "badge badge-cyan";
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

    // Subscores progress bars
    const subscoresDiv = document.getElementById("rec-subscores");
    subscoresDiv.innerHTML = `
      <div class="subscore-item">
        <div class="subscore-label-row">
          <span>Skill Match (40%)</span>
          <strong>${cand.skill_match_score}%</strong>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.skill_match_score}%; background: var(--cyan);"></div></div>
      </div>
      <div class="subscore-item">
        <div class="subscore-label-row">
          <span>True Potential (15%)</span>
          <strong>${cand.potential_score}%</strong>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.potential_score}%; background: var(--purple);"></div></div>
      </div>
      <div class="subscore-item">
        <div class="subscore-label-row">
          <span>Intent Analysis (10%)</span>
          <strong>${cand.intent_score}%</strong>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${cand.intent_score}%; background: var(--green);"></div></div>
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

});
