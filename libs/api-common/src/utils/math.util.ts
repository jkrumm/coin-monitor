export function round(value: number | string, decimals: 2 | 4 = 2) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  if (decimals === 2) {
    return Math.round(value * 100) / 100;
  }
  return Math.round(value * 10000) / 10000;
}

export function roundArray(array: number[] | string[], decimals: 2 | 4 = 2) {
  return array.map((value) => round(value));
}
