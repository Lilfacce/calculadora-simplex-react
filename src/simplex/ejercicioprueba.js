import { simplexMax } from "./simplexMax";

// Aquí probamos lo que el inge pide
export function runDevExamples() {

  console.log("===== EJERCICIO 1 =====");

  const A1 = [
    [2, 1, 2],
    [1, 2, 1],
  ];

  const b1 = [5, 5];
  const c1 = [1, 3, 5];

  const r1 = simplexMax({
    A: A1,
    b: b1,
    c: c1,
    bland: true
  });

  console.log("Resultado EJ1:", r1.status);
  console.log("x =", r1.x);
  console.log("Z =", r1.z);

  // después de EJ1
  if (r1.steps) printIterations(r1.steps, 3, 2);

  console.log("===== EJERCICIO 2 =====");

  const A2 = [
    [1, 0, 6, 3],
    [2, 1, 1, 2],
    [3, 6, 1, 2],
    [4, 0, 4, 1],
  ];

  const b2 = [12, 12, 18, 4];
  const c2 = [5, 3, 4, 2];

  const r2 = simplexMax({
    A: A2,
    b: b2,
    c: c2,
    bland: true
  });

  console.log("Resultado EJ2:", r2.status);
  console.log("x =", r2.x);
  console.log("Z =", r2.z);

  // después de EJ2
  if (r2.steps) printIterations(r2.steps, 4, 4);
  
}
function makeHeaders(numVars, numCons) {
  const xs = Array.from({ length: numVars }, (_, i) => `x${i + 1}`);
  const ss = Array.from({ length: numCons }, (_, i) => `s${i + 1}`);
  return [...xs, ...ss, "RHS"];
}

function formatTableauForConsole(tableau, headers, basis, tol = 1e-9) {
  // devuelve arreglo de objetos para console.table
  // cada fila: { Base: 'x1'/'s2'/'Z', x1:..., ..., RHS:... }
  const rows = [];
  const m = tableau.length - 1; // últimas es Z
  const cols = headers.length;

  for (let i = 0; i < tableau.length; i++) {
    const obj = {};
    const baseName =
      i === m ? "Z" : (basis && basis[i] != null ? headers[basis[i]] : `Fila${i + 1}`);
    obj["Base"] = baseName;

    for (let j = 0; j < cols; j++) {
      let v = tableau[i][j];
      if (Math.abs(v) < tol) v = 0;
      // redondeo bonito
      obj[headers[j]] = Math.round(v * 1e6) / 1e6;
    }
    rows.push(obj);
  }

  return rows;
}
function printIterations(steps, numVars, numCons) {
  const headers = makeHeaders(numVars, numCons);

  steps.forEach((s, idx) => {
    const note = s.note || `Paso ${idx}`;
    const isInitial = note.toLowerCase().includes("inicial");
    const isAfterPivot = note.toLowerCase().includes("después") || note.toLowerCase().includes("despues");
    const isOptimal = note.toLowerCase().includes("óptimo") || note.toLowerCase().includes("optimo");

    if (isInitial || isAfterPivot || isOptimal) {
      console.log(`\n=== ${note} ===`);
      const rows = formatTableauForConsole(s.tableau, headers, s.basis);
      console.table(rows);
    }
  });
}