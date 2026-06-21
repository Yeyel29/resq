const missingTokens = new Set([
  "",
  "n/a",
  "na",
  "none",
  "null",
  "no response",
  "-",
  "\u2014",
]);

export function isDatasetMissingValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  const normalized = String(value).trim().toLowerCase();
  return missingTokens.has(normalized);
}
