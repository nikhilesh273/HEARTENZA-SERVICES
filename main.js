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
      waLink.href = `https://wa.me/918111844058?text=${message}`;
    }
  };

  // Run only on tour-details.html
  if (window.location.pathname.includes('tour-details.html')) {
    renderTourDetails();
  }

  // --- BOOKING MODAL LOGIC ---
  const bookingModal = document.getElementById('bookingModal');
  const modalTriggers = document.querySelectorAll('.trigger-booking-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const bookingForm = document.getElementById('bookingForm');

  if (bookingModal && modalTriggers) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
      });
    });

    const closeModal = () => {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        // Don't toggle if clicking the checkbox directly
        if (e.target.type === 'checkbox' || e.target.classList.contains('checkmark')) return;
        
        const item = header.parentElement;
        item.classList.toggle('active');
      });
    });

    // Auto-select places logic
    const destCheckboxes = document.querySelectorAll('.dest-checkbox');
    destCheckboxes.forEach(destCb => {
      destCb.addEventListener('change', () => {
        const parentItem = destCb.closest('.accordion-item');
        const placeCheckboxes = parentItem.querySelectorAll('input[name="places"]');
        placeCheckboxes.forEach(placeCb => {
          placeCb.checked = destCb.checked;
        });
      });
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data
      const formData = new FormData(bookingForm);
      const name = formData.get('fullName');
      const email = formData.get('email');
      const city = formData.get('city');
      const country = formData.get('country');
      const startDate = formData.get('startDate');
      const endDate = formData.get('endDate');
      const category = formData.get('category');
      const budget = formData.get('budget');
      
      // Handle checkbox destinations & places grouped
      let destinationsSummary = "";
      const accordionItems = document.querySelectorAll('.accordion-item');
      
      accordionItems.forEach(item => {
        const destCheckbox = item.querySelector('.dest-checkbox');
        const placeCheckboxes = item.querySelectorAll('input[name="places"]:checked');
        
        if (destCheckbox.checked || placeCheckboxes.length > 0) {
          const destName = destCheckbox.value;
          const placeNames = Array.from(placeCheckboxes).map(cb => cb.value).join(', ');
          
          destinationsSummary += `\n      - ${destName} : ${placeNames || 'All Places'}`;
        }
      });

      if (!destinationsSummary) {
        alert('Please select at least one destination or place.');
        return;
      }

      // Format message
      const message = `Hello, I would like to book a tour:

*Name:* ${name}  
*Email:* ${email}  
*Location:* ${city}, ${country}  

*Destinations:* ${destinationsSummary}

*Travel Dates:* ${startDate} to ${endDate}  

*Travel Type:* ${category}  
*Budget:* ${budget}  

Please assist me with the booking.`;

      // Encode and open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/918111844058?text=${encodedMessage}`;
      
      window.open(whatsappURL, '_blank');
      
      // Close modal after submission
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      bookingForm.reset();
    });
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

