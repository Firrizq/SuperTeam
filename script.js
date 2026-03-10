/* =========================================
   SUPERTEAM PORTFOLIO — script.js
   ========================================= */

/* --- Theme Toggle --- */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Load saved theme or detect system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* --- Navbar scroll behavior --- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* --- Mobile hamburger menu --- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

/* --- Active nav link on scroll --- */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* --- Scroll Reveal (Intersection Observer) --- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* --- Skill bars animation --- */
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const pct = fill.getAttribute('data-pct');
      // Small delay so reveal animation plays first
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* --- Back to top button --- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* --- Contact Form Validation --- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function getField(id) {
  return document.getElementById(id);
}
function getError(id) {
  return document.getElementById(id + 'Error');
}

function setError(id, message) {
  const field = getField(id);
  const error = getError(id);
  field.classList.add('invalid');
  error.textContent = message;
}

function clearError(id) {
  const field = getField(id);
  const error = getError(id);
  field.classList.remove('invalid');
  error.textContent = '';
}

function validateField(id) {
  const field = getField(id);
  const value = field.value.trim();

  if (id === 'name') {
    if (!value) { setError('name', 'Name is required.'); return false; }
    if (value.length < 2) { setError('name', 'Name must be at least 2 characters.'); return false; }
    clearError('name'); return true;
  }

  if (id === 'email') {
    if (!value) { setError('email', 'Email address is required.'); return false; }
    if (!EMAIL_REGEX.test(value)) { setError('email', 'Please enter a valid email address.'); return false; }
    clearError('email'); return true;
  }

  if (id === 'subject') {
    if (!value) { setError('subject', 'Subject is required.'); return false; }
    if (value.length < 3) { setError('subject', 'Subject is too short.'); return false; }
    clearError('subject'); return true;
  }

  if (id === 'message') {
    if (!value) { setError('message', 'Message is required.'); return false; }
    if (value.length < 10) { setError('message', 'Message must be at least 10 characters.'); return false; }
    clearError('message'); return true;
  }

  return true;
}

// Live validation on blur
['name', 'email', 'subject', 'message'].forEach(id => {
  const field = getField(id);
  field.addEventListener('blur', () => validateField(id));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(id);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fields = ['name', 'email', 'subject', 'message'];
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) return;

  // Simulate sending (replace with real fetch to your backend/service)
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';

  await new Promise(resolve => setTimeout(resolve, 1400));

  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').textContent = 'Send Message';
  form.reset();
  fields.forEach(id => clearError(id));
  formSuccess.classList.remove('hidden');

  setTimeout(() => formSuccess.classList.add('hidden'), 6000);
});

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// initialize EmailJS
(function () {
  emailjs.init("RAvArmQ1Z0CGvIp_E");
})();

const formEmail = document.getElementById("contactForm");
const successMessageEmail = document.getElementById("formSuccess");
const submitBtnEmail = document.getElementById("submitBtn");

formEmail.addEventListener("submit", function (e) {

  e.preventDefault();

  submitBtnEmail.disabled = true;

  emailjs.sendForm(
    "service_ynocq8o",
    "template_qvt49xw",
    this
  )
  .then(() => {

    successMessageEmail.classList.remove("hidden");
    formEmail.reset();
    submitBtnEmail.disabled = false;

  })
  .catch((error) => {

    console.log(error);
    alert("Failed to send message");

    submitBtnEmail.disabled = false;
  });

});