import { useState, useEffect } from "react";
import { solveSimplexMax } from "../simplex/solveSimplex";
import EntradaMatriz from "./EntradaMatriz";
import EntradaVector from "./EntradaVector";
import VistaResultado from "./VistaResultado";
import VistaIteraciones from "./VistaIteraciones";

function crearMatriz(filas, columnas) {
  return Array.from({ length: filas }, () =>
    Array.from({ length: columnas }, () => 0)
  );
}

function crearVector(n) {
  return Array.from({ length: n }, () => 0);
}

export default function SimplexFormulario() {
  const [numVars, setNumVars] = useState(2);
  const [numCons, setNumCons] = useState(2);

  const [A, setA] = useState(crearMatriz(2, 2));
  const [b, setB] = useState(crearVector(2));
  const [c, setC] = useState(crearVector(2));

  const [mostrarIteraciones, setMostrarIteraciones] = useState(true);
  const [resultado, setResultado] = useState(null);

  // Reajustar tamaños si cambian variables o restricciones
  useEffect(() => {
    setA(crearMatriz(numCons, numVars));
    setB(crearVector(numCons));
    setC(crearVector(numVars));
  }, [numVars, numCons]);

  function resolver() {
    const res = solveSimplexMax({
      numVars,
      numCons,
      A,
      b,
      c,
      showIterations: mostrarIteraciones,
    });
    setResultado(res);
  }

  return (
    <div>
      <h2>Calculadora Simplex (Maximización)</h2>

      <label>
        Variables:
        <input
          type="number"
          min="1"
          value={numVars}
          onChange={(e) => setNumVars(Number(e.target.value))}
        />
      </label>

      <label>
        Restricciones:
        <input
          type="number"
          min="1"
          value={numCons}
          onChange={(e) => setNumCons(Number(e.target.value))}
        />
      </label>

      <h3>Matriz A</h3>
      <EntradaMatriz value={A} onChange={setA} />

      <h3>Vector b</h3>
      <EntradaVector value={b} onChange={setB} />

      <h3>Vector c (función objetivo)</h3>
      <EntradaVector value={c} onChange={setC} />

      <label>
        <input
          type="checkbox"
          checked={mostrarIteraciones}
          onChange={(e) => setMostrarIteraciones(e.target.checked)}
        />
        Mostrar iteraciones
      </label>

      <br />
      <button onClick={resolver}>Resolver</button>

      <VistaResultado resultado={resultado} />
      <VistaIteraciones iteraciones={resultado?.iterations} />
    </div>
  );
}