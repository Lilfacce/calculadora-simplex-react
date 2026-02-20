export default function VistaResultado({ resultado }) {
  if (!resultado) return null;

  if (resultado.status !== "OPTIMO") {
    return (
      <div>
        <h3>Error</h3>
        <p>{resultado.status}</p>
      </div>
    );
  }

  const { x, z } = resultado.solution;

  return (
    <div>
      <h3>Resultado Óptimo</h3>
      <p><strong>Z = {z}</strong></p>
      <ul>
        {x.map((valor, i) => (
          <li key={i}>
            x{i + 1} = {valor}
          </li>
        ))}
      </ul>
    </div>
  );
}