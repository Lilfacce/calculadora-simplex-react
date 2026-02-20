export default function EntradaVector({ value, onChange }) {
  function cambiar(i, nuevoValor) {
    const nuevo = [...value];
    nuevo[i] = Number(nuevoValor);
    onChange(nuevo);
  }

  return (
    <div>
      {value.map((v, i) => (
        <input
          key={i}
          type="number"
          value={v}
          onChange={(e) => cambiar(i, e.target.value)}
          style={{ marginRight: "8px" }}
        />
      ))}
    </div>
  );
}