export const parsePositiveInteger = (value: string | undefined, fallback: string): string => {
  if (!value) {
    return fallback;
  }
  const parsedNumber = Number(value);
  if (!Number.isFinite(parsedNumber)) {
    return fallback;
  }
  const integerNumber = Math.floor(parsedNumber);

  return integerNumber >= 1 ? String(integerNumber) : String(fallback);
};
