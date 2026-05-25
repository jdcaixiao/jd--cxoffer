/* ============================================
   Navigation Scroll Effect
   ============================================ */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // Initialize on load

/* ============================================
   Mobile Menu Toggle
   ============================================ */
const mobileToggle = document.getElementById('mobileToggle');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navbar.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navbar.classList.remove('open');
  });
});

/* ============================================
   Scroll Reveal Animations
   ============================================ */
function initReveal() {
  // Add reveal class to elements we want to animate
  const revealTargets = document.querySelectorAll(
    '.service-card, .case-card, .process-step, .timeline-item, .trust-item'
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Add staggered delays for grid items
    const parent = el.parentElement;
    if (parent.classList.contains('services-grid') || parent.classList.contains('cases-list')) {
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    }
    if (parent.classList.contains('process-timeline')) {
      el.classList.add(`reveal-delay-${(i % 5) + 1}`);
    }
    if (parent.classList.contains('trust-grid')) {
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    }
  });
}

function handleReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const revealPoint = 100; // px from bottom of viewport

    if (top < windowHeight - revealPoint) {
      el.classList.add('visible');
    }
  });
}

// Initialize
initReveal();
handleReveal(); // Reveal elements already in view on load
window.addEventListener('scroll', handleReveal, { passive: true });

/* ============================================
   Active Navigation Link Highlighting
   ============================================ */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollPos = window.scrollY + 120;

  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;

    if (scrollPos >= top && scrollPos < top + height) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--jd-red)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ============================================
   Smooth Number Counter Animation
   ============================================ */
function animateNumbers() {
  const trustNums = document.querySelectorAll('.trust-num');

  trustNums.forEach(el => {
    // Only animate once
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const text = el.textContent || '';
    const match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isInt = Number.isInteger(target);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.innerHTML = isInt
        ? `${Math.floor(current)}<span class="trust-num-accent">${suffix}</span>`
        : `${current.toFixed(1)}<span class="trust-num-accent">${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerHTML = `${isInt ? target : target.toFixed(1)}<span class="trust-num-accent">${suffix}</span>`;
      }
    }

    requestAnimationFrame(update);
  });
}

// Trigger number animation when trust bar comes into view
const trustBar = document.querySelector('.trust-bar');
if (trustBar) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(trustBar);
}

/* ============================================
   Floating Card Parallax
   ============================================ */
const floatCard = document.querySelector('.hero-card-float');

if (floatCard && window.innerWidth > 1024) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      const translateY = progress * 60;
      const opacity = 1 - progress * 1.5;
      floatCard.style.transform = `translateY(${-translateY}px)`;
      floatCard.style.opacity = Math.max(0, opacity);
    }
  }, { passive: true });
}

/* ============================================
   CTA Button Click (placeholder - replace with real link)
   ============================================ */
document.querySelectorAll('.btn-primary[href="#"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Scroll to contact/CTA section
    document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================
   Contact Modal
   ============================================ */
const contactModal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');
const copyToast = document.getElementById('copyToast');

function openModal(e) {
  e.preventDefault();
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  copyToast.textContent = '';
}

// Open modal from any CTA button
document.querySelectorAll('#ctaConsultBtn, .nav-cta').forEach(btn => {
  btn.addEventListener('click', openModal);
});

// Close on X button
modalClose.addEventListener('click', closeModal);

// Close on overlay click
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('active')) closeModal();
});

// Copy buttons
document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = '已复制';
      btn.classList.add('copied');
      copyToast.textContent = `「${text}」已复制到剪贴板`;
      setTimeout(() => {
        btn.textContent = '复制';
        btn.classList.remove('copied');
        copyToast.textContent = '';
      }, 2000);
    } catch {
      copyToast.textContent = '复制失败，请手动复制';
    }
  });
});

console.log('京东面试辅导 — 网站已就绪');
