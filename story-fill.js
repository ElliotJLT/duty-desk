// Fills {placeholders} in the desk's wording from engine state, so the story
// never quotes a number the engine didn't produce.
export function fill(text, room) {
  const values = {
    open: room.open.length,
    withGroup: room.counts.withGroup,
    affected: room.counts.affected,
  };
  return text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
}
