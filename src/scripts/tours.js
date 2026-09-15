// Progressive enhancement for the Wayanad journey directory.
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
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
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

const search = document.querySelector('#tour-search');
const form = document.querySelector('#tour-search-form');
const cards = [...document.querySelectorAll('.journey-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const status = document.querySelector('#tour-status');
const emptyState = document.querySelector('.tour-empty');
const searchHelp = document.querySelector('#tour-search-help');
let interest = 'all';
document.querySelector('.tour-filters').hidden = false;

const setInterest = value => {
  interest = value;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
};
const filterTours = () => {
  const query = search.value.trim();
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  cards.forEach(card => {
    const content = `${card.textContent} ${card.dataset.keywords}`.toLocaleLowerCase();
    const categories = card.dataset.categories.split(/\s+/);
    const matches = (interest === 'all' || categories.includes(interest)) && terms.every(term => content.includes(term));
    card.hidden = !matches;
    if (matches) {
      count++;
      card.classList.add('is-visible');
    }
  });
  emptyState.hidden = count !== 0;
  status.textContent = `${interest === 'all' && !query ? 'Showing all' : 'Showing'} ${count} ${count === 1 ? 'journey' : 'journeys'}${query ? ` for “${query}”` : ''}`;
  const message = query ? `Hello Heartenza, I would like a Wayanad trip featuring: ${query}` : 'Hello Heartenza, I would like help choosing a Wayanad trip.';
  searchHelp.href = `https://wa.me/918111844058?text=${encodeURIComponent(message)}`;
};
filters.forEach(button => button.addEventListener('click', () => {
  setInterest(button.dataset.filter);
  filterTours();
}));
search.addEventListener('input', () => {
  setInterest('all');
  filterTours();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  filterTours();
  document.querySelector('#journeys-title').focus({ preventScroll: true });
  document.querySelector('#journeys').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
document.querySelector('#tour-reset').addEventListener('click', () => {
  search.value = '';
  setInterest('all');
  filterTours();
  search.focus({ preventScroll: true });
});

const incomingSearch = new URLSearchParams(window.location.search).get('q');
if (incomingSearch) {
  search.value = incomingSearch;
  filterTours();
}

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
