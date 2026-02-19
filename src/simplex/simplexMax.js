export function simplexMax({ A, b, c, maxIter = 100, tol = 1e-9, bland = false }) {
  const m = A.length;
  const n = c.length;

  if (m === 0 || n === 0) {
    return { status: "ERROR_INPUT", message: "A, b, c no pueden estar vacíos." };
  }
  if (b.length !== m) {
    return { status: "ERROR_INPUT", message: "b debe tener m elementos." };
  }
  if (A.some(row => row.length !== n)) {
    return { status: "ERROR_INPUT", message: "Cada fila de A debe tener n columnas." };
  }

  // Este motor asume b>=0 (si hay b<0, hay que multiplicar esa restricción por -1)
  if (b.some(v => v < -tol)) {
    return { status: "ERROR_B_NEGATIVO", message: "Este motor asume b>=0. Si hay b<0, multiplica la restricción por -1." };
  }

  const cols = n + m + 1; // x + slack + RHS
  const T = Array.from({ length: m + 1 }, () => Array(cols).fill(0));

  // Restricciones
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) T[i][j] = A[i][j];
    T[i][n + i] = 1;          // slack
    T[i][cols - 1] = b[i];    // RHS
  }

  // Fila Z: -c
  for (let j = 0; j < n; j++) T[m][j] = -c[j];

  // Base inicial: slacks
  const basis = Array.from({ length: m }, (_, i) => n + i);

  const steps = [];
  const snap = (note, extra = {}) => {
    steps.push({
      note,
      ...extra,
      basis: [...basis],
      tableau: T.map(r => r.map(v => (Math.abs(v) < tol ? 0 : v)))
    });
  };

  function chooseEntering() {
    const zRow = T[m];
    if (bland) {
      for (let j = 0; j < cols - 1; j++) if (zRow[j] < -tol) return j;
      return -1;
    }
    let best = -1;
    let mostNeg = -tol;
    for (let j = 0; j < cols - 1; j++) {
      if (zRow[j] < mostNeg) {
        mostNeg = zRow[j];
        best = j;
      }
    }
    return best;
  }

  function chooseLeaving(pivotCol) {
    let bestRow = -1;
    let bestRatio = Infinity;

    for (let i = 0; i < m; i++) {
      const a = T[i][pivotCol];
      const rhs = T[i][cols - 1];
      if (a > tol) {
        const ratio = rhs / a;
        if (ratio < bestRatio - tol) {
          bestRatio = ratio;
          bestRow = i;
        } else if (Math.abs(ratio - bestRatio) <= tol && bland && bestRow !== -1) {
          if (basis[i] < basis[bestRow]) bestRow = i;
        }
      }
    }
    return bestRow;
  }

  function pivot(pRow, pCol) {
    const piv = T[pRow][pCol];

    // normalizar fila pivote
    for (let j = 0; j < cols; j++) T[pRow][j] /= piv;

    // hacer ceros en la columna pivote
    for (let i = 0; i < m + 1; i++) {
      if (i === pRow) continue;
      const factor = T[i][pCol];
      if (Math.abs(factor) > tol) {
        for (let j = 0; j < cols; j++) T[i][j] -= factor * T[pRow][j];
      }
    }
    basis[pRow] = pCol;
  }

  snap("Tabla inicial");

  for (let iter = 0; iter < maxIter; iter++) {
    const enter = chooseEntering();
    if (enter === -1) {
      // Óptimo
      const x = Array(n).fill(0);
      for (let i = 0; i < m; i++) {
        const varIndex = basis[i];
        if (varIndex < n) x[varIndex] = T[i][cols - 1];
      }
      const z = T[m][cols - 1];
      snap("Óptimo encontrado");
      return { status: "OPTIMO", x, z, steps };
    }

    const leave = chooseLeaving(enter);
    if (leave === -1) {
      snap("No acotado");
      return { status: "NO_ACOTADO", steps };
    }

    snap(`Iter ${iter + 1}: entra col ${enter}, sale fila ${leave}`, { entering: enter, leaving: leave });
    pivot(leave, enter);
    snap(`Después pivote iter ${iter + 1}`);
  }

  return { status: "MAX_ITER", steps };
}