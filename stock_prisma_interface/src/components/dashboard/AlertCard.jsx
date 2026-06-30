// components/dashboard/AlertCard.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info } from "lucide-react" // Importe os ícones específicos

// Mapeie tipos para ícones
const iconMap = {
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

export default function AlertCard({ title, message, type }) { // Remova 'icon' do destructuring
  const Icon = iconMap[type]; // Obtenha o ícone do mapa
  const typeConfig = {
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'warning' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'destructive' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'secondary' },
  }

  const config = typeConfig[type]

  // Verifique se o tipo é válido
  if (!config) {
    console.warn(`Tipo de alerta desconhecido: ${type}`);
    return null; // Ou renderize um fallback
  }

  return (
    <Card className={`${config.bg} ${config.border}`}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          {Icon && <Icon className="h-5 w-5 text-current mt-0.5 flex-shrink-0" />} {/* Use o ícone mapeado */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
              <Badge variant={config.badge}>{type}</Badge>
            </div>
            <p className={`mt-1 text-sm ${config.text}`}>{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}