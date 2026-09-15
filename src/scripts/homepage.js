// Homepage interactions are independent of the older internal-page scripts.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobile = window.matchMedia('(max-width: 900px)');

document.body.classList.add('nav-enhanced');
const setMenu = (open, returnFocus = false) => {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('is-open', open);
  if (returnFocus) menuButton.focus();
};
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenu(false);
});
header.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    if (!header.contains(document.activeElement)) setMenu(false);
  });
});
mobile.addEventListener('change', () => setMenu(false));
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Filter existing HTML cards so every permanent service URL remains crawlable.
const search = document.querySelector('#service-search');
const searchForm = document.querySelector('#service-finder-form');
const cards = [...document.querySelectorAll('.home-service')];
const filters = [...document.querySelectorAll('[data-filter]')];
const emptyState = document.querySelector('.no-results');
const resultStatus = document.querySelector('#service-results');
let category = 'all';
document.querySelector('.service-filters').hidden = false;

const filterServices = () => {
  const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach((card) => {
    const content = `${card.textContent} ${card.dataset.keywords}`.toLowerCase();
    const visible = (category === 'all' || card.dataset.category === category) && terms.every((term) => content.includes(term));
    card.hidden = !visible;
    if (visible) count++;
  });
  emptyState.hidden = count !== 0;
  resultStatus.textContent = `${count} ${count === 1 ? 'service' : 'services'} found${search.value.trim() ? ` for “${search.value.trim()}”` : ''}.`;
  const message = search.value.trim() ? `Hello Heartenza, I need help with: ${search.value.trim()}` : 'Hello Heartenza, can you help me find the right service?';
  document.querySelector('#search-help').href = `https://wa.me/918111844058?text=${encodeURIComponent(message)}`;
};
const setCategory = (value) => {
  category = value;
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
};
filters.forEach((button) => button.addEventListener('click', () => {
  setCategory(button.dataset.filter);
  filterServices();
}));
search.addEventListener('input', () => {
  setCategory('all');
  filterServices();
});
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterServices();
  const title = document.querySelector('#services-title');
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
  document.querySelector('#services-find').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
document.querySelector('#reset-services').addEventListener('click', () => {
  search.value = '';
  setCategory('all');
  filterServices();
  filters[0].focus();
});

// Brief scroll reveals; content remains visible if scripts or observers fail.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      revealObserver.disconnect();
      document.querySelectorAll('.reveal-pending').forEach((element) => element.classList.add('is-visible'));
    }
  });
}

// Accessible destination carousel: swipe, keyboard scroll, arrows and pause.
const track = document.querySelector('#travel-track');
const carousel = document.querySelector('.travel-carousel');
const toggle = document.querySelector('#travel-toggle');
document.querySelector('.carousel-controls').hidden = false;
let autoplay = !reducedMotion.matches;
let inView = false;
let hovering = false;
let focused = false;
let timer;

const step = () => {
  const [first, second] = track.children;
  return second.offsetLeft - first.offsetLeft;
};
const advance = (direction) => {
  const max = track.scrollWidth - track.clientWidth;
  if (max <= 0) return;
  let next = track.scrollLeft + direction * step();
  if (direction > 0 && track.scrollLeft >= max - 4) next = 0;
  if (direction < 0 && track.scrollLeft <= 4) next = max;
  track.scrollTo({ left: Math.max(0, Math.min(max, next)), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
};
const schedule = () => {
  window.clearInterval(timer);
  if (autoplay && inView && !hovering && !focused && !document.hidden) timer = window.setInterval(() => advance(1), 5000);
};
const updateToggle = () => {
  toggle.setAttribute('aria-label', autoplay ? 'Pause automatic sliding' : 'Start automatic sliding');
  toggle.setAttribute('aria-pressed', String(autoplay));
  toggle.querySelector('use').setAttribute('href', `/assets/icons/home-icons.svg#${autoplay ? 'pause' : 'play'}`);
  schedule();
};
toggle.addEventListener('click', () => {
  autoplay = !autoplay;
  updateToggle();
});
[['#travel-prev', -1], ['#travel-next', 1]].forEach(([selector, direction]) => {
  document.querySelector(selector).addEventListener('click', () => {
    autoplay = false;
    updateToggle();
    advance(direction);
  });
});
const stopForInteraction = () => { autoplay = false; updateToggle(); };
track.addEventListener('pointerdown', stopForInteraction, { passive: true });
track.addEventListener('wheel', stopForInteraction, { passive: true });
track.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) stopForInteraction();
});
carousel.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') { hovering = true; schedule(); }
});
carousel.addEventListener('pointerleave', () => { hovering = false; schedule(); });
carousel.addEventListener('focusin', () => { focused = true; schedule(); });
carousel.addEventListener('focusout', () => {
  requestAnimationFrame(() => { focused = carousel.contains(document.activeElement); schedule(); });
});
document.addEventListener('visibilitychange', schedule);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) autoplay = false;
  updateToggle();
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule(); }, { threshold: 0.1 }).observe(track);
}
updateToggle();
