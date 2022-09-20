const truthyValues = ['true', 'yes', '1', 'on'];
const falsyValues = ['false', 'no', '0', 'off'];

export function booly(env?: unknown): boolean | undefined {
  if (!env) return undefined;
  const envVariable = String(env).toLowerCase().trim();
  if (truthyValues.includes(envVariable)) return true;
  if (falsyValues.includes(envVariable)) return false;
  return undefined;
}
