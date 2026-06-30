// components/dashboard/StatCard.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, Toolbox, Package as PackageIcon, Shield, Warehouse, TrendingDown as TrendingDownIcon, Activity } from "lucide-react";

const iconMap = {
  Grid3X3,
  Toolbox,
  Package: PackageIcon,
  Shield,
  Warehouse,
  TrendingDown: TrendingDownIcon,
  Activity,
  // Adicione outros ícones conforme necessário
};

export default function StatCard({
  title,
  value,
  iconId,
  trend,
  color = 'primary'
}) {
  const Icon = iconId ? iconMap[iconId] : null; // Obtenha o componente real do mapa

  const colorClasses = {
    primary: 'bg-blue-50 text-blue-700',
    secondary: 'bg-gray-50 text-gray-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    destructive: 'bg-red-500 text-red-50 text-red-700', // Corrigido typo?
  }

  // Garanta que color seja uma chave válida
  const bgColorClass = colorClasses[color] || colorClasses.primary;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && ( // Verifica se Icon existe antes de tentar renderizar
          <div className={`p-2 rounded-full ${bgColorClass.split(' ')[0]}`}> {/* Usa apenas a classe de background */}
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && ( // Verifica se trend existe
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