// components/dashboard/MovementsTimeline.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoveUp, MoveDown, RotateCcw } from "lucide-react" // Importa todos os ícones necessários

// Função auxiliar para obter o ícone - retorna o componente ou null
const getTipoIcon = (tipo) => {
  const icons = {
    entrada: MoveUp,
    saida: MoveDown,
    devolucao: RotateCcw
  }
  return icons[tipo] || null // Retorna null se o tipo não for encontrado
}

const getTipoColor = (tipo) => {
  switch(tipo) {
    case 'entrada': return 'bg-green-100 text-green-700'
    case 'saida': return 'bg-red-100 text-red-700'
    case 'devolucao': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function MovementsTimeline({ movimentacoes }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Movimentações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movimentacoes.slice(0, 5).map((mov) => {
            const IconComponent = getTipoIcon(mov.tipo)
            const colorClass = getTipoColor(mov.tipo)

            // Verifica se o ícone existe antes de tentar renderizar
            if (!IconComponent) {
              console.warn(`Ícone não encontrado para o tipo: ${mov.tipo}`);
              return null; // Retorna null para este item do map, não um objeto
            }

            return (
              <div key={mov.id} className="relative pl-8 py-1">
                <div className={`absolute left-0 top-2 h-4 w-4 rounded-full ${colorClass.split(' ')[0].replace('bg-', 'bg-')} border-4 border-background`} />
                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
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