// The simulation: one day at a time, the story on the left, the board on the right.
// Every number and status comes from the engine at the last event of that day.
import { scenario } from './scenario.js';
import { buildRoom } from './engine.js';
import { DAYS, statusOf, fillDay } from './board-model.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stepOf = (id) => scenario.events.findIndex((e) => e.id === id) + 1;
const ev = (id) => scenario.events.find((e) => e.id === id);
const ORDER = ['late', 'needs', 'ask', 'watch', 'onway', 'with'];
const rooms = DAYS.map((d) => buildRoom(scenario, stepOf(d.at)));

let day = 0;

function render() {
  const d = DAYS[day];
  const room = rooms[day];

  $('days').innerHTML = DAYS.map((x, i) => `<button role="tab" aria-selected="${i === day}" class="step${i === day ? ' on' : ''}${i < day ? ' done' : ''}" data-day="${i}"><span>${i + 1}</span>${esc(x.label.split(' ')[0])}</button>`).join('');
  $('day-title').innerHTML = `<span>${esc(d.label)} April</span>${esc(d.title)}`;
  $('news').innerHTML = d.news.length
    ? d.news.map((id) => { const e = ev(id); return `${esc(e.text)} <a href="${esc(e.source.url)}" target="_blank" rel="noopener">${esc(e.source.label)}</a>`; }).join('<br><br>')
    : esc(d.quiet);
  $('desk').textContent = fillDay(d.desk, room, day ? rooms[day - 1] : null);
  $('without').textContent = d.without;

  const waiting = room.decisions.filter((x) => x.status === 'waiting').length + room.drafts.filter((x) => x.status === 'waiting').length;
  const tiles = [
    { n: room.open.length, label: 'not yet accounted for', lead: true, tone: room.open.some((g) => g.escalated) ? 'bad' : room.open.length ? 'warn' : 'ok' },
    { n: `${room.counts.withGroup}/${room.counts.affected}`, label: 'on affected flights, now with their group' },
    { n: waiting, label: 'waiting for a person to approve' },
  ];
  $('tiles').innerHTML = tiles.map((t) => `<div class="tile${t.lead ? ` lead ${t.tone}` : ''}"><b>${esc(t.n)}</b><span>${esc(t.label)}</span></div>`).join('');

  $('trips').innerHTML = scenario.trips.map((t) => {
    const gs = room.guests.filter((g) => g.trip === t.id).map((g) => ({ g, s: statusOf(g) }));
    const shown = gs.filter((x) => x.s.key !== 'clear').sort((a, b) => ORDER.indexOf(a.s.key) - ORDER.indexOf(b.s.key));
    const clear = gs.length - shown.length;
    return `<article class="trip-card">
      <header><b>${esc(t.trip)}</b><span>${shown.length ? `${shown.length} to watch` : 'nobody affected'}</span></header>
      ${shown.length ? `<ul>${shown.map(({ g, s }) => `<li class="g ${s.tone}"><span class="ico" aria-hidden="true">${s.icon}</span><b>${esc(g.name)}</b><span class="lbl">${esc(s.label)}</span></li>`).join('')}</ul>` : ''}
      ${clear ? `<p class="clear-n">${shown.length ? `+ ${clear} not affected` : `${clear} guests, all fine`}</p>` : ''}
    </article>`;
  }).join('');

  $('prev').disabled = day === 0;
  $('next').textContent = day === DAYS.length - 1 ? 'Start again ↺' : `Next: ${DAYS[day + 1].label.split(' ')[0]} →`;
}

function go(i) { day = (i + DAYS.length) % DAYS.length; render(); }
$('next').addEventListener('click', () => go(day === DAYS.length - 1 ? 0 : day + 1));
$('prev').addEventListener('click', () => go(Math.max(0, day - 1)));
$('days').addEventListener('click', (e) => { const b = e.target.closest('[data-day]'); if (b) go(Number(b.dataset.day)); });
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if (e.key === 'ArrowRight') go(Math.min(DAYS.length - 1, day + 1));
  if (e.key === 'ArrowLeft') go(Math.max(0, day - 1));
});
const q = Number(new URLSearchParams(location.search).get('day'));
day = q >= 1 && q <= DAYS.length ? q - 1 : 0;
render();
