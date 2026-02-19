import { simplexMax } from "./simplexMax";

export function solveSimplexMax({ numVars, numCons, A, b, c, showIterations }) {
  // 1) Validaciones (lo que el inge espera que no falle)
  if (!Number.isInteger(numVars) || !Number.isInteger(numCons) || numVars <= 0 || numCons <= 0) {
    return { status: "ERROR_INPUT", message: "numVars y numCons deben ser enteros > 0." };
  }
  if (!Array.isArray(A) || A.length !== numCons) {
    return { status: "ERROR_INPUT", message: "A debe tener numCons filas." };
  }
  if (!Array.isArray(b) || b.length !== numCons) {
    return { status: "ERROR_INPUT", message: "b debe tener numCons elementos." };
  }
  if (!Array.isArray(c) || c.length !== numVars) {
    return { status: "ERROR_INPUT", message: "c debe tener numVars elementos." };
  }
  if (A.some(row => !Array.isArray(row) || row.length !== numVars)) {
    return { status: "ERROR_INPUT", message: "Cada fila de A debe tener numVars columnas." };
  }

  // 2) Resolver (maximización)
  const result = simplexMax({ A, b, c, bland: true });

  if (result.status !== "OPTIMO") {
    return { status: result.status, message: result.message, iterations: showIterations ? normalizeSteps(result.steps) : undefined };
  }

  // 3) Empaquetar salida
  const out = {
    status: "OPTIMO",
    solution: { x: result.x, z: result.z },
  };

  if (showIterations) {
    out.iterations = normalizeSteps(result.steps);
  }

  return out;
}

function normalizeSteps(steps = []) {
  // En simplexMax guardamos "Tabla inicial", "Iter ...", "Después pivote ..."
  // Aquí lo dejamos como registros con tableau + base y (si existe) pivote.
  let iter = 0;
  const normalized = [];

  for (const s of steps) {
    const isPivotStep = typeof s.entering === "number" && typeof s.leaving === "number";
    if (isPivotStep) iter += 1;

    normalized.push({
      iter,
      enteringCol: s.entering ?? null,
      leavingRow: s.leaving ?? null,
      basis: s.basis ?? null,
      tableau: s.tableau ?? null,
      note: s.note ?? ""
    });
  }
  return normalized;
}