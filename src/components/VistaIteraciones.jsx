export default function VistaIteraciones({ iteraciones }) {
  if (!iteraciones || iteraciones.length === 0) return null;

  return (
    <div>
      <h3>Iteraciones</h3>

      {iteraciones.map((it, idx) => (
        <div key={idx} style={{ marginBottom: "20px" }}>
          <h4>Iteración {it.iter}</h4>
          <p>{it.note}</p>

          {it.tableau && (
            <table border="1">
              <tbody>
                {it.tableau.map((fila, i) => (
                  <tr key={i}>
                    {fila.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}