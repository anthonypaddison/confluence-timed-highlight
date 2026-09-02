import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatExpiryDate,
  isHighlightActive,
  isValidIsoDate,
  viewerDate,
} from '../src/lib/expiry.js';

const middayUtc = new Date('2026-08-20T12:00:00.000Z');

test('keeps the highlight active before the expiry date', () => {
  assert.equal(
    isHighlightActive('2026-08-21', {
      now: middayUtc,
      timeZone: 'Europe/London',
    }),
    true,
  );
});

test('keeps the highlight active on the expiry date', () => {
  assert.equal(
    isHighlightActive('2026-08-20', {
      now: middayUtc,
      timeZone: 'Europe/London',
    }),
    true,
  );
});

test('removes the highlight after the expiry date', () => {
  assert.equal(
    isHighlightActive('2026-08-19', {
      now: middayUtc,
      timeZone: 'Europe/London',
    }),
    false,
  );
});

test('treats missing and invalid expiry dates as inactive', () => {
  for (const expiryDate of [undefined, null, '', '20-08-2026', '2026-02-30']) {
    assert.equal(
      isHighlightActive(expiryDate, {
        now: middayUtc,
        timeZone: 'Europe/London',
      }),
      false,
    );
  }
});

test('uses the viewer timezone at a UTC date boundary', () => {
  const boundaryInstant = new Date('2026-08-21T00:30:00.000Z');

  assert.equal(viewerDate(boundaryInstant, 'America/Los_Angeles'), '2026-08-20');
  assert.equal(
    isHighlightActive('2026-08-20', {
      now: boundaryInstant,
      timeZone: 'America/Los_Angeles',
    }),
    true,
  );
  assert.equal(viewerDate(boundaryInstant, 'Europe/London'), '2026-08-21');
  assert.equal(
    isHighlightActive('2026-08-20', {
      now: boundaryInstant,
      timeZone: 'Europe/London',
    }),
    false,
  );
});

test('rejects invalid viewer dates and timezones safely', () => {
  assert.equal(viewerDate(new Date('invalid'), 'Europe/London'), null);
  assert.equal(viewerDate(middayUtc, 'Not/A_Timezone'), null);
});

test('validates real ISO calendar dates', () => {
  assert.equal(isValidIsoDate('2024-02-29'), true);
  assert.equal(isValidIsoDate('2026-02-29'), false);
});

test('formats a valid expiry date without shifting its calendar day', () => {
  assert.equal(formatExpiryDate('2026-08-20', 'en-GB'), '20 Aug 2026');
  assert.equal(formatExpiryDate('not-a-date', 'en-GB'), null);
});
