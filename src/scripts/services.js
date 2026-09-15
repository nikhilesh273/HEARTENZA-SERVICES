// Progressive enhancement: the full service directory works without JavaScript.
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

const search = document.querySelector('#directory-search');
const form = document.querySelector('#directory-search-form');
const cards = [...document.querySelectorAll('.directory-service')];
const filters = [...document.querySelectorAll('[data-filter]')];
const status = document.querySelector('#directory-status');
const emptyState = document.querySelector('.directory-empty');
const searchHelp = document.querySelector('#directory-search-help');
let category = 'all';
document.querySelector('.service-filters').hidden = false;

const setCategory = (value) => {
  category = value;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
};
const filterServices = () => {
  const query = search.value.trim();
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach(card => {
    const content = `${card.textContent} ${card.dataset.keywords}`.toLocaleLowerCase();
    const matches = (category === 'all' || card.dataset.category === category) && terms.every(term => content.includes(term));
    card.hidden = !matches;
    if (matches) {
      count++;
      // Filtering must never leave matching content behind a reveal animation.
      card.classList.add('is-visible');
    }
  });
  emptyState.hidden = count !== 0;
  status.textContent = `${category === 'all' && !query ? 'Showing all' : 'Showing'} ${count} ${count === 1 ? 'service' : 'services'}${query ? ` for “${query}”` : ''}`;
  const message = query ? `Hello Heartenza, I need help with: ${query}` : 'Hello Heartenza, can you help me find the right service?';
  searchHelp.href = `https://wa.me/918111844058?text=${encodeURIComponent(message)}`;
};
filters.forEach(button => button.addEventListener('click', () => {
  setCategory(button.dataset.filter);
  filterServices();
}));
search.addEventListener('input', () => {
  setCategory('all');
  filterServices();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  filterServices();
  document.querySelector('#directory-title').focus({ preventScroll: true });
  document.querySelector('#all-services').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
document.querySelector('#directory-reset').addEventListener('click', () => {
  search.value = '';
  setCategory('all');
  filterServices();
  search.focus({ preventScroll: true });
});

// Honour search links from the homepage and older service-section bookmarks.
const incomingSearch = new URLSearchParams(window.location.search).get('q');
if (incomingSearch) {
  search.value = incomingSearch;
  filterServices();
}
const revealHashTarget = () => {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target?.matches('.directory-service')) return;
  search.value = '';
  setCategory('all');
  filterServices();
  requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
};
window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-pending');
    observer.observe(element);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal-pending').forEach(element => element.classList.add('is-visible'));
    }
  });
}
