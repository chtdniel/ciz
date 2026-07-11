const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const fadeEls = document.querySelectorAll('.fade-in');
const scrollProgress = document.getElementById('scrollProgress');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Theme toggle ── */
const themeToggle = document.getElementById('themeToggle');
const metaTheme = document.querySelector('meta[name="theme-color"]');

function syncThemeUI() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  if (metaTheme) metaTheme.setAttribute('content', isLight ? '#f7f8fa' : '#0b0c0f');
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncThemeUI();
});
syncThemeUI();

/* ── Navbar scroll state + progress bar ── */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ── Mobile nav ── */
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Active nav via scrollspy ── */
const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const sections = navAnchors
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        const active = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => spy.observe(sec));

/* ── Reveal on scroll ── */
if (reduceMotion) {
  fadeEls.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));
}

/* ── Contact form (mailto) ── */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const mailto = `mailto:hello@christiandaniel.my.id?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  window.location.href = mailto;
  contactForm.reset();
  formNote.textContent = "Thanks — your email app should open with the message ready to send.";
});

