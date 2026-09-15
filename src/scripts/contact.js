const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const siteHeader = document.querySelector('.site-header');
const mobileQuery = window.matchMedia('(max-width: 900px)');

document.body.classList.add('nav-enhanced');

function closeMenu() {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.menu-label').textContent = 'Menu';
  primaryNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuButton && primaryNav) {
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.querySelector('.menu-label').textContent = opening ? 'Close' : 'Menu';
    primaryNav.classList.toggle('is-open', opening);
    document.body.classList.toggle('menu-open', opening);
  });
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (siteHeader && !siteHeader.contains(event.target)) closeMenu();
  });
  mobileQuery.addEventListener('change', closeMenu);
}

function updateHeader() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const serviceSelect = document.querySelector('#service');
const formTitle = document.querySelector('#form-title');
const serviceLabels = {
  'travel-tour-packages': 'Travel & tour packages',
  'driver-services': 'Driver services',
  'house-maintenance': 'House maintenance',
  'vehicle-maintenance': 'Vehicle maintenance',
  'delivery-errands': 'Delivery & errands',
  'elderly-companion-services': 'Elderly companion services',
  'medical-assistance': 'Medical assistance',
  'gifts-special-occasions': 'Gifts & special occasions',
  other: 'Other or not sure'
};
const serviceAliases = {
  tour: 'travel-tour-packages', tours: 'travel-tour-packages', travel: 'travel-tour-packages', 'travel-tour-packages': 'travel-tour-packages',
  driver: 'driver-services', 'professional-driver-services': 'driver-services', 'driver-services': 'driver-services',
  house: 'house-maintenance', 'house-maintenance': 'house-maintenance',
  vehicle: 'vehicle-maintenance', 'vehicle-maintenance': 'vehicle-maintenance',
  delivery: 'delivery-errands', 'delivery-and-errands': 'delivery-errands', 'delivery-errands': 'delivery-errands',
  'elderly-companion': 'elderly-companion-services', 'elderly-companion-services': 'elderly-companion-services',
  medical: 'medical-assistance', 'medical-assistance': 'medical-assistance',
  gifts: 'gifts-special-occasions', 'gifts-occasions': 'gifts-special-occasions', 'gifts-special-occasions': 'gifts-special-occasions',
  general: 'other', other: 'other'
};

function updateFormTitle() {
  const label = serviceLabels[serviceSelect?.value];
  if (formTitle) formTitle.textContent = label ? `Enquiry for ${label}` : 'How can we help?';
}

if (serviceSelect) {
  const requested = new URLSearchParams(window.location.search).get('service')?.trim().toLowerCase();
  if (requested && serviceAliases[requested]) serviceSelect.value = serviceAliases[requested];
  updateFormTitle();
  serviceSelect.addEventListener('change', updateFormTitle);
}

const preferredDate = document.querySelector('#preferred-date');
if (preferredDate) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  preferredDate.min = today.toISOString().slice(0, 10);
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = '';
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formStatus.textContent = 'Please complete the required fields before continuing.';
      return;
    }

    const data = new FormData(contactForm);
    const lines = [
      'Hello Heartenza,', '', 'New website enquiry', '',
      `Name: ${data.get('fullName')}`,
      `Phone: ${data.get('phone')}`,
      data.get('email') ? `Email: ${data.get('email')}` : null,
      `Service: ${serviceLabels[data.get('service')] || 'Other enquiry'}`,
      `Service location: ${data.get('location')}`,
      data.get('preferredDate') ? `Preferred date: ${data.get('preferredDate')}` : null,
      '', 'Details:', data.get('message'), '',
      'Please contact me to discuss availability, next steps and a personalised quote.'
    ].filter((line) => line !== null);

    window.open(`https://wa.me/918111844058?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
    formStatus.textContent = 'Your enquiry has been prepared in WhatsApp. Review it there, then tap send.';
  });
}
