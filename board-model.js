// Days on the board and how a guest's state reads as a status. Pure, tested.

export const DAYS = [
  {
    label: 'Mon 22', at: 'e1', news: ['e1'],
    title: 'A strike notice for Thursday.',
    desk: 'Checked Thursday against the flights guests gave on their pre-trip forms: {affected} guests are on flights into or over France. Six are going to Spain, but their flights cross French airspace. Emma never sent her flight details, so Nadia is chasing her.',
    without: 'Someone checks the French trip. The Spain group isn\'t on anyone\'s list.',
  },
  {
    label: 'Tue 23', at: 'e6', news: [], quiet: 'No new public news. The strike notice still stands.',
    title: 'The first flight is cancelled.',
    desk: 'Four Riviera guests rebooked themselves onto a Friday flight. The desk asked Azur Ground, the local agent, to move their airport pickup and hold their rooms, and it confirmed all four by name. Hannah moved Friday\'s walk to 14:00 so they can join.',
    without: 'The local agent finds out when four people don\'t appear at arrivals.',
  },
  {
    label: 'Wed 24', at: 'e14', news: ['e7', 'e9'],
    title: 'The strike is called off. The flights are still cancelled.',
    desk: 'Closed nothing. Dev asked "are we all good?" and got an honest holding reply, not a yes. That evening {newCancelled} more guests\' flights were cancelled. The Málaga agent replied "all sorted 👍", which names nobody, so the desk ticked nobody off and asked for names.',
    without: '"Strike\'s off, you\'re all good." Dev hears it at lunchtime. "All sorted" gets ticked off.',
  },
  {
    label: 'Thu 25', at: 'e19', news: ['e16'],
    title: 'The strike day.',
    desk: 'The Málaga agent confirmed the five Andalusia guests by name. Six Riviera guests made it to welcome drinks. Ruth hasn\'t replied to anyone since Monday. Her deadline passed at midday, so she went to Hannah.',
    without: 'Ruth is one quiet name among dozens of messages.',
  },
  {
    label: 'Fri 26', at: 'e21', news: [], quiet: 'The strike day is over. No carry-over into Friday in the sources.',
    title: 'Can we close it?',
    desk: '{withGroup} of {affected} guests on affected flights are with their group, each confirmed by their trip leader in person. Ruth is still unaccounted for, so the desk won\'t let the incident close.',
    without: 'Everyone "rebooked", transfers "all sorted", incident closed. Nobody notices Ruth\'s empty seat.',
  },
];

// Fill {placeholders} from the engine so the narrative can't drift from the rules.
export function fillDay(text, room, prev) {
  const v = {
    affected: room.counts.affected,
    withGroup: room.counts.withGroup,
    open: room.open.length,
    newCancelled: room.counts.cancelled - (prev ? prev.counts.cancelled : 0),
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => v[k]);
}

// Status: icon + label + tone. Never colour alone.
export function statusOf(g) {
  if (g.steps.joined && (g.cancelled || g.risk === 'arrived')) return { key: 'with', icon: '✓', label: 'With the group', tone: 'ok' };
  if (g.risk === 'clear') return { key: 'clear', icon: '·', label: 'Not affected', tone: 'quiet' };
  if (g.escalated) return { key: 'late', icon: '!', label: 'Unaccounted for, with Hannah', tone: 'bad' };
  if (g.risk === 'unknown') return { key: 'ask', icon: '?', label: 'No travel details yet', tone: 'warn' };
  if (g.cancelled && g.steps.transfer) return { key: 'onway', icon: '→', label: `Pickup confirmed, lands ${g.newArrival.split(', ')[1]}`, tone: 'info' };
  if (g.cancelled) return { key: 'needs', icon: '…', label: 'Flight cancelled, pickup not confirmed', tone: 'warn' };
  return { key: 'watch', icon: '◦', label: `${g.travel.flight} Thu, watching`, tone: 'info' };
}
