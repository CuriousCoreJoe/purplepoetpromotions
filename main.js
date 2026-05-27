/* ============================================
   PURPLE POET PROMOTIONS — MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = ['home', 'about', 'events', 'contact'];
  const scrollPos = window.scrollY + 100;

  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el || !link) return;

    if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ===== HERO PARTICLES =====
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎤', '🎸', '🎹', '🎺'];
  const count = window.innerWidth < 600 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.classList.add('particle');
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(p);
  }
}

// ===== INDIVIDUAL EVENT CAROUSEL =====
function initSingleEventCarousel() {
  const cWrap = document.querySelector('.single-event-carousel-wrap');
  if (!cWrap) return;
  
  const container = document.getElementById('single-event-carousel');
  const slides = container.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('single-prev');
  const nextBtn = document.getElementById('single-next');
  
  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }
  
  let currentSingleSlide = 0;
  
  function updateSingleCarousel() {
    slides.forEach((sl, index) => {
      sl.classList.remove('active-slide');
      if (index === currentSingleSlide) {
        sl.classList.add('active-slide');
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSingleSlide = (currentSingleSlide - 1 + slides.length) % slides.length;
      updateSingleCarousel();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSingleSlide = (currentSingleSlide + 1) % slides.length;
      updateSingleCarousel();
    });
  }
  
  // Auto scroll every 5 seconds
  setInterval(() => {
    currentSingleSlide = (currentSingleSlide + 1) % slides.length;
    updateSingleCarousel();
  }, 5000);
}

// ===== EVENTS TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// ===== PAST EVENTS GALLERY CAROUSEL =====
let currentSlide = 0;
const slides = document.querySelectorAll('.past-event-row:not(.disabled)');
const totalSlides = slides.length;

function showSlide(index) {
  if (totalSlides === 0) return;
  
  slides.forEach(slide => {
    slide.style.display = 'none';
    slide.classList.remove('active-slide');
  });
  
  slides[index].style.display = 'flex';
  slides[index].classList.add('active-slide');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Initialize gallery if it exists
const pastEventsList = document.querySelector('.past-events-list');
if (pastEventsList && slides.length > 0) {
  // Hide disabled placeholders
  document.querySelectorAll('.past-event-row.disabled').forEach(el => {
    el.style.display = 'none';
  });

  // Setup carousel container
  pastEventsList.style.position = 'relative';
  
  // Add controls
  if (totalSlides > 1) {
    const controlsHtml = `
      <div class="gallery-controls" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
        <button class="btn btn-outline-purple btn-sm" id="prev-slide" onclick="prevSlide()"><i class="fas fa-chevron-left"></i> Prev</button>
        <button class="btn btn-outline-purple btn-sm" id="next-slide" onclick="nextSlide()">Next <i class="fas fa-chevron-right"></i></button>
      </div>
    `;
    pastEventsList.insertAdjacentHTML('afterend', controlsHtml);
    
    // Auto scroll every 5 seconds
    setInterval(nextSlide, 5000);
  }
  
  // Expose globally for inline onclick handlers if needed
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  
  // Show first slide
  showSlide(0);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.service-card, .event-card, .about-card, .gallery-item, .contact-info-item, .form-card'
  );

  elements.forEach(el => el.classList.add('fade-in-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ===== LIGHTBOX =====
function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');

  const img = item.querySelector('img');
  if (img) {
    content.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Event photo'}" />`;
  } else {
    content.innerHTML = `
      <div style="text-align:center; color: rgba(255,255,255,0.5); padding: 60px;">
        <i class="fas fa-image" style="font-size:4rem; display:block; margin-bottom:16px;"></i>
        <p>Add your event photos here!</p>
      </div>`;
  }

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
  // RFC 5322 compliant email validation with additional checks
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false; // RFC 5321 max length
  // Standard email format + reject common disposable patterns
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return false;
  // Reject obviously fake/temporary domains
  const blockedDomains = ['example.com', 'test.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com', 'sharklasers.com', 'trashmail.com'];
  const domain = trimmed.split('@')[1]?.toLowerCase();
  if (!domain || blockedDomains.includes(domain)) return false;
  return true;
}

function setFieldError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;
  const errorSpan = group.querySelector('.field-error');
  input.classList.add('error');
  if (errorSpan) errorSpan.textContent = message;
}

function clearFieldError(input) {
  const group = input.closest('.form-group');
  if (!group) return;
  const errorSpan = group.querySelector('.field-error');
  input.classList.remove('error');
  if (errorSpan) errorSpan.textContent = '';
}

function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    clearFieldError(field);
    const val = field.value.trim();

    if (!val) {
      setFieldError(field, 'This field is required.');
      valid = false;
    } else if (field.type === 'email' && !validateEmail(val)) {
      setFieldError(field, 'Please enter a valid email address.');
      valid = false;
    }
  });

  return valid;
}

// Phone Number Formatting (US format: (XXX) XXX-XXXX)
function formatPhoneNumber(value) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

// Live validation clearing & input formatting
document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', (e) => {
    if (field.classList.contains('error')) {
      clearFieldError(field);
    }

    if (field.type === 'tel') {
      const formattedNumber = formatPhoneNumber(field.value);
      field.value = formattedNumber;
    }
  });
});

// ===== reCAPTCHA CONFIGURATION =====
// Replace this with your actual reCAPTCHA v3 site key from https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = '6Lf_qf4sAAAAACsxedI6Yk2Tmvyid5maVx1FNDZt';

async function getRecaptchaToken(action) {
  return new Promise((resolve, reject) => {
    if (typeof grecaptcha === 'undefined' || !grecaptcha.execute) {
      console.warn('reCAPTCHA not loaded — proceeding without token');
      resolve('');
      return;
    }
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        .then(token => resolve(token))
        .catch(err => {
          console.error('reCAPTCHA error:', err);
          resolve(''); // Fallback: proceed without token
        });
    });
  });
}

// ===== ARTIST INQUIRY FORM =====
const artistForm = document.getElementById('artist-inquiry-form');
const artistSubmit = document.getElementById('artist-submit');
const artistSuccess = document.getElementById('artist-success');

artistForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm(artistForm)) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  artistSubmit.classList.add('loading');
  artistSubmit.disabled = true;

  const data = {
    name: artistForm.querySelector('[name="name"]').value.trim(),
    email: artistForm.querySelector('[name="email"]').value.trim(),
    phone: artistForm.querySelector('[name="phone"]').value.trim(),
    talent_type: artistForm.querySelector('[name="talent_type"]').value,
    epk_links: artistForm.querySelector('[name="epk_links"]').value.trim(),
    message: artistForm.querySelector('[name="message"]').value.trim(),
    status: 'New'
  };

  try {
    // Generate reCAPTCHA token
    const token = await getRecaptchaToken('artist_form_submit');
    document.getElementById('artist-recaptcha-token').value = token;

    const formData = new FormData();
    formData.append('form_type', 'artist_inquiry');
    formData.append('recaptcha_token', token);
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch('submit_form.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    artistForm.style.display = 'none';
    artistSuccess.classList.add('show');
    showToast('Artist inquiry submitted! We\'ll be in touch. 🎤');

  } catch (err) {
    console.error('Artist form error:', err);
    showToast('Something went wrong. Please try again or reach us on Facebook.', 'error');
    artistSubmit.classList.remove('loading');
    artistSubmit.disabled = false;
  }
});

// ===== VENUE INQUIRY FORM =====
const venueForm = document.getElementById('venue-inquiry-form');
const venueSubmit = document.getElementById('venue-submit');
const venueSuccess = document.getElementById('venue-success');

venueForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm(venueForm)) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  venueSubmit.classList.add('loading');
  venueSubmit.disabled = true;

  const data = {
    name: venueForm.querySelector('[name="name"]').value.trim(),
    email: venueForm.querySelector('[name="email"]').value.trim(),
    phone: venueForm.querySelector('[name="phone"]').value.trim(),
    venue_name: venueForm.querySelector('[name="venue_name"]').value.trim(),
    event_date: venueForm.querySelector('[name="event_date"]').value.trim(),
    event_details: venueForm.querySelector('[name="event_details"]').value.trim(),
    budget: venueForm.querySelector('[name="budget"]').value.trim(),
    status: 'New'
  };

  try {
    // Generate reCAPTCHA token
    const token = await getRecaptchaToken('venue_form_submit');
    document.getElementById('venue-recaptcha-token').value = token;

    const formData = new FormData();
    formData.append('form_type', 'venue_inquiry');
    formData.append('recaptcha_token', token);
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch('submit_form.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    venueForm.style.display = 'none';
    venueSuccess.classList.add('show');
    showToast('Venue inquiry submitted! Let\'s make it happen! 🎉');

  } catch (err) {
    console.error('Venue form error:', err);
    showToast('Something went wrong. Please try again or reach us on Facebook.', 'error');
    venueSubmit.classList.remove('loading');
    venueSubmit.disabled = false;
  }
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== SMOOTH SCROLL OFFSET (for fixed navbar) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollAnimations();
  updateActiveNavLink();
  initSingleEventCarousel();
});
