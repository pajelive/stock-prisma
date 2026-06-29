"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoveUp, MoveDown, RotateCcw } from "lucide-react"

export default function MovementsTimeline({ movimentacoes }) {
  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'entrada': return MoveUp
      case 'saida': return MoveDown
      case 'devolucao': return RotateCcw
      default: return MoveUp
    }
  }

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'entrada': return 'bg-green-500'
      case 'saida': return 'bg-red-500'
      case 'devolucao': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Movimentações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movimentacoes.slice(0, 5).map((mov) => {
            const Icon = getTipoIcon(mov.tipo)
            const colorClass = getTipoColor(mov.tipo)

            return (
              <div key={mov.id} className="relative pl-8 py-1">
                <div className={`absolute left-0 top-2 h-4 w-4 rounded-full ${colorClass} border-4 border-background`} />
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{mov.descricao}</span>
                    <Badge variant="outline" className="capitalize">
                      {mov.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    por {mov.usuario} • {mov.data}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}