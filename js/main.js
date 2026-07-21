/* ══════════════════════════════════════════════════════
   ARKHÉ – main.js
   Creative Codex Studio
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────
  // AOS — Animate on Scroll
  // ─────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  // ─────────────────────────────────────────
  // NAVBAR – scroll effect
  // ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─────────────────────────────────────────
  // NAVBAR – mobile burger menu
  // ─────────────────────────────────────────
  const burger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      burger.innerHTML = isOpen
        ? '<i class="fas fa-bars"></i>'
        : '<i class="fas fa-times"></i>';
    });

    // Fecha ao clicar em um link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        burger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // ─────────────────────────────────────────
  // VAGAS — decrementa lentamente para urgência
  // ─────────────────────────────────────────
  const VAGAS_KEY = 'arkhe_vagas';
  const VAGAS_TS_KEY = 'arkhe_vagas_ts';
  const VAGAS_INICIAL = 23;
  const VAGAS_MINIMO  = 7;
  const DECREMENTO_INTERVALO_MS = 4 * 60 * 60 * 1000;

  function getVagas() {
    if (!localStorage.getItem(VAGAS_TS_KEY)) {
      localStorage.setItem(VAGAS_TS_KEY, Date.now());
      localStorage.setItem(VAGAS_KEY, VAGAS_INICIAL);
      return VAGAS_INICIAL;
    }

    let vagas = parseInt(localStorage.getItem(VAGAS_KEY) || VAGAS_INICIAL, 10);
    let lastTs = parseInt(localStorage.getItem(VAGAS_TS_KEY), 10);
    const elapsed = Date.now() - lastTs;
    const decrementos = Math.floor(elapsed / DECREMENTO_INTERVALO_MS);

    if (decrementos > 0) {
      vagas = Math.max(VAGAS_MINIMO, vagas - decrementos);
      localStorage.setItem(VAGAS_KEY, vagas);
      localStorage.setItem(VAGAS_TS_KEY, Date.now());
    }
    return vagas;
  }

  const vagas = getVagas();
  const elVagasOferta = document.getElementById('vagas-oferta');
  if (elVagasOferta) elVagasOferta.textContent = vagas;

  // ─────────────────────────────────────────
  // CONTADOR ANIMADO — prova social
  // ─────────────────────────────────────────
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = !Number.isInteger(target);
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(el => countObserver.observe(el));
  }

  // ─────────────────────────────────────────
  // FAQ – accordion
  // ─────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    const icon     = item.querySelector('.faq-icon');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        const ic = i.querySelector('.faq-icon');
        if (a) { a.classList.remove('open'); a.style.maxHeight = '0px'; }
        if (ic) ic.style.transform = '';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ─────────────────────────────────────────
  // SMOOTH SCROLL – internal anchors
  // ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // altura da navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─────────────────────────────────────────
  // HERO IMAGE – fallback handling
  // ─────────────────────────────────────────
  const heroImg = document.querySelector('.hero-img');
  const heroPlaceholder = document.querySelector('.hero-img-placeholder');

  if (heroImg && heroPlaceholder) {
    heroImg.addEventListener('load', () => {
      heroPlaceholder.style.display = 'none';
      heroImg.style.display = 'block';
    });
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
      heroPlaceholder.style.display = 'flex';
    });
  }

  // ─────────────────────────────────────────
  // BUTTON – ripple effect on CTA clicks
  // ─────────────────────────────────────────
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        width: 10px; height: 10px;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 5) + 'px';
      ripple.style.top  = (e.clientY - rect.top - 5) + 'px';

      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Injeta keyframe do ripple uma única vez
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to { transform: scale(40); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ─────────────────────────────────────────
  // ACTIVE NAV LINK – highlight on scroll
  // ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─────────────────────────────────────────
  // MOBILE FLOATING CTA
  // ─────────────────────────────────────────
  const floatCta = document.getElementById('mobileFloatCta');
  if (floatCta) {
    const footer = document.getElementById('footer');
    const onFloatScroll = () => {
      const scrolled = window.scrollY > 400;
      const nearFooter = footer && (window.scrollY + window.innerHeight > footer.offsetTop - 80);
      floatCta.classList.toggle('visible', scrolled && !nearFooter);
    };
    window.addEventListener('scroll', onFloatScroll, { passive: true });
  }

  // ─────────────────────────────────────────
  // CARROSSEL – Da Plataforma
  // ─────────────────────────────────────────
  const track = document.getElementById('plataformaTrack');
  if (track) {
    const prevBtn = document.getElementById('plataformaPrev');
    const nextBtn = document.getElementById('plataformaNext');
    const currentEl = document.getElementById('plataformaCurrent');
    const totalEl = document.getElementById('plataformaTotal');
    const progressFill = document.getElementById('plataformaProgressFill');
    const totalSlides = track.children.length;
    let index = 0;

    if (totalEl) totalEl.textContent = totalSlides;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (currentEl) currentEl.textContent = index + 1;
      if (progressFill) progressFill.style.width = `${((index + 1) / totalSlides) * 100}%`;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        index = (index - 1 + totalSlides) % totalSlides;
        update();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        index = (index + 1) % totalSlides;
        update();
      });
    }

    // Swipe por toque (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) < 40) return; // ignora toques/arrastos curtos
      if (diff > 0) {
        index = (index + 1) % totalSlides;
      } else {
        index = (index - 1 + totalSlides) % totalSlides;
      }
      update();
    }, { passive: true });

    // Lightbox — expande o print clicado, com navegação
    const lightbox = document.getElementById('plataformaLightbox');
    const lightboxImg = document.getElementById('plataformaLightboxImg');
    const lightboxClose = document.getElementById('plataformaLightboxClose');
    const lightboxPrev = document.getElementById('plataformaLightboxPrev');
    const lightboxNext = document.getElementById('plataformaLightboxNext');
    const lightboxCounter = document.getElementById('plataformaLightboxCounter');

    if (lightbox && lightboxImg) {
      const slideImgs = Array.from(track.querySelectorAll('.plataforma-slide img'));
      let lightboxIndex = 0;

      const openLightbox = (i) => {
        lightboxIndex = i;
        showLightboxImage();
        lightbox.classList.add('open');
      };

      const showLightboxImage = () => {
        const img = slideImgs[lightboxIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} / ${slideImgs.length}`;
        // sincroniza o carrossel de fundo com a imagem exibida
        index = lightboxIndex;
        update();
      };

      slideImgs.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(i));
      });

      const goPrev = () => {
        lightboxIndex = (lightboxIndex - 1 + slideImgs.length) % slideImgs.length;
        showLightboxImage();
      };
      const goNext = () => {
        lightboxIndex = (lightboxIndex + 1) % slideImgs.length;
        showLightboxImage();
      };

      if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });
      if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });

      const closeLightbox = () => lightbox.classList.remove('open');

      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      });

      // Swipe por toque no lightbox
      let lbTouchStartX = 0;
      lightbox.addEventListener('touchstart', (e) => {
        lbTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      lightbox.addEventListener('touchend', (e) => {
        const diff = lbTouchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) < 40) return;
        diff > 0 ? goNext() : goPrev();
      }, { passive: true });
    }
  }

});