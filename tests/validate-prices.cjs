'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
for (const file of ['trip-data.js', 'price-data.js']) vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
const data = JSON.parse(JSON.stringify(context.window.TRIP_DATA));
const prices = JSON.parse(JSON.stringify(context.window.TRIP_PRICES));
assert.deepEqual(prices, JSON.parse(fs.readFileSync('docs/price-audit.json', 'utf8')), 'Regenerate price-data.js with npm run build:prices');
const ledger = JSON.parse(fs.readFileSync('docs/source-ledger.json', 'utf8'));
const sources = new Map([...data.sources, ...prices.sources].map(source => [source.id, source]));
const canonical = value => { const u = new URL(value); u.pathname = u.pathname.replace(/\/$/, '') || '/'; u.searchParams.sort(); return u.href; };
for (const source of prices.sources) {
  const entry = ledger.sources.find(row => row.id === source.id);
  assert.ok(entry, 'Missing price source ' + source.id);
  assert.equal(canonical(source.url), canonical(entry.url));
}
assert.equal(new Set(prices.sources.map(row => row.id)).size, prices.sources.length);
assert.equal(prices.hotel_per_night_cap_twd, 3000);
assert.equal(prices.comparison_baggage_assumption_kg, 20);
const original = prices.hotels.filter(row => row.origin === 'original');
assert.equal(original.length, 6);
assert.equal(new Set(original.map(row => row.hotel + row.checkin)).size, 6);
const alternatives = prices.hotels.filter(row => row.origin === 'alternative');
assert.equal(alternatives.length, 4);
assert.equal(prices.hotels.length, 10);
assert.equal(new Set(prices.hotels.map(row => row.hotel + row.checkin)).size, 10);
assert.equal(prices.alternativeResearchStatus, 'completed_with_gaps');
for (const row of [...prices.hotels, ...prices.flights, ...prices.officialChecks]) {
  assert.ok(Number.isFinite(Date.parse(row.retrieved_at)));
  for (const id of row.refs) assert.ok(sources.has(id), 'Unknown source ' + id);
  assert.ok(fs.existsSync(row.evidence), 'Missing public evidence ' + row.evidence);
}
const round = amount => Math.round(amount * 100) / 100;
for (const hotel of prices.hotels) {
  assert.equal((Date.parse(hotel.checkout) - Date.parse(hotel.checkin)) / 86400000, 4);
  assert.equal(hotel.adults, 1); assert.equal(hotel.rooms, 1); assert.equal(hotel.nights, 4);
  assert.ok(data.dateOptions.includes(hotel.checkin));
  assert.ok(['unknown', 'over-cap-estimate', 'over-cap-total-estimate', 'within-cap-estimate'].includes(hotel.budget_state));
  if (hotel.origin === 'original' && hotel.budget_state === 'unknown') assert.equal(hotel.total_amount, null);
  if (hotel.budget_state === 'over-cap-estimate') {
    assert.equal(hotel.nightly_amounts.length, 4);
    assert.equal(hotel.nightly_amounts.reduce((sum, night) => sum + night.amount, 0) + hotel.taxes_and_fees_total, hotel.total_amount);
    assert.equal(round(hotel.total_amount * prices.exchangeRate.twd_per_krw), hotel.estimated_total_twd);
    assert.ok(hotel.nightly_amounts.some(night => night.amount * prices.exchangeRate.twd_per_krw > 3000));
  }
  if (hotel.budget_state === 'over-cap-total-estimate') {
    assert.equal(hotel.nightly_amounts.length, 4);
    assert.ok(hotel.nightly_amounts.every(night => night.amount === null));
    assert.equal(hotel.taxes_and_fees_total, null);
    assert.equal(round(hotel.total_amount * prices.exchangeRate.twd_per_krw), hotel.estimated_total_twd);
    assert.ok(hotel.estimated_total_twd > prices.hotel_per_night_cap_twd * hotel.nights);
  }
  if (hotel.budget_state === 'within-cap-estimate') {
    assert.equal(hotel.nightly_amounts.length, 4);
    assert.ok(hotel.nightly_amounts.every(night => night.tax_included === true));
    assert.ok(hotel.nightly_amounts.every(night => night.amount * (hotel.currency === 'TWD' ? 1 : prices.exchangeRate.twd_per_krw) <= 3000));
  }
}
assert.equal(prices.hotelBudgetSatisfied, prices.hotels.some(row => row.budget_state === 'within-cap-estimate'));
assert.equal(prices.flights.length, 3);
for (const flight of prices.flights) {
  assert.equal((Date.parse(flight.return_date) - Date.parse(flight.outbound_date)) / 86400000 + 1, 5);
  assert.ok(data.dateOptions.includes(flight.outbound_date));
  assert.equal(flight.adult_count, 1); assert.equal(flight.cabin, 'Economy');
  assert.equal(flight.currency, 'TWD'); assert.equal(flight.nonstop_both, true);
  assert.equal(flight.first_checked_bag_free_entire_trip, true);
  assert.ok(flight.observed_total > 0);
  assert.ok(fs.readFileSync(flight.evidence, 'utf8').includes('NT$' + flight.observed_total.toLocaleString('en-US')));
}
const a = prices.flights.find(row => row.id === 'a-afternoon-return');
const b = prices.flights.find(row => row.id === 'b-afternoon-return');
const early = prices.flights.find(row => row.id === 'b-early-return');
assert.equal(b.observed_total - a.observed_total, prices.differences_twd.b_afternoon_minus_a_afternoon);
assert.equal(early.observed_total - a.observed_total, prices.differences_twd.b_early_minus_a_afternoon);
assert.equal(b.observed_total - early.observed_total, prices.differences_twd.b_afternoon_minus_b_early);
assert.equal(prices.officialChecks.length, 4);
for (const official of prices.officialChecks) {
  assert.equal(official.total_amount, null);
  assert.ok(official.references.every(ref => !ref.is_exact_quote && ref.return_date !== official.return_date));
}
assert.ok(!/\/Users\/|gclid=|_ga\*/.test(JSON.stringify(prices)), 'Private machine paths or anonymous tracking leaked');
console.log(JSON.stringify({ hotels: prices.hotels.length, originalHotels: original.length, flightObservations: prices.flights.length, officialChecks: prices.officialChecks.length, sources: prices.sources.length, generatedDataMatches: true, sourceLedgerMatches: true, budgetSatisfiedAtReferenceFx: prices.hotelBudgetSatisfied }, null, 2));
