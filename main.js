import './style.css';
import { tourData } from './tours-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- EXISTING LOGIC ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  fadeElements.forEach(el => appearOnScroll.observe(el));

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
  }

  // --- DYNAMIC TOUR DETAILS LOGIC ---
  const renderTourDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tourKey = urlParams.get('tour');
    const data = tourData[tourKey];

    if (!data) return; // Fallback to default static HTML if no key

    // Update Header
    const headerTitle = document.querySelector('.page-header h1');
    const headerSubtitle = document.querySelector('.header-subtitle');
    const headerHero = document.querySelector('.page-header');
    
    if (headerTitle) headerTitle.textContent = data.title;
    if (headerSubtitle) headerSubtitle.textContent = data.subtitle;
    if (headerHero) headerHero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${data.heroImg}')`;

    // Update Overview Description
    const overviewDesc = document.querySelector('.tour-overview-text');
    if (overviewDesc) overviewDesc.textContent = data.description;

    // Update Destinations Grid
    const placesGrid = document.querySelector('.places-list');
    if (placesGrid) {
      placesGrid.innerHTML = data.places.map(place => `
        <div class="place-premium-card fade-in">
          <div class="place-img">
            <img src="${place.img}" alt="${place.name}">
          </div>
          <div class="place-info">
            <h4>${place.name}</h4>
            <p>${place.desc}</p>
          </div>
        </div>
      `).join('');
      
      // Re-observe new elements for fade-in
      const newFadeElements = placesGrid.querySelectorAll('.fade-in');
      newFadeElements.forEach(el => appearOnScroll.observe(el));
    }

    // Update WhatsApp Link
    const waLink = document.querySelector('.wa-booking-btn');
    if (waLink) {
      const message = encodeURIComponent(`Hi Heartenza Services! I am interested in booking the ${data.title} package.`);
      waLink.href = `https://wa.me/1234567890?text=${message}`;
    }
  };

  // Run only on tour-details.html
  if (window.location.pathname.includes('tour-details.html')) {
    renderTourDetails();
  }

  // Hide Loader on Window Load
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 500); // Small delay for premium feel
    }
  });
});
