import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CompartmentsCard({ compartimentos }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {compartimentos.map((comp) => {
            const porcentagem = Math.round((comp.totalItens / comp.capacidadeMaxima) * 100)
            return (
              <div key={comp.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{comp.nome}</h3>
                  <span className="text-xs text-muted-foreground">
                    {porcentagem}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {comp.totalItens} / {comp.capacidadeMaxima} itens
                </p>
                <Progress value={porcentagem} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}