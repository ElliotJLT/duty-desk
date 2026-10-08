import { scenario } from './scenario.js';
import { buildRoom, fmt } from './engine.js';
import { moments, people } from './story.js';
import { fill } from './story-fill.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stepOf = (id) => scenario.events.findIndex((e) => e.id === id) + 1;
const eventOf = (id) => scenario.events.find((e) => e.id === id);
const team = scenario.operator.team;
const hhmm = (t) => t.slice(11, 16);

// One beat per message, plus a closing beat per moment for its end card.
const beats = moments.flatMap((m, mi) => [...m.messages.map((msg) => ({ mi, msg })), { mi, end: true }]);
let pos = 0;
let timer = null;

const rich = (text) => esc(text)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/@(Hannah|Sam|Nadia)/g, '<span class="at">@$1</span>');

function head(msg) {
  const time = `<time>${esc(msg.time.replace(/^[A-Z][a-z]{2} /, ''))}</time>`;
  if (msg.kind === 'news') return ['<i class="av sq news-sq" aria-hidden="true"></i>', `<b>News feed</b><span class="apptag">APP</span>${time}`];
  if (msg.kind === 'desk') return ['<i class="av sq desk-sq" aria-hidden="true"></i>', `<b>Duty desk</b><span class="apptag">APP</span>${time}`];
  if (msg.kind === 'external') return [`<i class="av wa" aria-hidden="true">${esc(msg.from[0])}</i>`, `<b>${esc(msg.from)}</b><span class="via">via ${esc(msg.via)}</span>${time}`];
  const p = people[msg.who];
  return [`<i class="av" style="background:${p.colour}" aria-hidden="true">${p.name[0]}</i>`, `<b>${p.name}</b><span class="role">${p.role}</span>${time}`];
}

function body(msg, own, now) {
  if (msg.kind === 'news') {
    return `<a class="card news" href="${esc(msg.url)}" target="_blank" rel="noopener"><span class="src">${esc(msg.source)} · real source</span><b>${esc(msg.headline)}</b>${msg.sub ? `<span>${esc(msg.sub)}</span>` : ''}</a>`;
  }
  if (msg.kind === 'command') return `<p class="cmd">${esc(msg.text)}</p>`;
  if (msg.kind === 'external') return `<p class="bubble">${esc(msg.text)}</p>`;
  let html = `<p>${rich(fill(msg.text, own))}</p>`;
  if (msg.rows) {
    html += `<ul class="rows">${msg.rows.map(([s, a, b]) => `<li class="${s}"><i aria-hidden="true"></i><b>${esc(a)}</b><span>${rich(b)}</span></li>`).join('')}</ul>`;
  }
  if (msg.draft) {
    const d = now.drafts.find((x) => x.id === msg.draft);
    const state = d.status === 'approved' ? `Approved by Hannah · ${hhmm(d.approvedAt)}` : 'Waiting for Hannah';
    html += `<div class="card draft"><span class="src">Draft to ${esc(d.to)} · ${state}</span><p>${esc(d.text)}</p><span class="basis">Why: ${esc(d.basis)}.</span></div>`;
  }
  if (msg.actions) {
    html += msg.actions.map((a) => {
      const d = now.decisions.find((x) => x.id === a.decision);
      const owner = team[d.owner].name;
      const done = d.status === 'done';
      return `<div class="block"><span class="for">For ${owner}</span><p>${esc(a.ask)}</p>${done
        ? `<div class="acted">✓ ${owner} ${a.label.startsWith('Send') ? 'sent it' : 'approved'} · ${hhmm(d.at)}</div>`
        : `<div class="actions"><button class="act" data-next>${esc(a.label)}</button><button class="act ghost" disabled>Not now</button></div>`}</div>`;
    }).join('');
  }
  if (msg.after) html += `<p>${rich(fill(msg.after, own))}</p>`;
  return html;
}

function pane(room) {
  const trips = scenario.trips.filter((t) => room.open.some((g) => g.trip === t.id));
  const dot = (on, label) => `<i class="${on ? 'on' : ''}" title="${label}: ${on ? 'confirmed' : 'not yet'}"></i>`;
  const groups = trips.map((t) => {
    const rows = room.open.filter((g) => g.trip === t.id).map((g) => {
      const status = g.risk === 'unknown' ? 'no travel details'
        : g.cancelled ? g.newArrival.split(', ')[1]
          : `${g.travel.flight} Thu`;
      return `<li class="row${g.escalated ? ' late' : ''}"><b>${esc(g.name)}</b><span class="meta">${esc(status)}</span>${g.escalated && !g.cancelled ? '<span class="dots late-tag">overdue</span>' : g.cancelled
        ? `<span class="dots" aria-label="New flight, pickup, with group">${dot(g.steps.arrival, 'New flight')}${dot(g.steps.transfer, 'Pickup')}${dot(g.steps.joined, 'With group')}</span>`
        : '<span class="dots watch">watching</span>'}</li>`;
    }).join('');
    return `<div class="trip"><p class="trip-h">${esc(t.trip)}</p><ul class="open">${rows}</ul></div>`;
  }).join('');
  const tasks = room.tasks.filter((x) => !x.done && !x.guest);
  const waiting = room.decisions.filter((d) => d.status === 'waiting').length + room.drafts.filter((d) => d.status === 'waiting').length;
  const out = groups
    + (tasks.length ? `<div class="trip"><p class="trip-h">To do</p><ul class="open">${tasks.map((x) => `<li class="${x.escalated ? 'late' : ''}"><b>${esc(x.title)}</b><span class="meta">${esc(team[x.owner].name)}</span></li>`).join('')}</ul></div>` : '')
    + (waiting ? `<p class="waiting">${waiting} waiting for Sam or Hannah to approve</p>` : '');
  return out || '<p class="none">Nothing open.</p>';
}

