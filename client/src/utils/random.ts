export function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function rand01(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
