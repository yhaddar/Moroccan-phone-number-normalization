// Contract tests for the locked phone-number behavior.
// The module path and export names below are provisional until API review.
const assert = require('node:assert/strict');
const { test } = require('node:test');

function getImplementationExport(name) {
  let implementation;
  try {
    implementation = require('../phone-normalizer.js');
  } catch (error) {
    if (
      error.code === 'MODULE_NOT_FOUND' &&
      error.message.includes('../phone-normalizer.js')
    ) {
      assert.fail('Missing implementation module: phone-normalizer.js');
    }
    throw error;
  }

  assert.equal(
    typeof implementation[name],
    'function',
    `Missing implementation function: ${name}`,
  );
  return implementation[name];
}

function normalizePhoneNumber(value) {
  return getImplementationExport('normalizePhoneNumber')(value);
}

function getPhoneSearchKey(value) {
  return getImplementationExport('getPhoneSearchKey')(value);
}

function assertClearValidationError(action) {
  assert.throws(action, (error) => {
    // A missing module or export is a test failure, not a valid-input error.
    if (error.code === 'ERR_ASSERTION') return false;

    return (
      error instanceof Error &&
      typeof error.message === 'string' &&
      error.message.trim().length > 0 &&
      /invalid|valid|unsupported|not supported|required|empty|short|long|phone|number|format|country|digit|whitespace|separator|normalized/i.test(
        error.message,
      )
    );
  });
}

const acceptedNormalizationCases = [
  ['local compact 06', '0600000001', '212600000001'],
  ['local spaced 06', '06 00 00 00 01', '212600000001'],
  ['local hyphenated 06', '06-00-00-00-01', '212600000001'],
  ['local dotted 06', '06.00.00.00.01', '212600000001'],
  ['international spaced 06 with plus', '+212 6 00 00 00 01', '212600000001'],
  ['international compact 06 with plus', '+212600000001', '212600000001'],
  ['international compact 06 with 00 prefix', '00212600000001', '212600000001'],
  ['international spaced 06 with 00 prefix', '00212 6 00 00 00 01', '212600000001'],
  ['international compact 06 without prefix', '212600000001', '212600000001'],
  ['local compact 07', '0700000001', '212700000001'],
  ['local spaced 07', '07 00 00 00 01', '212700000001'],
  ['local hyphenated 07', '07-00-00-00-01', '212700000001'],
  ['local dotted 07', '07.00.00.00.01', '212700000001'],
  ['international spaced 07 with plus', '+212 7 00 00 00 01', '212700000001'],
  ['international compact 07 with plus', '+212700000001', '212700000001'],
  ['international compact 07 with 00 prefix', '00212700000001', '212700000001'],
  ['international spaced 07 with 00 prefix', '00212 7 00 00 00 01', '212700000001'],
  ['international compact 07 without prefix', '212700000001', '212700000001'],
  ['trim ordinary spaces around local form', '  0600000001  ', '212600000001'],
  ['trim ordinary spaces around international form', '  +212 7 00 00 00 01  ', '212700000001'],
];

for (const [description, input, expected] of acceptedNormalizationCases) {
  test(`normalizes ${description}`, () => {
    assert.equal(normalizePhoneNumber(input), expected);
  });
}

const rejectedNormalizationCases = [
  ['empty input', ''],
  ['too-short local input', '060000001'],
  ['too-long local input', '06000000011'],
  ['letters', '06AB000001'],
  ['foreign country code after plus', '+33600000001'],
  ['another foreign country code after plus', '+33123456789'],
  ['unsupported separator grouping', '060 000 00 01'],
  ['mixed separators', '06 00-00.00 01'],
  ['unsupported slash punctuation', '06/00/00/00/01'],
  ['tab at the beginning', '\t0600000001'],
  ['tab at the end', '0600000001\t'],
  ['tab between digits', '06\t00 00 00 01'],
  ['newline whitespace', '0600000001\n'],
  ['non-breaking space whitespace', '\u00a00600000001'],
];

for (const [description, input] of rejectedNormalizationCases) {
  test(`rejects normalization input with ${description}`, () => {
    assertClearValidationError(() => normalizePhoneNumber(input));
  });
}

test('returns the last nine digits for a normalized 06 number', () => {
  assert.equal(getPhoneSearchKey('212600000001'), '600000001');
});

test('returns the last nine digits for a normalized 07 number', () => {
  assert.equal(getPhoneSearchKey('212700000001'), '700000001');
});

const rejectedSearchKeyCases = [
  ['local number', '0600000001'],
  ['formatted international number', '+212 6 00 00 00 01'],
  ['too-short normalized-looking string', '21260000001'],
  ['too-long normalized-looking string', '2126000000011'],
  ['national significant number beginning with an unsupported digit', '212500000001'],
  ['foreign country code', '+33600000001'],
  ['empty input', ''],
];

for (const [description, input] of rejectedSearchKeyCases) {
  test(`rejects search-key input that is not normalized: ${description}`, () => {
    assertClearValidationError(() => getPhoneSearchKey(input));
  });
}
