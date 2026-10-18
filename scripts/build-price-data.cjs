'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const audit = JSON.parse(fs.readFileSync(path.join(root, 'docs/price-audit.json'), 'utf8'));
const source = "'use strict';\n// Generated from docs/price-audit.json by npm run build:prices.\n// Observed public research only; no reservations, checkout confirmation or personal data.\nwindow.TRIP_PRICES = " + JSON.stringify(audit, null, 2) + ';\n';
fs.writeFileSync(path.join(root, 'price-data.js'), source, 'utf8');
console.log(JSON.stringify({ hotels: audit.hotels.length, flights: audit.flights.length, officialChecks: audit.officialChecks.length, output: 'price-data.js' }));
