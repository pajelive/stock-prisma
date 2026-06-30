// Adicione esta linha no TOPO do arquivo
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, Toolbox, Package, Shield, Warehouse, TrendingDown, Activity, Package as PackageIcon, TrendingDown as TrendingDownIcon, RotateCcw } from "lucide-react"; // Importe todos os ícones necessários

// Mapeie os IDs para os componentes de ícone
const iconMap = {
  Grid3X3,
  Toolbox,
  Package: PackageIcon, // Usar alias para evitar conflito com a prop 'Package' acidentalmente
  Shield,
  Warehouse,
  TrendingDown: TrendingDownIcon, // Usar alias para evitar conflito
  Activity,
  // Adicione outros ícones conforme necessário
};

export default function StatCard({
  title,
  value,
  iconId, // Recebe o ID do ícone
  trend,
  color = 'primary'
}) {
  const Icon = iconId ? iconMap[iconId] : null; // Obtenha o componente real do mapa

  const colorClasses = {
    primary: 'bg-blue-50 text-blue-700',
    secondary: 'bg-gray-50 text-gray-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    destructive: 'bg-red-50 text-red-700',
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`p-2 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  )
}