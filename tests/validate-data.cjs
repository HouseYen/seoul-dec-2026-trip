const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('trip-data.js', 'utf8'), context);
const data = JSON.parse(JSON.stringify(context.window.TRIP_DATA));
const ledger = JSON.parse(fs.readFileSync('docs/source-ledger.json', 'utf8'));
const canonical = value => { const url = new URL(value); url.pathname = url.pathname.replace(/\/$/, '') || '/'; url.searchParams.sort(); return url.href; };
assert.equal(data.days.length, data.daysCount);
assert.equal(data.nights, data.daysCount - 1);
assert.equal(data.hotelNightCap * data.nights, 12000);
const sourceIds = data.sources.map(item => item.id);
assert.equal(new Set(sourceIds).size, sourceIds.length);
for (const source of data.sources) {
  const entry = ledger.sources.find(item => item.id === source.id);
  assert.ok(entry, `Missing ledger source ${source.id}`);
  assert.equal(canonical(source.url), canonical(entry.url));
}
const records = [...data.days, ...data.backups, ...data.places, ...data.hotels];
for (const record of records) for (const id of record.refs || []) assert.ok(sourceIds.includes(id), `Unknown source ${id}`);
const todos = data.todoGroups.flatMap(group => group.items.map(item => item.id));
assert.deepEqual(todos, ['dates', 'flight', 'hotel', 'budget', 'transfer', 'entry', 'connectivity', 'hours', 'events', 'packing']);
const dates = data.dateOptions.map(start => {
  const days = Array.from({ length: data.daysCount }, (_, i) => new Date(Date.parse(start + 'T00:00:00Z') + i * 86400000));
  assert.equal((days.at(-1) - days[0]) / 86400000 + 1, 5);
  assert.ok(days.some(date => [0, 6].includes(date.getUTCDay())));
  assert.equal(days[1].getUTCDay(), 5, 'Palace day must stay Friday for both candidates');
  return { departure: start, return: days.at(-1).toISOString().slice(0, 10), inclusiveDays: days.length, nights: days.length - 1, weekdays: days.map(d => d.getUTCDay()) };
});
const closed = new Date('2026-12-07T00:00:00Z');
assert.equal(closed.getUTCDay(), 1);
assert.ok(closed.getUTCDate() <= 7);
assert.equal(data.places.filter(p => p.category === 'snow').length, 4);
assert.equal(data.places.filter(p => p.category === 'beauty').length, 2);
console.log(JSON.stringify({ dates, hotelCap: data.hotelNightCap * data.nights, places: data.places.length, hotels: data.hotels.length, sources: data.sources.length, todos: todos.length, ledgerMatches: true }, null, 2));
