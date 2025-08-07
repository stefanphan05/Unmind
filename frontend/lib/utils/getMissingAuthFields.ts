export function getMissingFields(fields: [string, string][]) {
  const missing = [];

  for (const [label, value] of fields) {
    if (!value.trim()) {
      missing.push(label);
    }
  }

  if (missing.length === 0) return null;

  return `${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} required.`;
}
