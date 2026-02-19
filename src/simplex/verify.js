export function verifyLP(A, b, c, x, tol = 1e-6) {
  const m = A.length;
  const n = c.length;

  // Z
  let z = 0;
  for (let j = 0; j < n; j++) z += c[j] * x[j];

  // Ax <= b
  const lhs = [];
  let ok = true;
  for (let i = 0; i < m; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += A[i][j] * x[j];
    lhs.push(s);
    if (s > b[i] + tol) ok = false;
  }

  // no negatividad
  const nonNeg = x.every(v => v >= -tol);

  return { ok: ok && nonNeg, lhs, z, nonNeg };
}