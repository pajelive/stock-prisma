// components/dashboard/RecentActivityList.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingDown, RotateCcw } from "lucide-react";

export default function RecentActivityList({ movimentacoes }) {
  const getIconAndColor = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return { Icon: Package, bgColorClass: 'bg-green-100 text-green-700' };
      case 'saida':
        return { Icon: TrendingDown, bgColorClass: 'bg-red-100 text-red-700' };
      case 'devolucao':
        return { Icon: RotateCcw, bgColorClass: 'bg-blue-100 text-blue-700' };
      default:
        // Retorne um fallback ou null
        return { Icon: null, bgColorClass: 'bg-gray-100 text-gray-700' }; // Fallback
        // OU return null; se quiser pular itens inválidos completamente
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movimentacoes.map((mov) => {
            const result = getIconAndColor(mov.tipo);

            // Verifique se getIconAndColor retornou um objeto válido
            if (!result || !result.Icon) {
                 console.warn(`Ícone não encontrado para o tipo: ${mov.tipo} na Atividade Recente`);
                 return null; // Retorna null para este item do map, não um objeto
            }

            const { Icon, bgColorClass } = result;

            return (
              <div key={mov.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${bgColorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{mov.descricao}</p>
                    <p className="text-sm text-muted-foreground">por {mov.usuario}</p>
                    <p className="text-xs text-muted-foreground capitalize">{mov.tipo}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{mov.data}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}