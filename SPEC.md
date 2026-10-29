# Moroccan Phone Number Normalization Utility — Specification

## Status

Approved and locked specification. Implementation and tests may proceed against this document and the confirmed decisions below.

## Purpose

Provide a small utility that validates Moroccan mobile phone numbers, normalizes valid numbers to country-code form, and derives a search key from the normalized number.

## Input formats in scope

The utility must accept the following synthetic examples and equivalent valid formats for numbers beginning with `07`:

- `0600000001`
- `06 00 00 00 01`
- `06-00-00-00-01`
- `06.00.00.00.01`
- `+212 6 00 00 00 01`
- `+212600000001`
- `00212600000001`
- `00212 6 00 00 00 01`
- `212600000001`

The local form has ten digits and begins with `06` or `07`. The international forms represent the same number with country code `212` and a nine-digit national significant number beginning with `6` or `7`.

Accept only the separator groupings shown above and their equivalent forms for numbers beginning with `07`. Trim leading and trailing ordinary spaces. Reject tabs and all other whitespace. A leading `+` is permitted before a country code, but numbers with foreign country codes are invalid.

## Required functions

1. **Normalize**: For a valid input, return digits in the form `212XXXXXXXXX`, where the nine `X` positions are the national significant number. Do not include a leading `+` or `00` in the normalized result. For invalid input, throw an error with a nonempty, understandable message; exact wording and error class are not prescribed.
2. **Search key**: Accept only an already normalized string matching `212` followed by exactly nine digits, with the national significant number beginning with `6` or `7`. Return those final nine digits. Reject any other input with an error with a nonempty, understandable message; exact wording and error class are not prescribed.

The programming language, function names, and exact error representation/message are not specified yet.

## Invalid input cases

Reject at least:

- Inputs that are too short or too long to represent one in-scope number.
- Inputs containing letters.
- Foreign numbers (numbers that do not represent the in-scope Moroccan `06`/`07` mobile forms).
- Empty input.

Invalid input must not be returned as a normalized number or search key.

## Assumptions supported by this scope

- This utility covers Moroccan mobile numbers beginning locally with `06` or `07`; it does not claim to validate other Moroccan number categories.
- Only the exact separator groupings shown in the examples and their equivalent 07 forms are accepted. Leading and trailing ordinary spaces are trimmed; tabs and all other whitespace are rejected.
- A leading `+` is permitted before a country code, but foreign country codes are rejected.
- The search-key function accepts only an already normalized Moroccan number in the specified `212` plus nine-digit form, whose national significant number begins with `6` or `7`.
- Every validation error has a nonempty, understandable message; exact wording and error class are not prescribed.
- Country code `212` is required in normalized output.
- Examples and any future fixtures must use synthetic numbers only. Do not include personal, customer, or team phone numbers.

## Provisional API details

These implementation interface details remain open and should not be inferred silently:

- Programming language and function names.
- Module path and export style.
- Exact error class and message wording.

## Acceptance criteria

- Each listed example and its equivalent valid `07` form is accepted.
- Every accepted form of a given number normalizes to the same `212` plus nine-digit result.
- The search key for a valid number is exactly the final nine digits of that normalized result.
- Empty input, too-short input, too-long input, alphabetic input, and foreign-number input produce a clear validation error.
- No invalid input produces a normalized result or a search key.
- Only synthetic phone-number examples appear in the specification, implementation, and tests.
- Implementation and tests follow this approved specification and the remaining provisional API details are reviewed before they are fixed.
