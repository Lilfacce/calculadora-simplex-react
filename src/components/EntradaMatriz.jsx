export default function EntradaMatriz({ value, onChange }) {
  function cambiar(i, j, nuevoValor) {
    const nueva = value.map((fila) => [...fila]);
    nueva[i][j] = Number(nuevoValor);
    onChange(nueva);
  }

  return (
    <table border="1">
      <tbody>
        {value.map((fila, i) => (
          <tr key={i}>
            {fila.map((celda, j) => (
              <td key={j}>
                <input
                  type="number"
                  value={celda}
                  onChange={(e) => cambiar(i, j, e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}