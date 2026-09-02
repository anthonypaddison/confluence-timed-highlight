const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
};

export const viewerDate = (now = new Date(), timeZone = 'UTC') => {
  if (!(now instanceof Date) || Number.isNaN(now.valueOf())) {
    return null;
  }

  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      timeZone: timeZone || 'UTC',
      year: 'numeric',
    }).formatToParts(now);
    const calendar = Object.fromEntries(
      parts
        .filter(({ type }) => ['day', 'month', 'year'].includes(type))
        .map(({ type, value }) => [type, value]),
    );

    return `${calendar.year}-${calendar.month}-${calendar.day}`;
  } catch {
    return null;
  }
};

export const isHighlightActive = (
  expiryDate,
  { now = new Date(), timeZone = 'UTC' } = {},
) => {
  if (!isValidIsoDate(expiryDate)) {
    return false;
  }

  const today = viewerDate(now, timeZone);

  return today !== null && today <= expiryDate;
};

export const formatExpiryDate = (expiryDate, locale = 'en-GB') => {
  if (!isValidIsoDate(expiryDate)) {
    return null;
  }

  return new Intl.DateTimeFormat(locale || 'en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${expiryDate}T00:00:00.000Z`));
};
