export default function TipoPill({ tipo }) {
  const base = "px-2 py-1 rounded-full text-xs font-medium";

  const estilos = {
    entrada: "bg-green-100 text-green-700",
    saida: "bg-red-100 text-red-700",
    ajuste: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-600",
  };

  const cor = estilos[tipo] || estilos.default;

  return (
    <span className={`${base} ${cor}`}>
      {tipo}
    </span>
  );
}