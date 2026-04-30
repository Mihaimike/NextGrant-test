/* ==========================================================================
   NextGrant — script.js
   Toată interactivitatea site-ului (vanilla JS, fără dependențe).
   --------------------------------------------------------------------------
   Cuprins:
   01. Configurație globală
   02. Header scroll behavior
   03. Mobile menu
   04. Smooth scroll pentru link-uri interne
   05. Hero reveal stagger (la load)
   06. IntersectionObserver pentru .scroll-reveal
   07. Counter animat statistici
   08. Servicii — linia de progres gold
   09. Calculator de grant (slider + interpolare)
   10. Testimonial carousel (autoplay 5s + manual)
   11. FAQ accordion (one-open-at-a-time)
   12. Lead form — validare + submit + success state
   13. Particule canvas hero (cu parallax mouse)
   14. Cursor custom (desktop)
   15. Scroll progress bar
   16. Bootstrap (DOM ready)
   ========================================================================== */

(function () {
  'use strict';

  /* 01. Configurație globală =============================================== */

  // FORM_ENDPOINT — Formspree NextGrant (preluat de pe site-ul vechi)
  // Schimbă aici dacă creezi un endpoint nou pe formspree.io
  const FORM_ENDPOINT = 'https://formspree.io/f/xeevayaj';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* 02. Header scroll behavior ============================================= */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    let lastY = -1;
    const onScroll = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      header.classList.toggle('is-scrolled', y > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 03. Mobile menu ======================================================== */
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const open = () => {
      menu.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.querySelector('.menu-icon-open')?.classList.add('hidden');
      toggle.querySelector('.menu-icon-close')?.classList.remove('hidden');
    };
    const close = () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.menu-icon-open')?.classList.remove('hidden');
      toggle.querySelector('.menu-icon-close')?.classList.add('hidden');
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('hidden') ? open() : close();
    });

    // Închidere la click pe link
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* 03b. Switcher limbi cu traducere reală (RO / RU / EN) ================= */
  // Aplică traducerea pentru toate elementele cu data-i18n* din pagină
  function applyTranslations(lang) {
    const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || null;
    if (!dict) {
      console.warn('[NextGrant] Traduceri lipsă pentru limba:', lang);
      return;
    }

    // Helper de lookup cu fallback la RO
    const t = (key) => dict[key] || (window.TRANSLATIONS.ro && window.TRANSLATIONS.ro[key]) || '';

    // 1) Conținut text simplu (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      if (value) el.textContent = value;
    });

    // 2) Conținut HTML (cu <strong>, <span> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const value = t(key);
      if (value) el.innerHTML = value;
    });

    // 3) Atribute (placeholder, title, aria-label)
    const attrs = ['placeholder', 'title', 'aria-label'];
    attrs.forEach(attr => {
      const dataAttr = `data-i18n-${attr}`;
      document.querySelectorAll(`[${dataAttr}]`).forEach(el => {
        const key = el.getAttribute(dataAttr);
        const value = t(key);
        if (value) el.setAttribute(attr, value);
      });
    });

    // 4) Update <html lang="..."> + dir
    document.documentElement.setAttribute('lang', lang);

    // 5) Update aria-pressed pe butoanele de limbă + clasa active
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // 6) Persistă alegerea
    try { localStorage.setItem('ng_lang', lang); } catch (e) { /* ignore */ }
  }

  function initLangSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;

    // Aplică limba salvată sau cea din browser, cu fallback la RO
    let savedLang = 'ro';
    try {
      const stored = localStorage.getItem('ng_lang');
      if (stored && window.TRANSLATIONS && window.TRANSLATIONS[stored]) savedLang = stored;
    } catch (e) { /* ignore */ }
    if (savedLang !== 'ro') applyTranslations(savedLang);

    // Listener pe fiecare buton (există atât în desktop cât și în mobil)
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (!lang) return;
        applyTranslations(lang);
      });
    });
  }

  // Toast simplu — apare jos pe ecran, dispare în 3s
  function showToast(message) {
    let toast = document.getElementById('ng-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ng-toast';
      toast.className = 'ng-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    // Dacă deja e vizibil, doar resetăm timer-ul de hide (nu facem flicker)
    if (!toast.classList.contains('show')) {
      // Folosim dublu rAF pentru a garanta commit între remove și add
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
      });
    }
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* 04. Smooth scroll ====================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* 05. Hero reveal stagger (la load) ====================================== */
  function initHeroReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const heroReveals = document.querySelectorAll('#hero .reveal');
    heroReveals.forEach((el) => {
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
    });
  }

  /* 06. IntersectionObserver scroll-reveal ================================= */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }

  /* 07. Counter animat ===================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target || '0');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1500;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const value = target * easeOut(t);
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
      };
      requestAnimationFrame(tick);
    };

    if (prefersReducedMotion) {
      counters.forEach(c => {
        const target = parseFloat(c.dataset.target || '0');
        const decimals = parseInt(c.dataset.decimals || '0', 10);
        c.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
  }

  /* 08. Servicii — linia de progres gold =================================== */
  function initServicesLine() {
    const track = document.querySelector('.services-track');
    if (!track) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track.classList.add('is-active');
          observer.unobserve(track);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(track);
  }

  /* 09. Calculator de grant ================================================ */
  function initCalculator() {
    const slider = document.getElementById('calc-slider');
    if (!slider) return;

    const grantEl = document.getElementById('calc-grant');
    const investmentEl = document.getElementById('calc-investment');
    const mInvestment = document.getElementById('m-investment');
    const mGrant = document.getElementById('m-grant');
    const mOwn = document.getElementById('m-own');
    const percentEl = document.getElementById('calc-percent');
    const barFill = document.getElementById('calc-bar-fill');
    const GRANT_CAP = 3_000_000;

    const fmt = (n) => Math.round(n).toLocaleString('ro-RO').replace(/,/g, '.');

    // Pentru interpolare smooth cu rAF
    const animatedValues = {
      investment: parseFloat(slider.value),
      grant: 0,
      own: 0,
      percent: 0
    };
    const targetValues = { ...animatedValues };
    let rafId = null;

    const updateTargets = () => {
      const investment = parseFloat(slider.value);
      const grant = Math.min(investment * 0.5, GRANT_CAP);
      const own = investment - grant;
      const percent = Math.min((grant / GRANT_CAP) * 100, 100);
      targetValues.investment = investment;
      targetValues.grant = grant;
      targetValues.own = own;
      targetValues.percent = percent;

      // Update vizual al fundalului slider-ului
      const sliderPct = ((investment - parseFloat(slider.min)) / (parseFloat(slider.max) - parseFloat(slider.min))) * 100;
      slider.style.backgroundImage = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${sliderPct}%, var(--gray-soft) ${sliderPct}%, var(--gray-soft) 100%)`;
    };

    const tick = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      const SPEED = 0.18;
      let needsMore = false;

      ['investment', 'grant', 'own', 'percent'].forEach(k => {
        const diff = Math.abs(targetValues[k] - animatedValues[k]);
        if (diff > 0.5) {
          animatedValues[k] = lerp(animatedValues[k], targetValues[k], SPEED);
          needsMore = true;
        } else {
          animatedValues[k] = targetValues[k];
        }
      });

      grantEl.textContent = fmt(animatedValues.grant);
      investmentEl.textContent = fmt(animatedValues.investment);
      mInvestment.textContent = fmt(animatedValues.investment);
      mGrant.textContent = fmt(animatedValues.grant);
      mOwn.textContent = fmt(animatedValues.own);
      percentEl.textContent = Math.round(animatedValues.percent);
      barFill.style.width = animatedValues.percent + '%';

      if (needsMore) rafId = requestAnimationFrame(tick);
      else rafId = null;
    };

    const onInput = () => {
      updateTargets();
      if (prefersReducedMotion) {
        animatedValues.investment = targetValues.investment;
        animatedValues.grant = targetValues.grant;
        animatedValues.own = targetValues.own;
        animatedValues.percent = targetValues.percent;
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    slider.addEventListener('input', onInput);
    onInput(); // init
  }

  /* 10. Testimonial carousel =============================================== */
  function initTestimonials() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!track) return;

    const slides = track.children;
    const total = slides.length;
    let current = 0;
    let autoplayId = null;

    const goTo = (i) => {
      current = (i + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => { goTo(idx); resetAutoplay(); });
    });

    // Autoplay
    const startAutoplay = () => {
      if (prefersReducedMotion) return;
      autoplayId = setInterval(next, 5000);
    };
    const resetAutoplay = () => {
      if (autoplayId) clearInterval(autoplayId);
      startAutoplay();
    };

    // Pauză la hover
    const carousel = document.getElementById('testimonial-carousel');
    carousel?.addEventListener('mouseenter', () => { if (autoplayId) clearInterval(autoplayId); });
    carousel?.addEventListener('mouseleave', startAutoplay);

    // Touch swipe (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    carousel?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAutoplay();
      }
    }, { passive: true });

    startAutoplay();
  }

  /* 11. FAQ accordion ====================================================== */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          // Închide celelalte (one-open-at-a-time)
          items.forEach(other => {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  }

  /* 12. Lead form ========================================================== */
  function initLeadForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const fields = form.querySelectorAll('input, select, textarea');

    // Phone — păstrează prefixul +373
    const phoneField = document.getElementById('f-phone');
    phoneField?.addEventListener('input', (e) => {
      if (!e.target.value.startsWith('+373')) {
        e.target.value = '+373 ';
      }
    });
    phoneField?.addEventListener('focus', (e) => {
      if (e.target.value === '') e.target.value = '+373 ';
    });

    // IDNO — accept doar cifre
    const idnoField = document.getElementById('f-idno');
    idnoField?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13);
    });

    // Helper i18n cu fallback la RO
    const ti = (key) => {
      const lang = document.documentElement.getAttribute('lang') || 'ro';
      const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || (window.TRANSLATIONS && window.TRANSLATIONS.ro) || {};
      return dict[key] || (window.TRANSLATIONS && window.TRANSLATIONS.ro && window.TRANSLATIONS.ro[key]) || '';
    };

    const validateField = (field) => {
      const wrapper = field.closest('.form-field');
      let valid = true;
      let msg = '';

      if (field.required && !field.value.trim()) {
        valid = false;
        msg = ti('lead.error.required') || 'Câmp obligatoriu';
      } else if (field.type === 'email' && field.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value)) { valid = false; msg = ti('lead.error.email') || 'Adresă email invalidă'; }
      } else if (field.id === 'f-idno' && field.value) {
        if (!/^\d{13}$/.test(field.value)) { valid = false; msg = ti('lead.error.idno') || 'IDNO trebuie să aibă 13 cifre'; }
      } else if (field.type === 'tel' && field.value) {
        const digits = field.value.replace(/\D/g, '');
        if (digits.length < 11) { valid = false; msg = ti('lead.error.phone') || 'Număr de telefon prea scurt'; }
      }

      field.classList.toggle('invalid', !valid);
      if (wrapper) {
        wrapper.classList.toggle('has-error', !valid);
        const errEl = wrapper.querySelector('.form-error');
        if (errEl) errEl.textContent = msg;
      }
      return valid;
    };

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach(f => { if (!validateField(f)) allValid = false; });
      if (!allValid) {
        // Scroll la primul câmp invalid
        const first = form.querySelector('.invalid');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first?.focus();
        return;
      }

      const submitBtn = document.getElementById('lead-submit');
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>' + (ti('lead.submitting') || 'Se trimite...') + '</span>';

      try {
        const formData = new FormData(form);
        // Dacă endpoint-ul nu este configurat, simulăm un delay (pentru testing local)
        if (FORM_ENDPOINT.includes('REPLACE_WITH_FORM_ID')) {
          await new Promise(r => setTimeout(r, 800));
          console.warn('FORM_ENDPOINT nu este configurat în script.js. Datele NU au fost trimise.');
          showSuccess();
          return;
        }
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        if (response.ok) {
          showSuccess();
        } else {
          throw new Error('Submit failed');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        if (window.lucide) lucide.createIcons();
        alert(ti('lead.error') || 'A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi la office@nextgrant.md');
      }
    });

    function showSuccess() {
      const fieldsContainer = document.getElementById('lead-form-fields');
      const successEl = document.getElementById('lead-success');
      if (fieldsContainer) fieldsContainer.classList.add('hidden');
      if (successEl) {
        successEl.classList.remove('hidden');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /* 13. Particule canvas hero ==============================================
     NOTĂ: așteptăm window.load + ResizeObserver pe părinte, pentru a evita
     race condition cu Tailwind CDN (când DOMContentLoaded fires, clasele
     w-full/h-full încă nu sunt aplicate, deci canvas are 0 dimensiuni). */
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Sub reduced-motion reducem nr+amplitudinea, dar tot rulăm (efect lent)
    const reduce = prefersReducedMotion;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let parallaxX = 0, parallaxY = 0;
    let rafId = null;

    const isMobile = window.innerWidth < 768;
    const COUNT = reduce ? 14 : (isMobile ? 22 : 48);

    const resize = () => {
      // Folosim hero.clientWidth/clientHeight ca sursă sigură (nu canvas rect)
      const w = hero.clientWidth || window.innerWidth;
      const h = hero.clientHeight || window.innerHeight;
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        // 20% din particule sunt "stele" mai mari pentru vizibilitate
        const isHighlight = Math.random() < 0.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseY: 0,
          r: isHighlight ? (Math.random() * 2 + 3) : (Math.random() * 1.8 + 1.2),
          speed: (reduce ? 0.0003 : 0.0008) + Math.random() * 0.001,
          phase: Math.random() * Math.PI * 2,
          amplitude: reduce ? 6 : (14 + Math.random() * 24),
          opacity: isHighlight ? (0.7 + Math.random() * 0.3) : (0.4 + Math.random() * 0.35),
          glow: isHighlight ? 5 : 3
        });
        particles[i].baseY = particles[i].y;
      }
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);
      parallaxX += (mouseX - parallaxX) * 0.04;
      parallaxY += (mouseY - parallaxY) * 0.04;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const offsetY = Math.sin(now * p.speed + p.phase) * p.amplitude;
        const x = p.x + parallaxX * 0.8;
        const y = p.baseY + offsetY + parallaxY * 0.6;
        const glowRadius = p.r * p.glow;
        // Halo gradient pentru contrast pe navy
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        grad.addColorStop(0, `rgba(232, 199, 106, ${p.opacity * 0.9})`);
        grad.addColorStop(0.4, `rgba(201, 168, 76, ${p.opacity * 0.35})`);
        grad.addColorStop(1, 'rgba(201, 168, 76, 0)');
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Punct central solid bright
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 220, 140, ${Math.min(p.opacity + 0.3, 1)})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      resize();
      if (width === 0 || height === 0) {
        setTimeout(start, 80);
        return;
      }
      createParticles();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(draw);
    };

    // Resize observer pe hero — se redimensionează corect cu layout shifts
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        resize();
        if (particles.length > 0) {
          // re-distribuim baseY proporțional la noile dimensiuni
          particles.forEach(p => { p.baseY = Math.min(p.baseY, height); p.x = Math.min(p.x, width); });
        }
      });
      ro.observe(hero);
    }

    // Init: pornim imediat, cu retry intern dacă layout încă nu e gata
    requestAnimationFrame(start);
    // Un retry suplimentar la load (defensiv, pentru unele preview-uri)
    window.addEventListener('load', () => requestAnimationFrame(start), { once: true });

    // Parallax mouse (doar desktop, fără touch)
    if (!isTouch && !reduce) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mouseX = (e.clientX - cx) * 0.05;
        mouseY = (e.clientY - cy) * 0.05;
      });
      hero.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });
    }

    // Pauză când tab-ul nu e vizibil
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId && width > 0) {
        rafId = requestAnimationFrame(draw);
      }
    });
  }

  /* 14. Cursor custom ====================================================== */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    // Hover state pe elemente clickable
    const hoverables = 'a, button, [role="button"], input, select, textarea, .testimonial-dot, .calc-slider, summary';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
  }

  /* 15. Scroll progress bar ================================================ */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* 15b. Year curent în footer ============================================= */
  function initYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* 16. Bootstrap ========================================================== */
  function bootstrap() {
    initHeaderScroll();
    initMobileMenu();
    initLangSwitcher();
    initSmoothScroll();
    initHeroReveal();
    initScrollReveal();
    initCounters();
    initServicesLine();
    initCalculator();
    initTestimonials();
    initFAQ();
    initLeadForm();
    initParticles();
    initCursor();
    initScrollProgress();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