function render() {
  const shown = beats.slice(0, pos);
  const msgs = shown.filter((b) => !b.end).map((b) => b.msg);
  const last = msgs[msgs.length - 1];
  const now = buildRoom(scenario, last ? stepOf(last.at) : 0);
  const current = pos === 0 ? 0 : beats[pos - 1].mi;
  const m = moments[current];

  $('moments').innerHTML = moments.map((x, i) => `<button class="mo${i === current ? ' on' : ''}${i < current ? ' done' : ''}" data-mo="${i}" aria-current="${i === current}">${esc(x.label)}</button>`).join('<span class="sep" aria-hidden="true"></span>');
  $('context').innerHTML = `<b>${esc(m.title)}</b> ${esc(m.description)}`;

  const cache = {};
  const own = (id) => cache[id] || (cache[id] = buildRoom(scenario, stepOf(id)));
  const html = [];
  let lastDay = '';
  msgs.forEach((msg, i) => {
    const day = fmt(eventOf(msg.at).t).replace(/ \d\d:\d\d$/, '');
    if (day !== lastDay) { html.push(`<li class="day"><span>${esc(day)}</span></li>`); lastDay = day; }
    const [av, h] = head(msg);
    html.push(`<li class="m${msg.thread ? ' thread' : ''}${msg.kind === 'external' ? ' ext' : ''}${i === msgs.length - 1 ? ' new' : ''}">${av}<div class="mb"><div class="mh">${h}</div>${body(msg, own(msg.at), now)}</div></li>`);
    const mom = moments.find((x) => x.messages[x.messages.length - 1] === msg);
    const mi = moments.indexOf(mom);
    if (mom && shown.some((b) => b.end && b.mi === mi)) {
      html.push(`<li class="endcard${mi === current ? ' new' : ''}"><div class="ec-head">End of ${esc(mom.label)}</div>
        <div class="ec-row"><span class="ec-k ok">What the desk did</span><p>${esc(mom.takeaway)}</p></div>
        <div class="ec-row"><span class="ec-k hard">Why it's hard</span><p>${esc(mom.without)}</p></div></li>`);
    }
  });
  $('msgs').innerHTML = html.join('') || '<li class="empty">Press <b>Start</b>. Messages arrive in the order they did that week.</li>';
  $('pane').innerHTML = pane(now);
  $('open-count').textContent = now.open.length ? String(now.open.length) : '';
  $('topic').textContent = now.status === 'Quiet' ? 'No incident open' : `${now.status} · ${fmt(now.now)}`;

  $('back').disabled = pos === 0;
  $('next').disabled = pos === beats.length;
  const nextBeat = beats[pos];
  $('next').textContent = pos === 0 ? 'Start' : pos === beats.length ? 'The end' : !nextBeat.end && nextBeat.mi !== current ? `Next: ${moments[nextBeat.mi].label}` : 'Next';
  document.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => { stop(); go(pos + 1); }));
  requestAnimationFrame(() => {
    const el = $('msgs');
    el.scrollTo({ top: el.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

function go(n) { pos = Math.max(0, Math.min(beats.length, n)); render(); if (pos === beats.length) stop(); }
function stop() { clearInterval(timer); timer = null; $('play').textContent = 'Play'; }
$('next').addEventListener('click', () => { stop(); go(pos + 1); });
$('back').addEventListener('click', () => { stop(); go(pos - 1); });
$('play').addEventListener('click', () => {
  if (timer) return stop();
  if (pos === beats.length) pos = 0;
  $('play').textContent = 'Pause';
  go(pos + 1);
  timer = setInterval(() => go(pos + 1), 2800);
});
$('moments').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mo]');
  if (!b) return;
  stop();
  go(beats.findIndex((x) => x.mi === Number(b.dataset.mo)) + 1);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); stop(); go(pos + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); go(pos - 1); }
});
const start = Number(new URLSearchParams(location.search).get('beat'));
pos = start ? Math.min(beats.length, start) : 2;
render();
