/* ==========================================================================
   FLAIRTECH INNOVATIONS — Interactive Behavior & UI Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky navbar shadow on scroll
  const navbar = document.querySelector('.ft-navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. Scroll reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // 3. Animated metric counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1200;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cObserver.observe(c));
  }

  // 4. Terminal Hub Interactive Filter & Detail Panel
  const hubFilterBtns = document.querySelectorAll('[data-hub-filter]');
  const hubItems = document.querySelectorAll('[data-hub-region]');
  const hubDetailTitle = document.getElementById('hubDetailTitle');
  const hubDetailRegion = document.getElementById('hubDetailRegion');
  const hubDetailDesc = document.getElementById('hubDetailDesc');
  const hubDetailServices = document.getElementById('hubDetailServices');

  if (hubFilterBtns.length && hubItems.length) {
    hubFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        hubFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.hubFilter;
        hubItems.forEach((item) => {
          const match = filter === 'all' || item.dataset.hubRegion === filter;
          item.classList.toggle('d-none', !match);
        });
      });
    });

    hubItems.forEach((item) => {
      item.addEventListener('click', () => {
        hubItems.forEach((h) => h.classList.remove('active'));
        const pill = item.querySelector('.ft-hub-pill');
        document.querySelectorAll('.ft-hub-pill').forEach((p) => p.classList.remove('active'));
        if (pill) pill.classList.add('active');
        item.classList.add('active');
        if (hubDetailTitle && item.dataset.hubName) {
          hubDetailTitle.textContent = item.dataset.hubName;
          hubDetailRegion.textContent = item.dataset.hubBadge || 'Active Terminal';
          hubDetailDesc.textContent = item.dataset.hubDesc || '';
          if (hubDetailServices) {
            hubDetailServices.textContent = item.dataset.hubServices || 'FTL • LTL • Cross-Border';
          }
        }
      });
    });
  }

  // 5. Service Quick-Filter on Services Page
  const serviceTabs = document.querySelectorAll('[data-service-tab]');
  const serviceSections = document.querySelectorAll('[data-service-panel]');
  if (serviceTabs.length && serviceSections.length) {
    serviceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        serviceTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.serviceTab;
        serviceSections.forEach((sec) => {
          const show = target === 'all' || sec.dataset.servicePanel === target;
          sec.classList.toggle('d-none', !show);
        });
      });
    });
  }

  // 6. Quote Modal Pre-fill from Service Cards
  const quoteModalEl = document.getElementById('quoteModal');
  if (quoteModalEl) {
    quoteModalEl.addEventListener('show.bs.modal', (event) => {
      const trigger = event.relatedTarget;
      const serviceSelect = quoteModalEl.querySelector('#modalServiceType');
      if (trigger && trigger.dataset.service && serviceSelect) {
        serviceSelect.value = trigger.dataset.service;
      }
    });
  }

  // 7. Interactive Form Handling (Quote Modal, Contact Form, Career Form)
  const handleQuoteForm = (form, feedbackEl) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const refId = 'FTI-' + Math.floor(100000 + Math.random() * 900000);
      if (feedbackEl) {
        feedbackEl.classList.remove('d-none');
        const refSpan = feedbackEl.querySelector('.ref-code');
        if (refSpan) refSpan.textContent = refId;
      }
      form.reset();
      form.classList.remove('was-validated');
    });
  };

  document.querySelectorAll('.ft-interactive-form').forEach((form) => {
    const targetId = form.dataset.feedback;
    const feedbackEl = targetId ? document.getElementById(targetId) : form.nextElementSibling;
    handleQuoteForm(form, feedbackEl);
  });

  // 8. Hero Instant Freight Lane Estimator
  const laneForm = document.getElementById('heroLaneEstimator');
  const laneResult = document.getElementById('laneEstimatorResult');
  if (laneForm && laneResult) {
    laneForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = laneForm.querySelector('#estMode').value;
      const origin = laneForm.querySelector('#estOrigin').value;
      const dest = laneForm.querySelector('#estDest').value;

      const transitMap = {
        'FTL': 'Direct Dedicated Transit • 1–4 Business Days (Coast-to-Coast)',
        'LTL': 'Scheduled Hub Consolidation • 2–5 Business Days w/ Real-Time Track & Trace',
        'Expedited': 'Priority Team Drivers / Same-Day Dispatch • Immediate Departure',
        'Warehousing': 'Immediate Pallet / Cross-Docking Intake at BC & Ontario Facilities'
      };

      laneResult.innerHTML = `
        <div class="d-flex align-items-start gap-2">
          <i class="bi bi-check-circle-fill text-success fs-5 mt-1"></i>
          <div>
            <div class="fw-bold text-forest">${mode}: ${origin} → ${dest}</div>
            <div class="small text-muted-brand">${transitMap[mode] || 'Custom Logistics Corridor Available'}</div>
            <button type="button" class="btn btn-sm btn-ft-primary mt-2" data-bs-toggle="modal" data-bs-target="#quoteModal" data-service="${mode}">
              Lock In Rate Quote <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
      laneResult.classList.remove('d-none');
    });
  }

  // 9. Pre-select service radio chip on Contact page from URL query param (?service=...)
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (serviceParam) {
    const matchRadio = document.querySelector(`input[name="need"][value*="${serviceParam}"]`);
    if (matchRadio) matchRadio.checked = true;
  }

  // 10. Hero Auto-Slide Carousel Sync (updates headline kicker/title/badge smoothly)
  const heroCarousel = document.getElementById('heroBannerCarousel');
  if (heroCarousel) {
    const slideBadge = document.getElementById('heroSlideBadge');
    const slideTitle = document.getElementById('heroSlideTitle');
    const slideDesc = document.getElementById('heroSlideDesc');
    const slideCounter = document.getElementById('heroSlideCounter');

    heroCarousel.addEventListener('slide.bs.carousel', (e) => {
      const nextItem = e.relatedTarget;
      if (!nextItem) return;
      if (slideBadge && nextItem.dataset.badge) slideBadge.textContent = nextItem.dataset.badge;
      if (slideTitle && nextItem.dataset.title) slideTitle.textContent = nextItem.dataset.title;
      if (slideDesc && nextItem.dataset.desc) slideDesc.textContent = nextItem.dataset.desc;
      if (slideCounter) slideCounter.textContent = `0${e.to + 1} / 04`;
    });
  }
});
