// Adicione esta linha no TOPO do arquivo
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// Importe os ícones condicionalmente ou use-os dentro do componente cliente
import { MoveUp, MoveDown } from "lucide-react"

// Função auxiliar para obter o ícone
const getTipoIcon = (tipo) => {
  // Agora que estamos no cliente, podemos usar os ícones
  const icons = {
    entrada: MoveUp,
    saida: MoveDown,
    devolucao: () => import("lucide-react").then(ic => ic.RotateCcw) // Importação dinâmica para devolucao
  }
  return icons[tipo] || MoveUp
}

const getTipoColor = (tipo) => {
  switch(tipo) {
    case 'entrada': return 'bg-green-500'
    case 'saida': return 'bg-red-500'
    case 'devolucao': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

export default function MovementsTimeline({ movimentacoes }) {
  // Agora usamos os ícones dentro do corpo do componente cliente
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Movimentações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movimentacoes.slice(0, 5).map((mov) => {
            const IconComponent = getTipoIcon(mov.tipo)

            // Se IconComponent for uma função assíncrona (importação dinâmica)
            if (typeof IconComponent === 'function' && IconComponent.name === 'bound import') {
               // Retorna um placeholder ou um carregamento enquanto o ícone é importado
              return (
                <div key={mov.id} className="relative pl-8 py-1">
                  <div className={`absolute left-0 top-2 h-4 w-4 rounded-full ${getTipoColor(mov.tipo)} border-4 border-background`} />
                  <div className="ml-2">
                    <div className="flex items-center gap-2">
                      {/* Placeholder ou carregamento */}
                      <span className="h-4 w-4 inline-block">...</span>
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
            }

            // Caso contrário, renderiza normalmente
            return (
              <div key={mov.id} className="relative pl-8 py-1">
                <div className={`absolute left-0 top-2 h-4 w-4 rounded-full ${getTipoColor(mov.tipo)} border-4 border-background`} />
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