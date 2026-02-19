import { useEffect, useRef } from 'react';
import { runDevExamples } from './simplex/ejercicioprueba';

function App() {// Ejecuta ejemplos de desarrollo al montar el componente
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    runDevExamples();
  }, []);
  return <h1>Prueba calculadora de mierda  (abrir consola)</h1>
}

export default App;
