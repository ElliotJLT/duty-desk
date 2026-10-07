// Points every "Talk to Elliot" link at the booking page, or LinkedIn until one exists.
import { BOOKING_URL, LINKEDIN_URL } from './config.js';

const href = BOOKING_URL || LINKEDIN_URL;
document.querySelectorAll('[data-talk]').forEach((a) => {
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
});
