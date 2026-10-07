// Shared top nav: marks the current tab and wires the booking buttons.
import { BOOKING_URL, LINKEDIN_URL } from './config.js';

const page = document.body.dataset.page;
document.querySelectorAll('.topnav a[data-tab]').forEach((a) => {
  if (a.dataset.tab === page) a.setAttribute('aria-current', 'page');
});
document.querySelectorAll('[data-book]').forEach((el) => {
  if (BOOKING_URL || LINKEDIN_URL) {
    el.href = BOOKING_URL || LINKEDIN_URL;
    el.target = '_blank';
    el.rel = 'noopener';
  } else {
    el.hidden = true;
  }
});

