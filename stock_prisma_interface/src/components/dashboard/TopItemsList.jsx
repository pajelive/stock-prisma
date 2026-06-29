import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function TopItemsList({ title, items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const porcentagem = Math.round((item.quantidade / item.total) * 100)
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{item.nome}</span>
                  <span className="text-sm text-muted-foreground">{porcentagem}%</span>
                </div>
                <Progress value={porcentagem} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}