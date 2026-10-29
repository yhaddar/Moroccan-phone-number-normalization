# Test Plan: Moroccan Phone Number Normalization

## Scope

Plan JavaScript tests for the confirmed behavior of the Moroccan phone-number utility. This document is a test plan only; it does not create or execute tests and does not define implementation code.

## Repository and test runner

The repository has a `package.json` configured for CommonJS, but no JavaScript implementation or test configuration. Its `npm test` script is still the default placeholder and exits with an error. Node.js v26.8.1 is available. The built-in `node:test` runner and `node:assert/strict` are compatible with this repository because they require no project dependencies or installation. Run the test file directly with `node --test tests/phone-normalizer.test.cjs`. Node's documentation marks the test runner stable since Node.js v20. ([Node.js Test Runner documentation](https://nodejs.org/api/test.html))

## Provisional API details

Keep these details open until review:

- Function names and signatures.
- Module path and export style.
- Exact error class and message wording.

The tests check that invalid input throws an error with a nonempty, understandable message without fixing the error class or exact wording. The confirmed search-key contract below requires an already normalized string.

## Confirmed normalization cases

### Accepted forms

Only the exact groupings shown here and their equivalent 07 forms are accepted. Leading and trailing ordinary spaces are trimmed before validation.

| Input form | Expected normalized result |
|---|---|
| `0600000001` | `212600000001` |
| `06 00 00 00 01` | `212600000001` |
| `06-00-00-00-01` | `212600000001` |
| `06.00.00.00.01` | `212600000001` |
| `+212 6 00 00 00 01` | `212600000001` |
| `+212600000001` | `212600000001` |
| `00212600000001` | `212600000001` |
| `00212 6 00 00 00 01` | `212600000001` |
| `212600000001` | `212600000001` |
| `0700000001` | `212700000001` |
| `07 00 00 00 01` | `212700000001` |
| `07-00-00-00-01` | `212700000001` |
| `07.00.00.00.01` | `212700000001` |
| `+212 7 00 00 00 01` | `212700000001` |
| `+212700000001` | `212700000001` |
| `00212700000001` | `212700000001` |
| `00212 7 00 00 00 01` | `212700000001` |
| `212700000001` | `212700000001` |
| `  0600000001  ` | `212600000001` (surrounding ordinary spaces trimmed) |
| `  +212 7 00 00 00 01  ` | `212700000001` (surrounding ordinary spaces trimmed) |

### Rejected normalization inputs

Every rejected input must produce a clear validation failure.

| Case | Synthetic input | Reason |
|---|---|---|
| Empty | `` (empty string) | Empty input is invalid. |
| Too short | `060000001` | Too short for an in-scope number. |
| Too long | `06000000011` | Too long for an in-scope number. |
| Letters | `06AB000001` | Letters are invalid. |
| Foreign number with plus | `+33600000001` | A leading plus is syntactically allowed, but the number is foreign. |
| Foreign number with another country prefix | `+33123456789` | A leading plus does not make a foreign country code valid. |
| Non-example grouping | `06 000 000 1` | Separator groupings must match the examples exactly. |
| Mixed separators | `06 00-00.00 01` | Only the exact example groupings are accepted. |
| Unsupported punctuation | `06/00/00/00/01` | Slash is not an accepted separator. |
| Tab before and after | `\t0600000001\t` | Tabs and other whitespace are rejected. |
| Tab between digits | `06\t00 00 00 01` | Tabs and other whitespace are rejected. |
| Line break | `0600000001\n` | Newlines and other whitespace are rejected. |

The leading plus is permitted syntactically before a country code; acceptance still depends on the number being an in-scope Moroccan number. Foreign numbers remain invalid.

## Confirmed search-key cases

The search-key function accepts only an already normalized string matching `212` followed by exactly nine digits, with the national significant number beginning with `6` or `7`. It returns those nine digits.

| Input | Expected result |
|---|---|
| `212600000001` | `600000001` |
| `212700000001` | `700000001` |

The following must produce a clear validation failure because they are not already normalized strings meeting that pattern:

| Input | Reason |
|---|---|
| `0600000001` | Local form, not normalized. |
| `+212 6 00 00 00 01` | Formatted international form, not normalized. |
| `21260000001` | Fewer than nine national significant digits. |
| `2126000000011` | More than nine national significant digits. |
| `212800000001` | National significant number does not begin with `6` or `7`. |
| `+33600000001` | Foreign number. |
| `` (empty string) | Empty input. |

## Review boundary

This plan records confirmed input and output behavior while leaving the function names, module/export style, and exact error class and wording provisional. The invalid-input tests require a nonempty message that indicates a validation problem, without asserting exact wording.
