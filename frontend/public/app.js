// HireMind AI — Main Application Engine (Professional SaaS v3.0)

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ------------------------------------------------------------
  // GLOBALS & STATE
  // ------------------------------------------------------------
  let currentPortalMode = "recruiter"; // recruiter | candidate
  let activeCandidateId = "cand-1"; // Currently evaluated candidate in Evidence Profile
  let activeDiscoverJobId = "job-1"; // Sourcing view filter
  let discoverFilterThreshold = "all"; // all | high | potential
  let currentJudgeStep = 1;
  let activeSettingsTab = "general";
  let activeGrowTab = "high-potential";
  let searchQuery = "";

  // Quiz state for Candidate Hub
  let quizQuestionIdx = 0;
  let quizCorrectCount = 0;
  let quizActiveSkill = "React";

  // Chart instances to prevent canvas recycling bugs
  let chartFunnelInstance = null;
  let chartTimeInstance = null;
  let chartSourcesInstance = null;
  let chartAccuracyInstance = null;

  // Pre-seed candidate Kanban stages in memory since we don't have a backend
  let candidateStages = {
    "cand-1": "screening", // Helena
    "cand-2": "applied",   // Marcus
    "cand-3": "interview", // Kenji
    "cand-4": "assessment",// Aisha
    "cand-5": "offer",     // Liam
    "cand-6": "hired"      // Elena
  };

  // ------------------------------------------------------------
  // TOAST NOTIFICATIONS UTILITY
  // ------------------------------------------------------------
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconName = "check-circle";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "x-circle";
    
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ------------------------------------------------------------
  // ROUTER (Hash-Based)
  // ------------------------------------------------------------
  const routeMap = {
    "dashboard": "dashboard-view",
    "discover": "discover-view",
    "evaluate": "evaluate-view",
    "pipeline": "pipeline-view",
    "grow": "grow-view",
    "analytics": "analytics-view",
    "candidate-dashboard": "candidate-dashboard-view",
    "notifications": "notifications-view",
    "settings": "settings-view"
  };

  function handleRouting() {
    let hash = window.location.hash.substring(1);
    
    // Smooth scrolling for landing sections
    const landingSections = ["problems", "solution", "features", "pricing", "faq"];
    if (landingSections.includes(hash)) {
      const landing = document.getElementById("landing-page");
      const appL = document.getElementById("app-layout");
      if (landing) landing.classList.remove("hidden");
      if (appL) appL.classList.add("layout-hidden");
      
      const sec = document.getElementById(hash);
      if (sec) {
        sec.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (!hash || hash === "" || hash === "landing") {
      // Show Landing Page
      const landing = document.getElementById("landing-page");
      const appL = document.getElementById("app-layout");
      if (landing) landing.classList.remove("hidden");
      if (appL) appL.classList.add("layout-hidden");
      return;
    }

    // Portal Redirect Protection
    if (currentPortalMode === "recruiter" && hash === "candidate-dashboard") {
      window.location.hash = "#dashboard";
      return;
    }
    if (currentPortalMode === "candidate" && (hash === "dashboard" || hash === "discover" || hash === "pipeline" || hash === "analytics")) {
      window.location.hash = "#candidate-dashboard";
      return;
    }

    // Hide Landing Page, Show App Shell
    const landing = document.getElementById("landing-page");
    const appL = document.getElementById("app-layout");
    if (landing) landing.classList.add("hidden");
    if (appL) appL.classList.remove("layout-hidden");

    // Hide all view panels
    document.querySelectorAll(".view-panel").forEach(panel => panel.classList.add("hidden"));

    // Show Target view panel
    const panelId = routeMap[hash];
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.classList.remove("hidden");
    }

    // Update active nav state in Sidebar
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-view") === hash) {
        item.classList.add("active");
      }
    });

    // Update header title based on active view
    const titleHeaders = {
      "dashboard": "Overview Dashboard",
      "discover": "Discover Talent",
      "evaluate": currentPortalMode === "candidate" ? "My Evidence Profile" : "Evidence Profile Analysis",
      "pipeline": "Manage Hiring Pipeline",
      "grow": currentPortalMode === "candidate" ? "Career Growth Hub" : "Grow & Nurture Talent",
      "analytics": "Hiring Analytics",
      "candidate-dashboard": "Candidate Workspace Hub",
      "notifications": "Notifications Center",
      "settings": "Workspace Settings"
    };
    
    const titleEl = document.getElementById("page-title");
    if (titleEl && titleHeaders[hash]) {
      titleEl.textContent = titleHeaders[hash];
    }

    // Loaders
    if (hash === "dashboard") loadDashboardView();
    if (hash === "discover") loadDiscoverView();
    if (hash === "evaluate") loadEvaluateView();
    if (hash === "pipeline") loadPipelineView();
    if (hash === "grow") loadGrowView();
    if (hash === "analytics") loadAnalyticsView();
    if (hash === "candidate-dashboard") loadCandidateDashboardView();
    if (hash === "notifications") loadNotificationsView();

    lucide.createIcons();
  }

  window.addEventListener("hashchange", handleRouting);

  // Bind sidebar nav clicks to update hash
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const view = item.getAttribute("data-view");
      if (view) {
        window.location.hash = `#${view}`;
      }
    });
  });

  // ------------------------------------------------------------
  // PORTAL SELECTION MODAL
  // ------------------------------------------------------------
  const modeModal = document.getElementById("mode-modal");
  const modeOptions = document.querySelectorAll(".mode-option");
  let selectedMode = "recruiter";

  modeOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      modeOptions.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedMode = opt.getAttribute("data-mode");
    });
  });

  document.getElementById("mode-continue").addEventListener("click", () => {
    modeModal.classList.add("hidden");
    if (selectedMode === "recruiter") {
      setPortalMode("recruiter");
      window.location.hash = "#dashboard";
    } else if (selectedMode === "candidate") {
      setPortalMode("candidate");
      window.location.hash = "#candidate-dashboard";
    } else if (selectedMode === "judge") {
      // Start Judge Mode walkthrough
      setPortalMode("recruiter");
      startJudgeWalkthrough();
    }
  });

  function setPortalMode(mode) {
    currentPortalMode = mode;
    
    // Sidebar nav visibility adjustment
    const recruiterNav = document.getElementById("recruiter-nav");
    const candidateNav = document.getElementById("candidate-nav");
    
    if (mode === "recruiter") {
      recruiterNav.classList.remove("hidden");
      candidateNav.classList.add("hidden");
      
      // Update sidebar avatar and user details
      document.getElementById("user-avatar-initials").textContent = "TS";
      document.getElementById("user-name-display").textContent = "Tarun Smith";
      document.getElementById("user-role-display").textContent = "Talent Partner";
      
      // Sidebar toggles
      document.getElementById("mode-toggle-recruiter").classList.add("active");
      document.getElementById("mode-toggle-candidate").classList.remove("active");
    } else {
      recruiterNav.classList.add("hidden");
      candidateNav.classList.remove("hidden");
      
      // Candidate mode pre-seeds Helena Rostova details
      document.getElementById("user-avatar-initials").textContent = "HR";
      document.getElementById("user-name-display").textContent = "Helena Rostova";
      document.getElementById("user-role-display").textContent = "Candidate User";
      
      // Sidebar toggles
      document.getElementById("mode-toggle-candidate").classList.add("active");
      document.getElementById("mode-toggle-recruiter").classList.remove("active");
    }
  }

  // Sidebar Mode Toggles
  document.getElementById("mode-toggle-recruiter").addEventListener("click", () => {
    setPortalMode("recruiter");
    window.location.hash = "#dashboard";
    showToast("Switched to Recruiter Portal view");
  });
  document.getElementById("mode-toggle-candidate").addEventListener("click", () => {
    setPortalMode("candidate");
    window.location.hash = "#candidate-dashboard";
    showToast("Switched to Candidate Hub view");
  });

  // Guarded event listener utility
  const safeBindClick = (id, callback) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", callback);
    }
  };

  // Landing Page Modal Triggers
  safeBindClick("landing-get-started", () => modeModal.classList.remove("hidden"));
  safeBindClick("landing-login-btn", () => modeModal.classList.remove("hidden"));
  safeBindClick("hero-primary-cta", () => modeModal.classList.remove("hidden"));
  safeBindClick("cta-get-started", () => modeModal.classList.remove("hidden"));

  // Landing Page Demo Triggers
  safeBindClick("hero-secondary-cta", () => {
    showToast("Demo request submitted! We will contact you within 24 hours.", "success");
  });
  safeBindClick("cta-demo", () => {
    showToast("Demo request submitted! We will contact you within 24 hours.", "success");
  });

  // Exit App Workspace
  safeBindClick("sidebar-exit-btn", () => {
    window.location.hash = "#landing";
    showToast("Logged out of the active session", "info");
  });

  // Topbar Alerts
  safeBindClick("topbar-notif-btn", () => {
    window.location.hash = "#notifications";
  });

  // Topbar Search filter
  document.getElementById("global-search").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    const activeHash = window.location.hash.substring(1);
    if (activeHash === "discover") {
      loadDiscoverView();
    } else if (activeHash === "dashboard") {
      loadDashboardView();
    }
  });

  // ------------------------------------------------------------
  // JUDGE WALKTHROUGH CONTROLLER
  // ------------------------------------------------------------
  const judgeWalkthrough = document.getElementById("judge-walkthrough");
  const judgePrevBtn = document.getElementById("judge-prev");
  const judgeNextBtn = document.getElementById("judge-next");
  const judgeFinishBtn = document.getElementById("judge-finish");
  const judgeSteps = document.querySelectorAll(".judge-step-pane");

  document.getElementById("topbar-tour-btn").addEventListener("click", () => {
    startJudgeWalkthrough();
  });

  function startJudgeWalkthrough() {
    currentJudgeStep = 1;
    judgeWalkthrough.classList.remove("hidden");
    renderJudgeStep();
  }

  function renderJudgeStep() {
    // Hide all step panels
    judgeSteps.forEach(pane => pane.classList.remove("active"));
    
    // Show current step panel
    const currentPane = document.querySelector(`.judge-step-pane[data-step="${currentJudgeStep}"]`);
    if (currentPane) {
      currentPane.classList.add("active");
    }

    // Progress bar update
    document.getElementById("judge-progress-bar").style.width = `${(currentJudgeStep / 10) * 100}%`;
    document.getElementById("judge-step-label").textContent = `Step ${currentJudgeStep} of 10`;

    // Button rules
    judgePrevBtn.disabled = currentJudgeStep === 1;
    
    if (currentJudgeStep === 10) {
      judgeNextBtn.classList.add("hidden");
      judgeFinishBtn.classList.remove("hidden");
    } else {
      judgeNextBtn.classList.remove("hidden");
      judgeFinishBtn.classList.add("hidden");
    }

    // Render navigation indicators (dots)
    const dotsContainer = document.getElementById("judge-dots-container");
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const dot = document.createElement("div");
      dot.className = `judge-nav-dot ${i === currentJudgeStep ? "active" : ""} ${i < currentJudgeStep ? "done" : ""}`;
      dot.addEventListener("click", () => {
        currentJudgeStep = i;
        renderJudgeStep();
      });
      dotsContainer.appendChild(dot);
    }

    // INTERACTIVE WALKTHROUGH STEPS (Routing on Step change)
    switch(currentJudgeStep) {
      case 1:
        // Welcome pane, stay
        break;
      case 2:
        // Show landing page
        window.location.hash = "#landing";
        break;
      case 3:
        // Route to Recruiter Dashboard
        setPortalMode("recruiter");
        window.location.hash = "#dashboard";
        break;
      case 4:
        // Route to Discover Sourcing
        window.location.hash = "#discover";
        break;
      case 5:
        // Route to Helena's Evidence Profile
        activeCandidateId = "cand-1";
        window.location.hash = "#evaluate";
        break;
      case 6:
        // Route to Kanban board
        window.location.hash = "#pipeline";
        break;
      case 7:
        // Route to Grow High Potential tab
        activeGrowTab = "high-potential";
        window.location.hash = "#grow";
        break;
      case 8:
        // Route to Analytics Charts
        window.location.hash = "#analytics";
        break;
      case 9:
        // Switch to Candidate Workspace
        setPortalMode("candidate");
        window.location.hash = "#candidate-dashboard";
        break;
      case 10:
        // Complete tour, review
        setPortalMode("recruiter");
        window.location.hash = "#dashboard";
        break;
    }
  }

  judgeNextBtn.addEventListener("click", () => {
    if (currentJudgeStep < 10) {
      currentJudgeStep++;
      renderJudgeStep();
    }
  });

  judgePrevBtn.addEventListener("click", () => {
    if (currentJudgeStep > 1) {
      currentJudgeStep--;
      renderJudgeStep();
    }
  });

  judgeFinishBtn.addEventListener("click", () => {
    judgeWalkthrough.classList.add("hidden");
    showToast("Thank you for completing the guided tour! Enjoy exploring.");
  });

  // ------------------------------------------------------------
  // LANDING PAGE INTERACTION: TABS & FAQ
  // ------------------------------------------------------------
  const screenshotTabBtns = document.querySelectorAll(".screenshot-tab-btn");
  const screenshotPanes = document.querySelectorAll(".screenshot-pane");

  screenshotTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      screenshotTabBtns.forEach(b => b.classList.remove("active"));
      screenshotPanes.forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const tabId = `tab-${btn.getAttribute("data-tab")}`;
      document.getElementById(tabId).classList.add("active");
    });
  });

  // FAQ Accordion Collapsible
  const faqItems = document.querySelectorAll(".faq-list .accordion-item");
  faqItems.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach(i => i.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });

  // ------------------------------------------------------------
  // GENERAL SETTINGS TAB NAVIGATION
  // ------------------------------------------------------------
  const settingsNavItems = document.querySelectorAll(".settings-nav-item");
  settingsNavItems.forEach(item => {
    item.addEventListener("click", () => {
      settingsNavItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      const panelKey = item.getAttribute("data-settings-panel");
      activeSettingsTab = panelKey;
      
      // Update Settings Header text
      const settingsPanel = document.querySelector(".settings-panel");
      if (panelKey === "general") {
        settingsPanel.innerHTML = `
          <h3 class="settings-section-title">General Settings</h3>
          <p class="settings-section-sub">Configure overall portal behavior and evaluation preferences.</p>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Default Matching Threshold</div>
              <div class="settings-row-desc">Only show candidates on the recruiter dashboard with a match probability higher than this.</div>
            </div>
            <select class="form-select" style="width: 100px;">
              <option>85%</option>
              <option>80%</option>
              <option>75%</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Enable Skill Adjacency Sourcing</div>
              <div class="settings-row-desc">Automatically translate related technical frames when searching profiles.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Combating Pedigree Bias</div>
              <div class="settings-row-desc">Weight historical performance and project indices higher than university credentials.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        `;
      } else if (panelKey === "notifications") {
        settingsPanel.innerHTML = `
          <h3 class="settings-section-title">Notification Settings</h3>
          <p class="settings-section-sub">Configure email alerts and system threshold alerts.</p>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Ecosystem Match Alerts</div>
              <div class="settings-row-desc">Send immediate notifications when a matching candidate is found.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Candidate Skill Updates</div>
              <div class="settings-row-desc">Alert when candidate scores change based on external github project scans.</div>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        `;
      } else {
        settingsPanel.innerHTML = `
          <h3 class="settings-section-title">Security & API Keys</h3>
          <p class="settings-section-sub">Generate sandbox credentials for ATS integrations.</p>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Developer API sandbox key</div>
              <div class="settings-row-desc">Used to query candidate matching models from external workflows.</div>
            </div>
            <input type="text" class="form-input" style="width: 240px;" value="hm_live_72k49a21b38e7ff910aa5" readonly>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Enable SAML Single Sign-On</div>
              <div class="settings-row-desc">Force enterprise logins via okta, onelogin, or azure ad.</div>
            </div>
            <label class="toggle">
              <input type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        `;
      }
    });
  });

  // ------------------------------------------------------------
  // DYNAMIC VIEW LOADERS
  // ------------------------------------------------------------

  // 1. RECRUITER DASHBOARD
  function loadDashboardView() {
    const tableBody = document.getElementById("dashboard-candidates-body");
    tableBody.innerHTML = "";

    // Filter candidates based on search
    const filteredCandidates = candidates.filter(cand => {
      return cand.name.toLowerCase().includes(searchQuery) ||
             cand.title.toLowerCase().includes(searchQuery);
    });

    if (filteredCandidates.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 32px; color: var(--text-muted);">No candidates match your active search filter.</td></tr>`;
    }

    filteredCandidates.forEach(cand => {
      const trMain = document.createElement("tr");
      trMain.style.cursor = "pointer";
      
      const badgeClass = cand.overall_score >= 90 ? "badge-success" : "badge-warning";
      const recLabel = cand.overall_score >= 90 ? "Strong Hire" : "Consider";
      
      // Resolve job title
      const job = initialJobs.find(j => j.job_id === cand.target_job_id);
      const jobTitle = job ? job.title : "Talent Marketplace";

      trMain.innerHTML = `
        <td>
          <div class="candidate-avatar-cell">
            <div class="candidate-mini-avatar" style="background: linear-gradient(135deg, var(--brand-500), var(--brand-700));">${cand.name.split(" ").map(n => n[0]).join("")}</div>
            <div>
              <span class="candidate-name">${cand.name}</span>
              <div class="candidate-role">${cand.title}</div>
            </div>
          </div>
        </td>
        <td><span class="text-sm font-semibold">${jobTitle}</span></td>
        <td>
          <div class="flex items-center gap-2">
            <span class="fw-bold text-primary">${cand.overall_score}%</span>
          </div>
        </td>
        <td><span class="badge ${badgeClass}">${recLabel}</span></td>
        <td>
          <div class="flex items-center gap-2" style="width: 100px;">
            <div style="flex: 1; height: 6px; background: var(--slate-100); border-radius: var(--r-full); overflow: hidden;">
              <div style="width: ${cand.overall_score}%; height: 100%; background: var(--success); border-radius: var(--r-full);"></div>
            </div>
            <span class="text-xs text-muted fw-semi">${cand.overall_score}%</span>
          </div>
        </td>
        <td>
          <div class="cc-actions">
            <button class="btn btn-secondary btn-sm evaluate-fit-btn" data-id="${cand.id}">Evaluate Fit</button>
            <button class="btn btn-ghost btn-sm expand-details-btn" data-id="${cand.id}"><i data-lucide="chevron-down"></i></button>
          </div>
        </td>
      `;

      // Expand details row
      const trExpand = document.createElement("tr");
      trExpand.className = "expand-row hidden";
      trExpand.id = `expand-details-${cand.id}`;

      // Build adjacent skills chips
      let skillsChipsHtml = "";
      cand.skills.forEach(s => {
        const iconName = s.matchType === "exact" ? "check" : "shuffle";
        const iconColor = s.matchType === "exact" ? "text-success" : "text-primary";
        skillsChipsHtml += `
          <div class="expand-signal-chip">
            <i data-lucide="${iconName}" class="${iconColor}" style="width: 12px; height: 12px;"></i>
            <span>${s.name} ${s.matchType === "adjacent" ? `(${s.equivalentTo})` : ""}</span>
          </div>
        `;
      });

      trExpand.innerHTML = `
        <td colspan="6">
          <div class="candidate-row-expand">
            <div class="expand-why-label">AI Rationale Summary</div>
            <p class="text-sm text-2" style="line-height: 1.6; margin-bottom: 12px;">${cand.why_selected}</p>
            <div class="expand-why-label" style="margin-top: 12px;">Verified Adjacent Skills</div>
            <div class="expand-signals">${skillsChipsHtml}</div>
          </div>
        </td>
      `;

      tableBody.appendChild(trMain);
      tableBody.appendChild(trExpand);

      // Event listeners
      trMain.querySelector(".evaluate-fit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        activeCandidateId = cand.id;
        window.location.hash = "#evaluate";
      });

      trMain.querySelector(".expand-details-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const icon = trMain.querySelector(".expand-details-btn i");
        const panel = document.getElementById(`expand-details-${cand.id}`);
        const isHidden = panel.classList.contains("hidden");
        
        if (isHidden) {
          panel.classList.remove("hidden");
          panel.querySelector(".candidate-row-expand").classList.add("open");
          icon.setAttribute("data-lucide", "chevron-up");
        } else {
          panel.classList.add("hidden");
          panel.querySelector(".candidate-row-expand").classList.remove("open");
          icon.setAttribute("data-lucide", "chevron-down");
        }
        lucide.createIcons();
      });
      
      // Row click evaluates candidate
      trMain.addEventListener("click", () => {
        activeCandidateId = cand.id;
        window.location.hash = "#evaluate";
      });
    });

    // Populate Activity Feed
    const activityFeed = document.getElementById("activity-feed-container");
    activityFeed.innerHTML = "";
    initialNotifications.forEach(notif => {
      const item = document.createElement("div");
      item.className = "activity-item";
      
      let dotColor = "bg-brand";
      if (notif.type === "rematch") dotColor = "dot-green";
      if (notif.type === "growth") dotColor = "dot-violet";
      if (notif.type === "pipeline") dotColor = "dot-amber";

      item.innerHTML = `
        <div class="activity-dot ${dotColor}"></div>
        <div class="activity-text">
          <span>${notif.body}</span>
          <div class="activity-time">${notif.time}</div>
        </div>
      `;
      activityFeed.appendChild(item);
    });

    lucide.createIcons();
  }

  // 2. DISCOVER TALENT (SOURCING)
  function loadDiscoverView() {
    const jobSelect = document.getElementById("discover-job-select");
    const gridContainer = document.getElementById("discover-candidate-grid");

    // Populate Job Selector dropdown once
    if (jobSelect.children.length === 0) {
      initialJobs.forEach(job => {
        const opt = document.createElement("option");
        opt.value = job.job_id;
        opt.textContent = `${job.title} (${job.department})`;
        jobSelect.appendChild(opt);
      });

      jobSelect.addEventListener("change", (e) => {
        activeDiscoverJobId = e.target.value;
        loadDiscoverView();
      });

      // Filter chips click handling
      document.querySelectorAll(".candidates-filters .filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          document.querySelectorAll(".candidates-filters .filter-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          discoverFilterThreshold = chip.getAttribute("data-filter");
          loadDiscoverView();
        });
      });
    }

    gridContainer.innerHTML = "";

    // Filter candidates by selected job, match threshold, and search query
    let filtered = candidates.filter(cand => {
      // Job opening filter
      if (activeDiscoverJobId !== "all" && cand.target_job_id !== activeDiscoverJobId) {
        // If candidate is in the global talent pool, keep them
        if (cand.target_job_id !== "none") return false;
      }
      return true;
    });

    // Sift Threshold Filters
    if (discoverFilterThreshold === "high") {
      filtered = filtered.filter(cand => cand.overall_score >= 90);
    } else if (discoverFilterThreshold === "potential") {
      filtered = filtered.filter(cand => cand.categories.includes("high_potential"));
    }

    // Search query filter
    if (searchQuery !== "") {
      filtered = filtered.filter(cand => {
        return cand.name.toLowerCase().includes(searchQuery) ||
               cand.title.toLowerCase().includes(searchQuery);
      });
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon"><i data-lucide="search"></i></div>
          <div class="empty-title">No Profiles Found</div>
          <div class="empty-desc">No candidates match your active job selection or search criteria. Try modifying your filter rules.</div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    filtered.forEach(cand => {
      const card = document.createElement("div");
      card.className = "candidate-card";
      
      const initials = cand.name.split(" ").map(n => n[0]).join("");
      
      let badgeClass = "badge-success";
      let recText = "Strong Hire";
      if (cand.overall_score < 90) {
        badgeClass = "badge-warning";
        recText = "Consider";
      }

      card.innerHTML = `
        <div class="cc-header">
          <div class="cc-avatar" style="background: linear-gradient(135deg, var(--brand-500), var(--brand-700));">${initials}</div>
          <div class="cc-info">
            <h4 class="cc-name">${cand.name}</h4>
            <div class="cc-role">${cand.title}</div>
          </div>
          <div class="cc-prob-badge">${cand.overall_score}% Match</div>
        </div>

        <div class="cc-signals">
          <div class="cc-signal-row">
            <span class="cc-sig-label">Skill Adjacency</span>
            <div class="cc-sig-track"><div class="cc-sig-fill" style="width: ${cand.skill_match_score}%; background: var(--primary);"></div></div>
            <span class="cc-sig-val">${cand.skill_match_score}%</span>
          </div>
          <div class="cc-signal-row">
            <span class="cc-sig-label">Growth Rate</span>
            <div class="cc-sig-track"><div class="cc-sig-fill" style="width: ${cand.potential_score}%; background: var(--violet-500);"></div></div>
            <span class="cc-sig-val">${cand.potential_score}%</span>
          </div>
          <div class="cc-signal-row">
            <span class="cc-sig-label">Verification</span>
            <div class="cc-sig-track"><div class="cc-sig-fill" style="width: ${cand.authenticity_score}%; background: var(--success);"></div></div>
            <span class="cc-sig-val">${cand.authenticity_status === "verified" ? `${cand.authenticity_score}%` : "0%"}</span>
          </div>
        </div>

        <div class="cc-footer">
          <span class="badge ${badgeClass}">${recText}</span>
          <span class="text-xs text-muted fw-semi">${cand.experience} Yrs Experience</span>
        </div>
      `;

      card.addEventListener("click", () => {
        activeCandidateId = cand.id;
        window.location.hash = "#evaluate";
      });

      gridContainer.appendChild(card);
    });

    lucide.createIcons();
  }

  // 3. EVIDENCE PROFILE (EVALUATE FIT)
  function loadEvaluateView() {
    const cand = candidates.find(c => c.id === activeCandidateId) || candidates[0];
    if (!cand) return;

    // Evaluate Header details
    document.getElementById("evaluate-title-hdr").textContent = `Evidence Profile: ${cand.name}`;

    // Sidebar details
    document.getElementById("eval-avatar").textContent = cand.name.split(" ").map(n => n[0]).join("");
    document.getElementById("eval-name").textContent = cand.name;
    document.getElementById("eval-title").textContent = cand.title;
    document.getElementById("eval-prob-score").textContent = `${cand.overall_score}%`;
    document.getElementById("eval-stat-exp").textContent = `${cand.experience} Years`;
    
    const verificationLabel = cand.authenticity_status === "verified" ? `Verified (${cand.authenticity_score}%)` : "Pending Challenge";
    document.getElementById("eval-stat-auth").textContent = verificationLabel;
    
    // Set recommendation badge
    const badgeEl = document.getElementById("eval-rec-badge");
    badgeEl.className = "evidence-rec-badge";
    if (cand.overall_score >= 90) {
      badgeEl.classList.add("badge-strong-hire");
      badgeEl.textContent = "Strong Hire";
    } else {
      badgeEl.classList.add("badge-consider");
      badgeEl.textContent = "Consider";
    }

    // Load strengths & risks
    const strengthsUl = document.getElementById("eval-strengths");
    strengthsUl.innerHTML = "";
    cand.strengths.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      strengthsUl.appendChild(li);
    });

    const risksUl = document.getElementById("eval-risks");
    risksUl.innerHTML = "";
    cand.risks.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      risksUl.appendChild(li);
    });

    // Advance to Pipeline button action
    document.getElementById("eval-cta-pipeline").addEventListener("click", () => {
      candidateStages[cand.id] = "assessment";
      showToast(`${cand.name} advanced to Assessment phase!`);
      window.location.hash = "#pipeline";
    });

    // Request Verification Challenge button action
    document.getElementById("eval-cta-assess").addEventListener("click", () => {
      cand.authenticity_status = "pending";
      showToast(`Dynamic knowledge check request sent to ${cand.name}!`);
      loadEvaluateView();
    });

    // Explainable AI text
    document.getElementById("eval-why-selected").textContent = cand.why_selected;

    // Explainability Progress Bars
    animateProgressBar("eval-bar-skills", cand.skill_match_score, "eval-val-skills");
    animateProgressBar("eval-bar-potential", cand.potential_score, "eval-val-potential");
    animateProgressBar("eval-bar-auth", cand.authenticity_status === "verified" ? cand.authenticity_score : 0, "eval-val-auth", cand.authenticity_status === "verified" ? "%" : "Pending");

    // 10 Dimensions details updates
    document.getElementById("sig-val-skills").textContent = `${cand.skill_match_score}%`;
    document.getElementById("sig-val-knowledge").textContent = cand.authenticity_status === "verified" ? `${cand.authenticity_score}%` : "Pending";
    document.getElementById("sig-val-growth").textContent = `${cand.potential_score}%`;
    document.getElementById("sig-val-projects").textContent = `${cand.alignment_score + 2}%`; // mapped proxy
    document.getElementById("sig-val-experience").textContent = `${cand.experience_score}%`;
    document.getElementById("sig-val-2y-role").textContent = cand.predicted_role_2yr;
    document.getElementById("sig-val-2y-rationale").textContent = cand.prediction_rationale;
    document.getElementById("sig-val-readiness").textContent = `${cand.readiness.technical}%`;
    document.getElementById("sig-val-culture").textContent = `${cand.readiness.culture}%`;
    document.getElementById("sig-val-comms").textContent = `${cand.readiness.communication}%`;
    document.getElementById("sig-val-learning").textContent = `${cand.readiness.domain}%`;

    // Render adjacent skills breakdown details sub-items
    const skillsSub = document.getElementById("sig-skills-sub");
    skillsSub.innerHTML = "";
    cand.skills.slice(0, 3).forEach(s => {
      const row = document.createElement("div");
      row.className = "signal-sub-item";
      row.innerHTML = `
        <i data-lucide="${s.matchType === 'exact' ? 'check' : 'shuffle'}" style="color: var(--primary); width: 12px; height: 12px;"></i>
        <span>${s.name} (${s.level}%)</span>
      `;
      skillsSub.appendChild(row);
    });

    // Verification check sub-items
    const knowledgeSub = document.getElementById("sig-knowledge-sub");
    knowledgeSub.innerHTML = "";
    if (cand.authenticity_status === "verified") {
      knowledgeSub.innerHTML = `
        <div class="signal-sub-item">
          <i data-lucide="check" style="color: var(--success); width: 12px; height: 12px;"></i>
          <span>Topic: ${cand.authenticity_challenge.topic} Verified</span>
        </div>
        <div class="signal-sub-item">
          <i data-lucide="shield" style="color: var(--success); width: 12px; height: 12px;"></i>
          <span>Quiz score: ${cand.authenticity_challenge.score}% accuracy</span>
        </div>
      `;
    } else {
      knowledgeSub.innerHTML = `
        <div class="signal-sub-item">
          <i data-lucide="clock" style="color: var(--warning); width: 12px; height: 12px;"></i>
          <span>Awaiting user challenge submission</span>
        </div>
      `;
    }

    // Candidate selection cycle triggers
    const currentIdx = candidates.findIndex(c => c.id === cand.id);
    document.getElementById("eval-prev-btn").onclick = () => {
      const prevIdx = (currentIdx - 1 + candidates.length) % candidates.length;
      activeCandidateId = candidates[prevIdx].id;
      loadEvaluateView();
    };
    document.getElementById("eval-next-btn").onclick = () => {
      const nextIdx = (currentIdx + 1) % candidates.length;
      activeCandidateId = candidates[nextIdx].id;
      loadEvaluateView();
    };

    lucide.createIcons();
  }

  function animateProgressBar(barId, targetVal, labelId, suffix = "%") {
    const bar = document.getElementById(barId);
    const label = document.getElementById(labelId);
    if (!bar) return;

    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = `${targetVal}%`;
      if (label) {
        label.textContent = targetVal === 0 && suffix === "Pending" ? "Pending" : `${targetVal}${suffix}`;
      }
    }, 150);
  }

  // 4. KANBAN HIRING PIPELINE
  function loadPipelineView() {
    const columns = [
      { key: "applied", label: "Applied", color: "var(--primary)" },
      { key: "screening", label: "Screening", color: "var(--brand-400)" },
      { key: "assessment", label: "Assessment", color: "var(--violet-500)" },
      { key: "interview", label: "Interview", color: "var(--warning)" },
      { key: "offer", label: "Offer Extended", color: "var(--sky-500)" },
      { key: "hired", label: "Hired", color: "var(--success)" }
    ];

    const board = document.getElementById("pipeline-board-container");
    board.innerHTML = "";

    columns.forEach(col => {
      const colDiv = document.createElement("div");
      colDiv.className = "pipeline-col";
      colDiv.setAttribute("data-stage", col.key);

      // Get candidates currently in this stage
      const stageCandidates = candidates.filter(cand => candidateStages[cand.id] === col.key);

      colDiv.innerHTML = `
        <div class="pipeline-col-header">
          <span class="pipeline-col-title">
            <span class="pipeline-col-dot" style="background: ${col.color}"></span>
            ${col.label}
          </span>
          <span class="pipeline-col-count" id="count-${col.key}">${stageCandidates.length}</span>
        </div>
        <div class="pipeline-cards" id="cards-${col.key}">
          <!-- Cards appended dynamically -->
        </div>
      `;

      const cardsContainer = colDiv.querySelector(".pipeline-cards");

      stageCandidates.forEach(cand => {
        const card = document.createElement("div");
        card.className = "pipeline-card";
        card.setAttribute("draggable", "true");
        card.setAttribute("data-cand-id", cand.id);

        card.innerHTML = `
          <div class="pc-name">${cand.name}</div>
          <div class="pc-role">${cand.title}</div>
          <div class="pc-footer">
            <span class="pc-score text-primary">${cand.overall_score}% Match</span>
            <div class="pc-actions">
              <div class="pc-action-btn view-eval-shortcut" data-tooltip="Evaluate candidate"><i data-lucide="eye"></i></div>
            </div>
          </div>
        `;

        card.querySelector(".view-eval-shortcut").addEventListener("click", (e) => {
          e.stopPropagation();
          activeCandidateId = cand.id;
          window.location.hash = "#evaluate";
        });

        // HTML5 Drag Event Listeners
        card.addEventListener("dragstart", (e) => {
          card.classList.add("dragging");
          e.dataTransfer.setData("text/plain", cand.id);
        });

        card.addEventListener("dragend", () => {
          card.classList.remove("dragging");
        });

        cardsContainer.appendChild(card);
      });

      // Drag over column container triggers
      cardsContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        colDiv.classList.add("drag-over");
      });

      cardsContainer.addEventListener("dragenter", (e) => {
        e.preventDefault();
        colDiv.classList.add("drag-over");
      });

      cardsContainer.addEventListener("dragleave", () => {
        colDiv.classList.remove("drag-over");
      });

      cardsContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        colDiv.classList.remove("drag-over");
        const candId = e.dataTransfer.getData("text/plain");
        if (candId) {
          candidateStages[candId] = col.key;
          showToast(`Moved candidate to ${col.label}`);
          loadPipelineView(); // Re-render instantly
        }
      });

      board.appendChild(colDiv);
    });

    lucide.createIcons();
  }

  // 5. GROW TALENT (HIGH POTENTIAL)
  function loadGrowView() {
    // Tab Button Handlers
    const tabBtns = document.querySelectorAll(".tabs-nav .tab-btn");
    const tabPanels = document.querySelectorAll(".grow-tab-content");

    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.add("hidden"));
        
        btn.classList.add("active");
        const targetId = `grow-${btn.getAttribute("data-grow-tab")}`;
        document.getElementById(targetId).classList.remove("hidden");
        activeGrowTab = btn.getAttribute("data-grow-tab");
      };
    });

    // Populate High Potential Candidates Grid
    const highPotGrid = document.getElementById("high-potential-grid-container");
    highPotGrid.innerHTML = "";

    const potentialCandidates = candidates.filter(c => c.categories.includes("high_potential"));

    potentialCandidates.forEach(cand => {
      const card = document.createElement("div");
      card.className = "high-potential-card";
      const initials = cand.name.split(" ").map(n => n[0]).join("");

      card.innerHTML = `
        <div class="hpc-header">
          <div class="hpc-avatar" style="background: linear-gradient(135deg, var(--violet-500), var(--brand-700));">${initials}</div>
          <div>
            <h4 class="hpc-name">${cand.name}</h4>
            <span class="hpc-role">${cand.title}</span>
          </div>
          <span class="hpc-gem-badge">Growth Profile</span>
        </div>

        <div class="hpc-metrics">
          <div class="hpc-metric-row">
            <span class="hpc-metric-label">True Potential</span>
            <div class="hpc-metric-bar"><div class="hpc-metric-fill" style="width: ${cand.potential_score}%; background: var(--violet-500);"></div></div>
            <span class="hpc-metric-val text-primary">${cand.potential_score}%</span>
          </div>
          <div class="hpc-metric-row">
            <span class="hpc-metric-label">Learning Vel.</span>
            <div class="hpc-metric-bar"><div class="hpc-metric-fill" style="width: ${cand.readiness.domain}%; background: var(--success);"></div></div>
            <span class="hpc-metric-val text-success">${cand.readiness.domain}%</span>
          </div>
          <div class="hpc-metric-row">
            <span class="hpc-metric-label">Match Probability</span>
            <div class="hpc-metric-bar"><div class="hpc-metric-fill" style="width: ${cand.overall_score}%; background: var(--primary);"></div></div>
            <span class="hpc-metric-val text-primary">${cand.overall_score}%</span>
          </div>
        </div>

        <div class="hpc-insight">
          <strong>Explainable Rationale:</strong> ${cand.why_selected.substring(0, 140)}...
        </div>
      `;

      card.addEventListener("click", () => {
        activeCandidateId = cand.id;
        window.location.hash = "#evaluate";
      });

      highPotGrid.appendChild(card);
    });

    lucide.createIcons();
  }

  // 6. ANALYTICS (CHART.JS)
  function loadAnalyticsView() {
    // 1. Funnel Chart
    const ctxFunnel = document.getElementById("chart-funnel").getContext("2d");
    if (chartFunnelInstance) chartFunnelInstance.destroy();
    chartFunnelInstance = new Chart(ctxFunnel, {
      type: "bar",
      data: {
        labels: ["Sourced", "Screening", "Assessments", "Interviews", "Offers", "Hired"],
        datasets: [{
          label: "Volume",
          data: [142, 85, 42, 24, 8, 6],
          backgroundColor: "#6366F1",
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } } }
      }
    });

    // 2. Time-to-Hire Chart
    const ctxTime = document.getElementById("chart-time").getContext("2d");
    if (chartTimeInstance) chartTimeInstance.destroy();
    chartTimeInstance = new Chart(ctxTime, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Days to Fill",
          data: [28, 25, 22, 19, 18, 18],
          borderColor: "#10B981",
          backgroundColor: "rgba(16,185,129,0.1)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { min: 10 } }
      }
    });

    // 3. Sourcing Channels
    const ctxSources = document.getElementById("chart-sources").getContext("2d");
    if (chartSourcesInstance) chartSourcesInstance.destroy();
    chartSourcesInstance = new Chart(ctxSources, {
      type: "doughnut",
      data: {
        labels: ["LinkedIn Sourced", "Organic Applied", "Referral", "HireMind Sift"],
        datasets: [{
          data: [45, 20, 15, 20],
          backgroundColor: ["#6366F1", "#38BDF8", "#F59E0B", "#10B981"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } }
      }
    });

    // 4. AI Accuracy Chart
    const ctxAccuracy = document.getElementById("chart-accuracy").getContext("2d");
    if (chartAccuracyInstance) chartAccuracyInstance.destroy();
    chartAccuracyInstance = new Chart(ctxAccuracy, {
      type: "radar",
      data: {
        labels: ["Coding Skills", "Culture Fit", "Tech Adaptability", "Retention Pred.", "Growth Velocity"],
        datasets: [
          {
            label: "HireMind AI Prediction",
            data: [92, 88, 95, 90, 94],
            borderColor: "#6366F1",
            backgroundColor: "rgba(99,102,241,0.15)"
          },
          {
            label: "Traditional Screening",
            data: [70, 75, 50, 65, 60],
            borderColor: "#94A3B8",
            backgroundColor: "rgba(148,163,184,0.15)"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } },
        scales: { r: { angleLines: { display: false }, suggestedMin: 40 } }
      }
    });
  }

  // 7. CANDIDATE WORKSPACE DASHBOARD
  function loadCandidateDashboardView() {
    const oppsList = document.getElementById("candidate-opportunities-list");
    oppsList.innerHTML = "";

    // Candidate mode displays Helena Rostova profile defaults
    const candidateData = candidates[0]; // Helena
    document.getElementById("cand-dash-name").textContent = candidateData.name;
    document.getElementById("cand-dash-score").textContent = candidateData.overall_score;

    // Populate active opportunities
    candidateData.active_opportunities.forEach(opp => {
      const card = document.createElement("div");
      card.className = "job-card";
      
      const compLogo = opp.role.split(" ").map(w => w[0]).join("");

      card.innerHTML = `
        <div class="job-company-logo">${compLogo}</div>
        <div class="job-info">
          <h4 class="job-title">${opp.role}</h4>
          <p class="job-company">HireMind AI Client Sourcing Portal</p>
          <div class="job-meta">
            <div class="job-meta-item"><i data-lucide="briefcase"></i><span>Full Time</span></div>
            <div class="job-meta-item"><i data-lucide="map-pin"></i><span>Remote</span></div>
          </div>
        </div>
        <div class="job-match-badge">${opp.match}% Fit</div>
      `;

      card.addEventListener("click", () => {
        activeCandidateId = candidateData.id;
        window.location.hash = "#evaluate";
      });

      oppsList.appendChild(card);
    });

    // Populate growth roadmap
    const roadmapList = document.getElementById("cand-roadmap-list");
    roadmapList.innerHTML = "";
    
    candidateData.learning_roadmap.timeline.forEach((item, idx) => {
      const box = document.createElement("div");
      box.className = "learning-card";
      
      let badgeTheme = item.completed ? "badge-success" : "badge-outline";
      let statusText = item.completed ? "Completed" : "In Progress";

      box.innerHTML = `
        <div class="flex justify-between items-center lc-badge">
          <span class="badge ${badgeTheme}">${statusText}</span>
          <span class="text-xs text-faint font-semibold">${item.term} Goal</span>
        </div>
        <h4 class="lc-title">${item.goal}</h4>
        <p class="lc-desc">Closing technological gap vectors to achieve principal engineering milestones.</p>
        <div class="lc-meta">
          <div class="lc-meta-item"><i data-lucide="book-open"></i><span>Core Curriculum</span></div>
          <div class="lc-meta-item"><i data-lucide="award"></i><span>Verified Badge</span></div>
        </div>
      `;
      roadmapList.appendChild(box);
    });

    // Render verification checks UI
    renderVerificationUI();

    lucide.createIcons();
  }

  // Verification Checks Quiz UI for Candidates
  function renderVerificationUI() {
    const container = document.getElementById("cand-verification-ui");
    const cand = candidates[0]; // Helena

    if (cand.authenticity_status === "verified") {
      container.innerHTML = `
        <div class="hp-ai-rec" style="margin: 0; background: var(--green-50); border-color: var(--green-100);">
          <i data-lucide="shield-check" style="color: var(--success);"></i>
          <span style="color: var(--green-700); font-weight: 700;">Knowledge Claim Verified: React core concepts passed (Score: ${cand.authenticity_challenge.score}%).</span>
        </div>
      `;
      return;
    }

    const quizQuestions = authenticityQuestionDb[quizActiveSkill];
    if (!quizQuestions) return;

    if (quizQuestionIdx >= quizQuestions.length) {
      // Completed, calculate final score
      const finalScore = Math.round((quizCorrectCount / quizQuestions.length) * 100);
      cand.authenticity_status = "verified";
      cand.authenticity_score = finalScore;
      cand.authenticity_challenge.score = finalScore;
      cand.authenticity_challenge.questions_answered = quizQuestions.length;

      container.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <div class="score-ring" style="margin: 0 auto 16px; border-color: var(--success); box-shadow: 0 0 0 6px var(--green-100);">
            <span class="score-ring-value" style="color: var(--success);">${finalScore}%</span>
            <span class="score-ring-label">Accuracy</span>
          </div>
          <h4 class="fw-bold text-sm" style="color: var(--success); margin-bottom: 8px;">Assessment Completed!</h4>
          <p class="text-xs text-muted" style="margin-bottom: 12px;">Your verified score has been compiled and added to your Evidence Profile.</p>
          <button class="btn btn-secondary btn-sm" id="btn-restart-quiz">Verify Another Skill</button>
        </div>
      `;

      document.getElementById("btn-restart-quiz").onclick = () => {
        quizQuestionIdx = 0;
        quizCorrectCount = 0;
        cand.authenticity_status = "pending";
        renderVerificationUI();
      };
      
      showToast(`Skill verification challenge complete. Score: ${finalScore}%`);
      return;
    }

    // Render Question
    const q = quizQuestions[quizQuestionIdx];
    let optionsHtml = "";
    q.options.forEach((opt, idx) => {
      optionsHtml += `
        <button class="btn btn-secondary w-full select-option-btn" data-idx="${idx}" style="justify-content: flex-start; text-align: left; height: auto; padding: 8px 12px; margin-bottom: 6px; white-space: normal; line-height: 1.4;">
          ${idx + 1}. ${opt}
        </button>
      `;
    });

    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: 8px;">
        <span class="badge badge-primary">Topic: ${quizActiveSkill}</span>
        <span class="text-xs text-faint">Question ${quizQuestionIdx + 1} of ${quizQuestions.length}</span>
      </div>
      <h4 class="fw-bold text-sm" style="color: var(--text); margin-bottom: 12px; line-height: 1.4;">${q.question}</h4>
      <div class="flex flex-col gap-1">
        ${optionsHtml}
      </div>
    `;

    // Add option select listeners
    container.querySelectorAll(".select-option-btn").forEach(btn => {
      btn.onclick = () => {
        const pickedIdx = parseInt(btn.getAttribute("data-idx"));
        if (pickedIdx === q.correct) {
          quizCorrectCount++;
          showToast("Correct Answer!", "success");
        } else {
          showToast("Incorrect claim verified", "error");
        }
        quizQuestionIdx++;
        renderVerificationUI();
      };
    });
  }

  // 8. NOTIFICATIONS CENTER
  function loadNotificationsView() {
    const notifContainer = document.getElementById("notifications-list-container");
    notifContainer.innerHTML = "";

    initialNotifications.forEach(notif => {
      const item = document.createElement("div");
      item.className = `notif-item ${notif.unread ? "unread" : ""}`;
      
      let iconColor = "bg-brand";
      let iconName = "bell";
      if (notif.type === "rematch") {
        iconColor = "dot-green";
        iconName = "check-circle";
      } else if (notif.type === "growth") {
        iconColor = "dot-violet";
        iconName = "trending-up";
      } else {
        iconColor = "dot-amber";
        iconName = "kanban";
      }

      item.innerHTML = `
        <div class="notif-icon ${iconColor}">
          <i data-lucide="${iconName}" style="color: white; width: 14px; height: 14px;"></i>
        </div>
        <div class="notif-content">
          <div class="notif-title">${notif.title}</div>
          <div class="notif-desc">${notif.body}</div>
          <div class="notif-time">${notif.time}</div>
        </div>
      `;

      item.addEventListener("click", () => {
        notif.unread = false;
        loadNotificationsView();
        
        // Navigate
        if (notif.actionLink) {
          window.location.hash = notif.actionLink;
        }
      });

      notifContainer.appendChild(item);
    });

    // Update unread count
    const unreadCount = initialNotifications.filter(n => n.unread).length;
    const badgeCount = document.getElementById("notif-badge-count");
    if (badgeCount) {
      badgeCount.textContent = unreadCount;
      const notifDot = document.getElementById("topbar-notif-dot");
      if (unreadCount === 0) {
        badgeCount.classList.add("hidden");
        if (notifDot) notifDot.classList.add("hidden");
      } else {
        badgeCount.classList.remove("hidden");
        if (notifDot) notifDot.classList.remove("hidden");
      }
    }

    // Mark all read button trigger
    document.getElementById("notif-mark-read-btn").onclick = () => {
      initialNotifications.forEach(n => n.unread = false);
      showToast("Marked all notifications read");
      loadNotificationsView();
    };

    lucide.createIcons();
  }

  // ------------------------------------------------------------
  // INITIAL ROUTING TRIGGER
  // ------------------------------------------------------------
  handleRouting();

  // ------------------------------------------------------------
  // HERO INTERACTIVE PREVIEW WIDGET & MOUSE EFFECTS
  // ------------------------------------------------------------
  const heroSec = document.querySelector('.hero-section');
  if (heroSec) {
    heroSec.addEventListener('mousemove', (e) => {
      const rect = heroSec.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSec.style.setProperty('--mouse-x', `${x}px`);
      heroSec.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  const heroCandidateData = {
    helena: {
      name: "Helena Rostova",
      role: "Senior UI Developer Match",
      initials: "HR",
      match: 93,
      skills: 95,
      learning: 96,
      growth: 92,
      rec: "Strong Hire: Vue.js foundation maps 91% to React architect requirements.",
      exp: "6 Yrs",
      comms: "Strong",
      domain: "88%"
    },
    marcus: {
      name: "Marcus Vance",
      role: "Distributed Systems Match",
      initials: "MV",
      match: 89,
      skills: 85,
      learning: 90,
      growth: 92,
      rec: "Consider: Python/Docker background translates 85% to core Go systems specs.",
      exp: "4 Yrs",
      comms: "Excellent",
      domain: "89%"
    },
    kenji: {
      name: "Dr. Kenji Tanaka",
      role: "ML Scientist Match",
      initials: "KT",
      match: 95,
      skills: 97,
      learning: 96,
      growth: 93,
      rec: "Strong Hire: Published research papers show 96% domain alignment.",
      exp: "7 Yrs",
      comms: "Strong",
      domain: "96%"
    }
  };

  let activeHeroCand = "helena";

  // Tab switcher
  document.querySelectorAll(".hero-selector-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".hero-selector-btn").forEach(b => {
        b.classList.remove("active");
        b.style.background = "var(--surface)";
        b.style.color = "var(--text-muted)";
        b.style.borderColor = "var(--border)";
      });

      btn.classList.add("active");
      btn.style.background = "var(--primary-subtle)";
      btn.style.color = "var(--primary)";
      btn.style.borderColor = "var(--primary)";

      const candKey = btn.getAttribute("data-cand");
      activeHeroCand = candKey;
      updateHeroWidget(candKey);
    });
  });

  function updateHeroWidget(key) {
    const data = heroCandidateData[key];
    if (!data) return;

    document.getElementById("hero-widget-avatar").textContent = data.initials;
    document.getElementById("hero-widget-name").textContent = data.name;
    document.getElementById("hero-widget-role").textContent = data.role;
    document.getElementById("hero-widget-match").textContent = `${data.match}% Match`;
    
    document.getElementById("hero-widget-bar-skills").style.width = `${data.skills}%`;
    document.getElementById("hero-widget-val-skills").textContent = `${data.skills}%`;
    
    document.getElementById("hero-widget-bar-learning").style.width = `${data.learning}%`;
    document.getElementById("hero-widget-val-learning").textContent = `${data.learning}%`;
    
    document.getElementById("hero-widget-bar-growth").style.width = `${data.growth}%`;
    document.getElementById("hero-widget-val-growth").textContent = `${data.growth}%`;
    
    document.getElementById("hero-widget-rec").textContent = data.rec;
    
    document.getElementById("hero-widget-stat-exp").textContent = data.exp;
    document.getElementById("hero-widget-stat-comms").textContent = data.comms;
    document.getElementById("hero-widget-stat-domain").textContent = data.domain;

    // Reset Run button state
    const runBtn = document.getElementById("hero-widget-run-btn");
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = '<i data-lucide="play"></i><span>Simulate AI Trajectory</span>';
      lucide.createIcons();
    }
  }

  // Simulator animation logic
  const runBtn = document.getElementById("hero-widget-run-btn");
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      runBtn.disabled = true;
      runBtn.innerHTML = '<i data-lucide="refresh-cw" class="animate-spin"></i><span>Running AI Model...</span>';
      lucide.createIcons();

      const data = heroCandidateData[activeHeroCand];
      const matchEl = document.getElementById("hero-widget-match");
      const card = document.getElementById("hero-widget-card");

      // Visual pulse
      card.style.transform = "scale(0.98)";
      card.style.transition = "transform 0.1s";
      setTimeout(() => {
        card.style.transform = "scale(1.02)";
        card.style.boxShadow = "0 0 20px rgba(99,102,241,0.25)";
        card.style.borderColor = "var(--primary)";
      }, 100);

      // Value ticker simulation
      let currentVal = 20;
      const interval = setInterval(() => {
        currentVal += Math.ceil((data.match - currentVal) / 4);
        if (currentVal >= data.match) {
          currentVal = data.match;
          clearInterval(interval);
          
          // Complete simulation
          card.style.transform = "none";
          card.style.boxShadow = "var(--sh-md)";
          card.style.borderColor = "var(--border)";
          runBtn.innerHTML = '<i data-lucide="check-circle" style="color: var(--success);"></i><span>Simulation Success!</span>';
          lucide.createIcons();
          showToast(`Simulation complete: ${data.name} predicted with high accuracy.`);
        }
        matchEl.textContent = `${currentVal}% Match`;
      }, 50);
    });
  }

});