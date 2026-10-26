/**
 * Colossal Bio-Tech / AI Edition - Main Client Script
 * BGS College of Engineering and Technology (BGSCET)
 * Features:
 * - 60FPS AI Neural Synapse Simulation (Electric Purple & Stark White)
 * - Self-Contained AI Generative Data Stream Visualizer
 * - Multi-Category Filter with Cross-Fade Transitions
 * - Mobile Navigation Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initHorseIntroLoader();
  initMobileNavigation();
  initActiveNavHighlight();
  initNavbarScroll();
  initProjectFilters();
  initContactForm();
  initSkillBars();
  initHeroNeuralEngine();
  initAIStreamVisualizer();
});

/**
 * 1. Mobile Menu Toggle
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    }
  });
}

/**
 * 2. Highlight Active Page Link
 */
function initActiveNavHighlight() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 3. Sticky Navbar Blur & Shadow on Scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * 4. Project Category Filter
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'block';
          card.style.animation = 'colossalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 5. Interactive Contact Form with Validation & Confirmation Toast
 */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const toast = document.getElementById('contactToast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName')?.value.trim();
    const email = document.getElementById('senderEmail')?.value.trim();
    const message = document.getElementById('senderMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Transmitting message...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      if (toast) {
        toast.classList.add('show');
        toast.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => toast.classList.remove('show'), 6000);
      }

      form.reset();
    }, 850);
  });
}

/**
 * 6. Skill Bars Animation on Scroll
 */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth || '80%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

/**
 * 7. Colossal Hero Neural Synapse Simulation (Purple & White)
 */
function initHeroNeuralEngine() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 75;
  const maxDistance = 145;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class NeuralNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.85;
      this.vy = (Math.random() - 0.5) * 0.85;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? '#a855f7' : '#ffffff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5cf6';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new NeuralNode());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDistance) * 0.35;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/**
 * 8. Self-Contained AI/ML Data Stream Stage (Never Buffers or Errors, 60FPS)
 */
function initAIStreamVisualizer() {
  const canvas = document.getElementById('aiStreamCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -1000, mouseY = -1000;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 380;
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  let time = 0;

  function drawAIStream() {
    time += 0.025;
    ctx.fillStyle = 'rgba(4, 1, 10, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // Subtle background matrix grid
    ctx.strokeStyle = 'rgba(121, 40, 202, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dynamic horizontal scanline
    const scanY = (Math.sin(time * 0.7) * 0.5 + 0.5) * height;
    const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
    scanGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
    scanGrad.addColorStop(0.5, 'rgba(217, 70, 239, 0.18)');
    scanGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 15, width, 30);

    // Multi-frequency neural activation waves in Colossal Purple & White
    const waves = [
      { color: 'rgba(121, 40, 202, 0.5)', freq: 0.007, speed: 1.1, amp: 58, yOffset: height * 0.5 },
      { color: 'rgba(168, 85, 247, 0.75)', freq: 0.011, speed: 1.7, amp: 46, yOffset: height * 0.52 },
      { color: 'rgba(217, 70, 239, 0.5)', freq: 0.015, speed: 2.3, amp: 34, yOffset: height * 0.48 },
      { color: 'rgba(255, 255, 255, 0.85)', freq: 0.022, speed: 2.8, amp: 22, yOffset: height * 0.5 }
    ];

    waves.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(0, w.yOffset);
      for (let x = 0; x < width; x += 3) {
        let y = Math.sin(x * w.freq + time * w.speed) * Math.cos(x * 0.003 + time) * w.amp + w.yOffset;
        
        // Mouse deformation ripple
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 45;
          y += Math.sin(dist * 0.1 - time * 4) * force;
        }

        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 14;
      ctx.shadowColor = w.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Clean, elegant harmonic spectrum indicators (No confusing technical jargon)
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px "JetBrains Mono", monospace';

    ctx.fillText(`[HARMONIC SPECTRUM // ACTIVE]`, 25, 42);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.95)';
    ctx.fillText(`MOTION: FLUID HARMONIC WAVE`, 25, 66);
    ctx.fillText(`FREQUENCY: 60 HZ REAL-TIME`, 25, 86);
    ctx.fillText(`INTERACTION: TOUCH & MOUSE SENSITIVE`, 25, 106);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(`DISPLAY: 60 FPS`, width - 155, 42);
    ctx.fillStyle = 'rgba(217, 70, 239, 0.95)';
    ctx.fillText(`MODE: ULTRAVIOLET FLOW`, width - 155, 66);
    ctx.fillText(`STATUS: SYNCHRONIZED`, width - 155, 86);

    requestAnimationFrame(drawAIStream);
  }

  drawAIStream();
}

/**
 * 9. Running Black Horse Initial Intro Loader (White Background)
 */
function initHorseIntroLoader() {
  const loader = document.getElementById('horseIntroLoader');
  if (!loader) return;

  function dismissIntro() {
    if (loader.classList.contains('fade-out')) return;
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
    }, 650);
  }

  // The black horse gallops across in 2.2s
  const autoTimer = setTimeout(dismissIntro, 2150);

  // Allow clicking anywhere to skip immediately
  loader.addEventListener('click', () => {
    clearTimeout(autoTimer);
    dismissIntro();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      clearTimeout(autoTimer);
      dismissIntro();
    }
  }, { once: true });
}
