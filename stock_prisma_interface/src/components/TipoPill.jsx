export default function TipoPill({ tipo }) {
  const base = "px-2 py-1 rounded-full text-xs font-medium";

  const estilos = {
    Retirada:   "bg-orange-100 text-orange-700",
    Devolucao:  "bg-green-100 text-green-700",
    Consumo:    "bg-yellow-100 text-yellow-700",
    Entrada:    "bg-blue-100 text-blue-700",
    Inventario: "bg-gray-100 text-gray-600",
  }

  const cor = estilos[tipo] || estilos.default;

  return (
    <span className={`${base} ${cor}`}>
      {tipo}
    </span>
  );
}