// The desk engine, land-only model. buildRoom(scenario, step) applies the
// first `step` events and returns the room's state. Pure: same inputs, same
// room, no model call. Every change is tagged with the rule behind it.
//
// For a guest whose flight is cancelled there are three things to confirm,
// each only from the right person:
//   arrival  - the guest's new arrival, from the guest
//   transfer - the DMC has moved the pickup and told the hotel, naming the guest
//   joined   - the trip leader has the guest with the group, in person

export const RULES = {
  manifest: { name: 'Start from the trip list', text: 'Who is affected comes from the flights guests gave us, not from the headline. Flights over France count too.' },
  allclear: { name: 'Good news closes nothing', text: 'News that the cause has gone away doesn\'t close anything for a guest. Each one is confirmed on its own.' },
  evidence: { name: 'Only the right person confirms', text: 'The guest confirms their new arrival, the DMC confirms the transfer by name, the trip leader confirms the guest is with the group.' },
  routing: { name: 'The right person decides', text: 'The desk proposes. Sam signs off transfer changes; Hannah signs off itinerary changes and every message to guests.' },
  comms: { name: 'Say only what\'s known', text: 'Messages to guests are drafted only on a stated basis, and never promise what hasn\'t been confirmed.' },
  clock: { name: 'Everything has an owner and a deadline', text: 'Missed deadlines go to Hannah. They are never quietly extended.' },
  conflict: { name: 'Keep disagreements visible', text: 'When sources disagree, both are kept with their times. Nothing is averaged.' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function fmt(t) {
  const [date, rest] = t.split('T');
  const [y, m, d] = date.split('-').map(Number);
  return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} ${MONTHS[m - 1]} ${rest.slice(0, 5)}`;
}
const ms = (t) => new Date(t).getTime();
const TRIP_START = { RIV: '2024-04-25T19:00:00+01:00', AND: '2024-04-25T16:00:00+01:00', HEB: '2024-04-24T12:00:00+01:00' };
const dayAfter18 = '2024-04-26T18:00:00+01:00';

export function buildRoom(scenario, step) {
  const events = scenario.events.slice(0, step);
  const team = scenario.operator.team;
  const people = { ...team };
  scenario.trips.forEach((t) => {
    people[t.leader.key] = t.leader;
    if (t.dmc) people[t.dmc.key] = t.dmc;
  });

  const room = {
    now: events.length ? events[events.length - 1].t : null,
    event: events.length ? events[events.length - 1] : null,
    status: 'Quiet', strike: 'none',
    guests: [], tasks: [], decisions: [], drafts: [], claims: [], conflicts: [],
    official: null, log: [], warnings: [], people,
  };
  scenario.trips.forEach((t) => t.guests.forEach((g) => room.guests.push({
    trip: t.id, tripName: t.trip, name: g.name, travel: g.travel, risk: 'not assessed',
    steps: { arrival: null, transfer: null, joined: null }, cancelled: false, escalated: false,
  })));

  const G = (trip, name) => room.guests.find((g) => g.trip === trip && g.name === name);
  const byName = (name) => room.guests.find((g) => g.name === name);
  const trip = (id) => scenario.trips.find((t) => t.id === id);
  const say = (e, rule, text, t) => room.log.push({ t: t || e.t, event: e.id, rule, text: text.replace(/\.\.(?!\.)/g, '.') });
  const task = (e, o) => {
    if (room.tasks.find((x) => x.id === o.id)) return;
    room.tasks.push({ done: false, escalated: false, openedAt: e.t, ...o });
    say(e, 'clock', `New task for ${team[o.owner].name}: ${o.title}. Due ${fmt(o.due)}.`);
  };
  const propose = (e, d) => {
    if (room.decisions.find((x) => x.id === d.id)) return;
    room.decisions.push({ status: 'waiting', proposedAt: e.t, ...d });
    say(e, 'routing', `For ${team[d.owner].name} to sign off: ${d.what}. Nothing happens until ${team[d.owner].name} does.`);
  };
  const draft = (e, d) => {
    room.drafts.push({ status: 'waiting', at: e.t, ...d });
    say(e, 'comms', `Drafted a message to ${d.to} for Hannah. Basis: ${d.basis}.`);
  };
  const needs = (g) => (g.cancelled ? ['arrival', 'transfer', 'joined'] : ['joined']);
  const isOpen = (g) => ['at risk', 'unknown'].includes(g.risk) || (g.cancelled && !g.steps.joined);
  const dueFor = (g) => (g.cancelled ? dayAfter18 : TRIP_START[g.trip]);

  for (const e of events) {
    // Clock first: anything past due escalates, once, at its deadline.
    for (const x of room.tasks) {
      if (!x.done && !x.escalated && ms(e.t) > ms(x.due)) {
        x.escalated = true;
        say(e, 'clock', `Overdue: ${x.title}. Passed to Hannah.`, x.due);
      }
    }
    for (const g of room.guests) {
      if (isOpen(g) && !g.escalated && room.strike !== 'none' && ms(e.t) > ms(dueFor(g))) {
        g.escalated = true;
        say(e, 'clock', `${g.name} should have been with the group by ${fmt(dueFor(g))} and isn't confirmed. Passed to Hannah.`, dueFor(g));
      }
    }
    if (!['none', 'ended'].includes(room.strike) && ms(e.t) >= ms(scenario.hazard.endsAfter)) {
      room.strike = 'ended';
      say(e, 'allclear', 'The strike day is over. That changes nothing for guests who aren\'t confirmed yet.', scenario.hazard.endsAfter);
      task(e, { id: 'review', title: 'Review what happened and update the playbook', owner: 'hannah', due: '2024-05-03T17:00:00+01:00' });
    }

    for (const f of e.effects) {
      if (f.type === 'strike' && f.status === 'notice filed') {
        room.strike = 'notice filed';
        for (const t of scenario.trips) {
          const atRisk = [];
          const unknown = [];
          for (const g of room.guests.filter((x) => x.trip === t.id)) {
            const tr = g.travel;
            if (!tr) { g.risk = 'unknown'; unknown.push(g.name); continue; }
            if (tr.mode === 'air' && tr.date === scenario.hazard.date && tr.france) { g.risk = 'at risk'; atRisk.push(g); continue; }
            g.risk = 'clear';
          }
          if (!atRisk.length && !unknown.length) {
            say(e, 'manifest', `${t.trip}: nobody flying on Thursday. Not affected.`);
            continue;
          }
          const over = atRisk.filter((g) => g.travel.france === 'overflies').length;
          say(e, 'manifest', `${t.trip}: ${atRisk.length} guests on Thursday flights${over ? ` that cross French airspace` : ' into France'}${unknown.length ? `; no flight details from ${unknown.join(', ')}` : ''}.`);
          unknown.forEach((name) => task(e, { id: `details-${name}`, title: `Get ${name}'s travel details`, owner: 'nadia', due: '2024-04-23T12:00:00+01:00', guest: name }));
        }
        say(e, 'comms', 'No messages to guests yet: nothing has been cancelled, so there\'s nothing true to tell them.');
      }

      if (f.type === 'strike' && f.status === 'notice withdrawn') {
        room.strike = 'notice withdrawn';
        const open = room.guests.filter(isOpen).length;
        say(e, 'allclear', `Strike called off. ${open} guests still unconfirmed, and none of them is closed by this: the flight cuts aren't reported reversed and no airline has reinstated a flight.`);
      }

      if (f.type === 'official') {
        room.official = { t: e.t, status: f.status, source: e.source.label };
      }

      if (f.type === 'claim') {
        room.claims.push({ subject: f.subject, value: f.value, t: e.t, source: e.source.label, relevant: f.relevant });
        const same = room.claims.filter((c) => c.subject === f.subject);
        if (new Set(same.map((c) => c.value)).size > 1) {
          let c = room.conflicts.find((x) => x.subject === f.subject);
          if (!c) { c = { subject: f.subject, relevant: f.relevant }; room.conflicts.push(c); }
          c.claims = same;
          say(e, 'conflict', `Sources disagree on ${f.subject}: ${same.map((x) => `${x.value} (${x.source})`).join(' vs ')}. Kept both. Not on any of our routes.`);
        }
      }

      if (f.type === 'travel-details') {
        const g = byName(f.guest);
        g.travel = f.travel;
        g.risk = f.travel.mode === 'air' && f.travel.france ? 'at risk' : 'clear';
        const x = room.tasks.find((t) => t.id === `details-${f.guest}`);
        if (x) { x.done = true; x.doneAt = e.t; }
        say(e, 'evidence', `${f.guest} is coming by ${f.travel.mode}: ${f.travel.note}. No French airspace, so not at risk.`);
      }

      if (f.type === 'flight' && f.status === 'cancelled') {
        const gs = f.guests.map(byName);
        const t = trip(gs[0].trip);
        gs.forEach((g) => {
          g.risk = 'cancelled';
          g.cancelled = true;
          g.newArrival = f.newArrival;
          g.steps.arrival = { by: 'guest', text: f.newArrival, t: e.t };
          if (g.escalated) {
            g.escalated = false;
            say(e, 'evidence', `${g.name} is in touch again. Off the overdue list; still followed until they're with the group.`);
          }
          const reach = room.tasks.find((x) => x.guest === g.name && !x.done);
          if (reach) { reach.done = true; reach.doneAt = e.t; }
          room.drafts.filter((d) => d.status === 'waiting' && d.to.split(', ').includes(g.name)).forEach((d) => {
            d.status = 'replaced';
            d.replacedAt = e.t;
            say(e, 'comms', `Withdrew the earlier draft to ${d.to}: it no longer matches what we know.`);
          });
        });
        say(e, 'evidence', `${f.flight} cancelled for ${gs.length} ${t.trip} guests. New arrival from ${f.from}: ${f.newArrival}.`);
        const n = room.decisions.filter((d) => d.id.startsWith(`transfer-${t.id}-`)).length + 1;
        propose(e, { id: `transfer-${t.id}-${n}`, owner: 'sam', trip: t.id, what: `${t.dmc.name} to move the pickup to ${f.newArrival} and tell the hotel (${gs.map((g) => g.name).join(', ')})`, basis: `new arrival from ${f.from}` });
        if (!room.decisions.find((d) => d.id === `joinup-${t.id}`)) {
          propose(e, { id: `joinup-${t.id}`, owner: 'hannah', trip: t.id, what: `where the late ${t.trip} guests join the group`, basis: `new arrivals on ${f.newArrival.split(',')[1].trim()}` });
        } else {
          say(e, 'routing', `${t.trip}: the join-up plan Hannah approved already covers a Friday arrival. Flagged to her, not changed.`);
        }
        draft(e, { trip: t.id, to: gs.map((g) => g.name).join(', '), basis: `their new flight, ${f.newArrival}`, text: 'Thanks for letting us know. We\'re moving your airport pickup to your new flight and telling the hotel you\'ll arrive Friday. Your trip leader will tell you where to join the group.' });
        const silent = room.guests.filter((g) => g.trip === t.id && g.risk === 'at risk' && g.travel.france === 'overflies');
        silent.forEach((g) => task(e, { id: `reach-${g.name}`, title: `Reach ${g.name}: on ${g.travel.flight}, which crosses France, and hasn't been in touch`, owner: 'nadia', due: '2024-04-25T12:00:00+01:00', guest: g.name }));
      }

      if (f.type === 'decide') {
        const d = room.decisions.find((x) => x.id === f.id);
        if (!d) { room.warnings.push(`unknown decision ${f.id}`); continue; }
        if (d.owner !== f.by) room.warnings.push(`${f.by} decided ${f.id}, owned by ${d.owner}`);
        d.status = 'done';
        d.by = f.by;
        d.at = e.t;
        say(e, 'routing', `${team[f.by].name} signed off: ${d.what}.`);
      }

      if (f.type === 'approve-drafts') {
        room.drafts.filter((d) => d.trip === f.trip && d.status === 'waiting').forEach((d) => {
          d.status = 'approved';
          d.approvedAt = e.t;
          say(e, 'comms', `Hannah approved the message to ${d.to}. Approved, not yet confirmed as delivered.`);
        });
      }

      if (f.type === 'guest-question') {
        const g = byName(f.guest);
        draft(e, {
          trip: g.trip, to: f.guest, id: 'reply-dev',
          basis: `no news yet on ${g.travel.flight}, and the airlines haven't restored Thursday's flights`,
          text: 'The strike itself has been called off, but the airlines had already been told to cut Thursday\'s flights. Please check your booking with Solent Air, and let us know either way. We\'ll keep your pickup and the group posted.',
        });
        say(e, 'allclear', `Didn't tell ${f.guest} "you're all good". The strike being called off isn't a basis for that.`);
      }

      if (f.type === 'news-scope') {
        if (f.airport === 'overflights') {
          const silent = room.guests.filter((g) => g.risk === 'at risk' && g.travel?.france === 'overflies');
          say(e, 'manifest', `Confirms flights over France were cancelled too.${silent.length ? ` Still no word from ${silent.map((g) => g.name).join(', ')}.` : ''}`);
        } else {
          say(e, 'manifest', `None of our guests fly via ${f.airport}. It does show the cuts are real: Nice was set at 60%.`);
        }
      }

      if (f.type === 'dmc-general') {
        const waiting = room.guests.filter((g) => g.cancelled && !g.steps.transfer && scenario.trips.find((t) => t.id === g.trip).dmc?.key === f.dmc);
        say(e, 'evidence', `"All sorted" names nobody, so it confirms none of the ${waiting.length} transfers. Asked ${people[f.dmc].name} to confirm each guest by name.`);
      }

      if (f.type === 'dmc-confirm') {
        const ticked = [];
        for (const name of f.guests) {
          const g = byName(name);
          const t = trip(g.trip);
          if (t.dmc?.key !== f.dmc) { room.warnings.push(`${f.dmc} confirmed ${name}, who isn't theirs`); continue; }
          if (!g.cancelled) continue;
          g.steps.transfer = { by: f.dmc, text: f.what, t: e.t };
          ticked.push(name);
        }
        say(e, 'evidence', `${people[f.dmc].name} confirmed by name: ${ticked.join(', ')}. ${f.what}.`);
      }

      if (f.type === 'joined') {
        const t = trip(f.trip);
        if (t.leader.key !== f.by) { room.warnings.push(`${f.by} confirmed joiners for ${f.trip}`); continue; }
        const newly = [];
        for (const name of f.guests) {
          const g = G(f.trip, name);
          if (!g) { room.warnings.push(`${name} not on ${f.trip}`); continue; }
          g.steps.joined = { by: f.by, t: e.t };
          if (g.risk === 'at risk') g.risk = 'arrived';
          if (g.cancelled || g.risk === 'arrived') newly.push(name);
        }
        const open = room.guests.filter((g) => g.trip === f.trip && isOpen(g));
        say(e, 'evidence', `${t.leader.name} has ${f.guests.length} with the group in person.${open.length ? ` Still not with ${t.trip}: ${open.map((g) => g.name).join(', ')}.` : ` Everyone on ${t.trip} is accounted for.`}`);
        const reach = room.tasks.find((x) => x.guest && f.guests.includes(x.guest) && !x.done);
        if (reach) { reach.done = true; reach.doneAt = e.t; }
      }
    }
  }

  if (room.strike !== 'none') room.status = 'Declared';
  if (room.guests.some((g) => g.cancelled)) room.status = 'Responding';
  if (room.strike === 'ended') room.status = 'Monitoring';

  room.open = room.guests.filter(isOpen).map((g) => ({ ...g, needs: needs(g), due: dueFor(g) }));
  room.blockers = [
    ...room.open.map((g) => `${g.name} (${g.tripName}) isn't confirmed with the group.`),
    ...room.tasks.filter((x) => !x.done).map((x) => `${x.title}. ${team[x.owner].name}.`),
    ...room.decisions.filter((d) => d.status === 'waiting').map((d) => `${team[d.owner].name} to decide: ${d.what}.`),
    ...room.drafts.filter((d) => d.status === 'waiting').map((d) => `Message to ${d.to} waiting for Hannah.`),
  ];
  room.canClose = room.status === 'Monitoring' && room.blockers.length === 0;
  room.counts = {
    affected: room.guests.filter((g) => g.cancelled || (g.travel?.mode === 'air' && g.travel?.france)).length,
    withGroup: room.guests.filter((g) => (g.cancelled || (g.travel?.mode === 'air' && g.travel?.france)) && g.steps.joined).length,
    cancelled: room.guests.filter((g) => g.cancelled).length,
    transfersConfirmed: room.guests.filter((g) => g.cancelled && g.steps.transfer).length,
  };
  return room;
}

export function handover(scenario, room) {
  const team = scenario.operator.team;
  const lines = [`${room.now ? fmt(room.now) : 'Start'}: ${room.status}. Strike: ${room.strike}.`];
  lines.push(`${room.counts.withGroup} of ${room.counts.affected} guests on affected flights are with their group.`);
  room.open.forEach((g) => lines.push(`Open: ${g.name}, ${g.tripName}. ${g.escalated ? 'With Hannah.' : ''}`.trim()));
  room.tasks.filter((x) => !x.done).forEach((x) => lines.push(`Task: ${x.title}. ${team[x.owner].name}, due ${fmt(x.due)}${x.escalated ? ', overdue' : ''}.`));
  room.conflicts.forEach((c) => lines.push(`Sources disagree: ${c.subject}, ${c.claims.map((x) => `${x.value} (${x.source})`).join(' vs ')}.`));
  return lines;
}
