const ACCEPTED_PHONE_FORMATS = [
  /^0[67][0-9]{8}$/,
  /^0[67] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/,
  /^0[67]-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/,
  /^0[67]\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/,
  /^\+212[67][0-9]{8}$/,
  /^\+212 [67] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/,
  /^00212[67][0-9]{8}$/,
  /^00212 [67] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/,
  /^212[67][0-9]{8}$/,
];

function isExactMatch(pattern, value) {
  const match = pattern.exec(value);
  return match !== null && match[0] === value;
}

function invalidPhoneNumber() {
  return new Error('Invalid Moroccan phone number format.');
}

function normalizePhoneNumber(value) {
  if (typeof value !== 'string') {
    throw new Error('Invalid Moroccan phone number: expected a string.');
  }

  const trimmed = value.replace(/^ +| +$/g, '');
  if (!ACCEPTED_PHONE_FORMATS.some((pattern) => isExactMatch(pattern, trimmed))) {
    throw invalidPhoneNumber();
  }

  const compact = trimmed.replace(/[ .-]/g, '');
  const digits = compact.startsWith('+') ? compact.slice(1) : compact;

  let nationalSignificantNumber;
  if (digits.startsWith('00212')) {
    nationalSignificantNumber = digits.slice(5);
  } else if (digits.startsWith('0')) {
    nationalSignificantNumber = digits.slice(1);
  } else {
    nationalSignificantNumber = digits.slice(3);
  }

  return `212${nationalSignificantNumber}`;
}

function getPhoneSearchKey(normalizedNumber) {
  if (
    typeof normalizedNumber !== 'string' ||
    normalizedNumber.length !== 12 ||
    !/^212[67][0-9]{8}$/.test(normalizedNumber)
  ) {
    throw new Error('Invalid normalized Moroccan phone number.');
  }

  return normalizedNumber.slice(-9);
}

module.exports = {
  normalizePhoneNumber,
  getPhoneSearchKey,
};
