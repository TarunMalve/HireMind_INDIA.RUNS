// ============================================================
// HireMind Elite — Landing Page JavaScript
// Theme System | Auth Modals | Animations | Navigation
// ============================================================

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // THEME SYSTEM
  // ─────────────────────────────────────────────────────────────
  const ThemeManager = {
    STORAGE_KEY: 'hiremind-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark';
      this.apply(saved);
      this.bindToggle();
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      const btn = document.querySelector('.theme-toggle-btn');
      if (btn) {
        btn.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}" id="theme-icon" style="width:16px;height:16px;"></i>`;
        if (window.lucide) lucide.createIcons();
      }
    },

    toggle() {
      const current = localStorage.getItem(this.STORAGE_KEY) || 'dark';
      this.apply(current === 'dark' ? 'light' : 'dark');
    },

    bindToggle() {
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // NAVBAR SCROLL BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  const NavbarManager = {
    nav: null,

    init() {
      this.nav = document.getElementById('lp-navbar');
      if (!this.nav) return;
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();
    },

    onScroll() {
      if (!this.nav) return;
      if (window.scrollY > 60) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MOBILE MENU
  // ─────────────────────────────────────────────────────────────
  const MobileMenu = {
    isOpen: false,

    init() {
      const btn = document.getElementById('mobile-menu-btn');
      const menu = document.getElementById('mobile-nav');
      const closeBtn = document.getElementById('mobile-menu-close');
      if (!btn || !menu) return;

      btn.addEventListener('click', () => this.open());
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    },

    open() {
      const menu = document.getElementById('mobile-nav');
      if (menu) { menu.classList.add('open'); document.body.style.overflow = 'hidden'; }
      this.isOpen = true;
    },

    close() {
      const menu = document.getElementById('mobile-nav');
      if (menu) { menu.classList.remove('open'); document.body.style.overflow = ''; }
      this.isOpen = false;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SMOOTH SCROLL
  // ─────────────────────────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#lp-"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SCROLL REVEAL
  // ─────────────────────────────────────────────────────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ─────────────────────────────────────────────────────────────
  // COUNTER ANIMATION
  // ─────────────────────────────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = String(target).includes('.');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.metric-number[data-target]').forEach(el => observer.observe(el));
  }

  // ─────────────────────────────────────────────────────────────
  // PRODUCT TABS
  // ─────────────────────────────────────────────────────────────
  function initProductTabs() {
    document.querySelectorAll('.product-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.product-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HOW IT WORKS — STEP HIGHLIGHT ON SCROLL
  // ─────────────────────────────────────────────────────────────
  function initHowItWorks() {
    const steps = document.querySelectorAll('.how-step');
    if (!steps.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelector('.how-step-num')?.classList.add('active-step');
          }
        });
      },
      { threshold: 0.6 }
    );

    steps.forEach(step => observer.observe(step));
  }

  // ─────────────────────────────────────────────────────────────
  // TOAST NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────
  const Toast = {
    container: null,

    init() {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },

    show(message, type = 'info', duration = 4000) {
      const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
      `;
      this.container.appendChild(toast);
      setTimeout(() => toast.remove(), duration);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // AUTH MODAL SYSTEM
  // ─────────────────────────────────────────────────────────────
  const AuthModal = {
    currentModal: null,
    currentStep: 1,
    totalSteps: 1,
    userType: 'recruiter',

    init() {
      // Open triggers
      document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.openModal;
          this.open(id);
        });
      });

      // Close triggers
      document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target === el) this.closeAll();
        });
      });

      // Prevent inner click from closing
      document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.addEventListener('click', e => e.stopPropagation());
      });

      // Auth type toggle (Candidate / Recruiter)
      document.querySelectorAll('.auth-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const parent = btn.closest('.auth-type-toggle');
          parent.querySelectorAll('.auth-type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.userType = btn.dataset.userType || 'recruiter';
        });
      });

      // Step navigation
      document.querySelectorAll('.step-next-btn').forEach(btn => {
        btn.addEventListener('click', () => this.nextStep(btn.closest('.auth-modal')));
      });

      document.querySelectorAll('.step-back-btn').forEach(btn => {
        btn.addEventListener('click', () => this.prevStep(btn.closest('.auth-modal')));
      });

      // Form submissions
      document.querySelectorAll('.auth-form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(form);
        });
      });

      // Switch between login/register
      document.querySelectorAll('[data-switch-modal]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.dataset.switchModal;
          this.closeAll();
          setTimeout(() => this.open(target), 200);
        });
      });

      // Keyboard: Escape closes modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeAll();
      });
    },

    open(modalId) {
      const overlay = document.getElementById(modalId);
      if (!overlay) return;
      overlay.classList.add('open');
      this.currentModal = overlay;
      document.body.style.overflow = 'hidden';
      this.currentStep = 1;
      this.renderSteps(overlay);
    },

    closeAll() {
      document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
      document.body.style.overflow = '';
      this.currentModal = null;
    },

    renderSteps(modal) {
      const steps = modal.querySelectorAll('.form-step');
      const dots = modal.querySelectorAll('.step-dot');
      const total = steps.length;

      steps.forEach((step, i) => {
        step.classList.toggle('active', i === this.currentStep - 1);
      });

      dots.forEach((dot, i) => {
        dot.classList.remove('active', 'done');
        if (i < this.currentStep - 1) dot.classList.add('done');
        else if (i === this.currentStep - 1) dot.classList.add('active');
      });

      // Show/hide back button
      const backBtn = modal.querySelector('.step-back-btn');
      if (backBtn) backBtn.style.visibility = this.currentStep > 1 ? 'visible' : 'hidden';

      // Update next/submit button
      const nextBtn = modal.querySelector('.step-next-btn');
      if (nextBtn) {
        nextBtn.textContent = this.currentStep === total ? 'Get Started →' : 'Continue →';
      }
    },

    nextStep(modal) {
      if (!modal) return;
      const steps = modal.querySelectorAll('.form-step');
      const total = steps.length;

      if (!this.validateStep(modal)) return;

      if (this.currentStep < total) {
        this.currentStep++;
        this.renderSteps(modal);
      } else {
        this.handleOnboardingComplete(modal);
      }
    },

    prevStep(modal) {
      if (!modal || this.currentStep <= 1) return;
      this.currentStep--;
      this.renderSteps(modal);
    },

    validateStep(modal) {
      const currentStepEl = modal.querySelector('.form-step.active');
      if (!currentStepEl) return true;

      let valid = true;
      currentStepEl.querySelectorAll('input[required], select[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
          setTimeout(() => input.classList.remove('error'), 2000);
        }
      });

      if (!valid) Toast.show('Please fill in all required fields.', 'error');
      return valid;
    },

    handleSubmit(form) {
      const modal = form.closest('.modal-overlay');
      const email = form.querySelector('input[type="email"]')?.value || 'user@example.com';
      const userTypeBtn = form.closest('.auth-modal')?.querySelector('.auth-type-btn.active');
      const userType = userTypeBtn?.dataset.userType || 'recruiter';

      // Store session
      localStorage.setItem('hm-user-email', email);
      localStorage.setItem('hm-user-type', userType);
      localStorage.setItem('hm-logged-in', 'true');

      this.closeAll();

      Toast.show(`Welcome back! Redirecting to your ${userType} dashboard...`, 'success');

      setTimeout(() => {
        if (userType === 'candidate') {
          window.location.hash = '#candidate-dashboard';
        } else {
          window.location.hash = '#dashboard';
        }
        // Trigger dashboard navigation
        if (window.navigate) window.navigate(userType === 'candidate' ? 'candidate-dashboard' : 'dashboard');
      }, 1200);
    },

    handleOnboardingComplete(modal) {
      const userTypeBtn = modal.querySelector('.auth-type-btn.active');
      const userType = userTypeBtn?.dataset.userType || this.userType;

      localStorage.setItem('hm-user-type', userType);
      localStorage.setItem('hm-logged-in', 'true');
      localStorage.setItem('hm-onboarded', 'true');

      this.closeAll();

      Toast.show('🎉 Account created! Welcome to HireMind Elite.', 'success');

      setTimeout(() => {
        if (userType === 'candidate') {
          if (window.navigate) window.navigate('candidate-dashboard');
        } else {
          if (window.navigate) window.navigate('dashboard');
        }
      }, 1200);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MARQUEE DUPLICATE
  // ─────────────────────────────────────────────────────────────
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      const items = track.innerHTML;
      track.innerHTML = items + items; // duplicate for seamless loop
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HERO PREVIEW ANIMATION
  // ─────────────────────────────────────────────────────────────
  function initHeroPreview() {
    const fills = document.querySelectorAll('.preview-score-fill');
    fills.forEach(fill => {
      const pct = fill.dataset.pct || '80';
      fill.style.setProperty('--fill-pct', pct + '%');
    });

    // Animate preview metrics ticker
    const tickers = document.querySelectorAll('.preview-ticker');
    tickers.forEach(ticker => {
      setInterval(() => {
        const val = parseInt(ticker.dataset.base) + Math.floor(Math.random() * 5);
        ticker.textContent = ticker.dataset.prefix + val + ticker.dataset.suffix;
      }, 3000);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PRICING TOGGLE
  // ─────────────────────────────────────────────────────────────
  function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
      const isAnnual = toggle.checked;
      document.querySelectorAll('.price-monthly').forEach(el => el.classList.toggle('hidden', isAnnual));
      document.querySelectorAll('.price-annual').forEach(el => el.classList.toggle('hidden', !isAnnual));
      document.querySelectorAll('.billing-badge').forEach(el => {
        el.textContent = isAnnual ? 'Save 30%' : '';
        el.style.display = isAnnual ? 'inline-flex' : 'none';
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // LANDING PAGE SHOW / HIDE
  // ─────────────────────────────────────────────────────────────
  function showLanding() {
    const landing = document.getElementById('landing-view');
    const dashboard = document.getElementById('dashboard-layout');
    if (landing) { landing.style.display = 'block'; }
    if (dashboard) { dashboard.style.display = 'none'; }
  }

  // ─────────────────────────────────────────────────────────────
  // INITIALIZE ALL
  // ─────────────────────────────────────────────────────────────
  function init() {
    ThemeManager.init();
    NavbarManager.init();
    MobileMenu.init();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initProductTabs();
    initHowItWorks();
    initMarquee();
    initHeroPreview();
    initPricingToggle();
    Toast.init();
    AuthModal.init();
    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally for app.js to call
  window.LandingModule = { Toast, AuthModal, ThemeManager };

})();
