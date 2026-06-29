import AdminGuard from "@/auth/AdminGuard";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Substitua 'Tool' por 'Toolbox'
import { Grid3X3, Toolbox, Package, Shield, Warehouse, TrendingDown, Activity } from "lucide-react";
import AlertCard from "@/components/dashboard/AlertCard";
import MovementsTimeline from "@/components/dashboard/MovementsTimeline";
import CompartmentsCard from "@/components/dashboard/CompartmentsCard";
import TopItemsList from "@/components/dashboard/TopItemsList";
import InventoryDistributionChart from "@/components/dashboard/InventoryDistributionChart";
import EntriesVsExitsChart from "@/components/dashboard/EntriesVsExitsChart";

export default function Dashboard() {
  // Dados mockados
  const stats = [
    { title: "Total de Itens", value: "1,248", icon: Grid3X3, trend: { value: "+12%", positive: true }, color: 'primary' },
    // Substitua 'Tool' por 'Toolbox' aqui também
    { title: "Ferramentas", value: "248", icon: Toolbox, trend: { value: "+5%", positive: true }, color: 'secondary' },
    { title: "Insumos", value: "632", icon: Package, trend: { value: "+8%", positive: true }, color: 'success' },
    { title: "EPIs", value: "156", icon: Shield, trend: { value: "+3%", positive: false }, color: 'warning' },
    { title: "Compartimentos", value: "24", icon: Warehouse, trend: { value: "0%", positive: true }, color: 'primary' },
    { title: "Itens em Estoque Baixo", value: "12", icon: TrendingDown, trend: { value: "-2", positive: true }, color: 'destructive' },
    { title: "Movimentações Hoje", value: "34", icon: Activity, trend: { value: "+6%", positive: true }, color: 'secondary' },
  ]

  const alerts = [
    { title: "Estoque Baixo", message: "Luva de Segurança abaixo do mínimo recomendado", type: 'warning' },
    { title: "Compartimento Cheio", message: "Compartimento A-03 atingiu 95% de capacidade", type: 'warning' },
    { title: "Item Crítico", message: "Capacete de Segurança com 2 unidades restantes", type: 'error' },
  ]

  const movimentacoes = [
    { id: "1", descricao: "Entrada de 50 Parafusos", tipo: "entrada", data: "há 15 minutos", usuario: "João Silva" },
    { id: "2", descricao: "Saída de Furadeira Bosch", tipo: "saida", data: "há 30 minutos", usuario: "Maria Oliveira" },
    { id: "3", descricao: "Devolução de Alicate", tipo: "devolucao", data: "há 1 hora", usuario: "Carlos Santos" },
    { id: "4", descricao: "Entrada de Luvas de Segurança", tipo: "entrada", data: "há 2 horas", usuario: "Ana Costa" },
    { id: "5", descricao: "Saída de Capacete", tipo: "saida", data: "há 3 horas", usuario: "Pedro Almeida" },
  ]

  const compartimentos = [
    { id: "A-01", nome: "A-01", totalItens: 35, capacidadeMaxima: 50 },
    { id: "A-02", nome: "A-02", totalItens: 18, capacidadeMaxima: 40 },
    { id: "B-01", nome: "B-01", totalItens: 12, capacidadeMaxima: 30 },
    { id: "B-02", nome: "B-02", totalItens: 27, capacidadeMaxima: 35 },
  ]

  const itensMaisUtilizados = [
    { nome: "Furadeira Bosch", quantidade: 45, total: 100 },
    { nome: "Alicate Universal", quantidade: 38, total: 100 },
    { nome: "Luvas de Segurança", quantidade: 32, total: 100 },
    { nome: "Capacete de Segurança", quantidade: 28, total: 100 },
    { nome: "Serra Circular", quantidade: 25, total: 100 },
  ]

  const distribuicaoInventario = [
    { name: "Ferramentas", value: 248, color: "#3b82f6" },
    { name: "Insumos", value: 632, color: "#10b981" },
    { name: "EPIs", value: 156, color: "#f59e0b" },
    { name: "Materiais", value: 212, color: "#ef4444" },
  ]

  const entradasVSsaidas = [
    { mes: "Jan", entradas: 120, saidas: 85 },
    { mes: "Fev", entradas: 150, saidas: 95 },
    { mes: "Mar", entradas: 110, saidas: 120 },
    { mes: "Abr", entradas: 180, saidas: 140 },
    { mes: "Mai", entradas: 160, saidas: 110 },
    { mes: "Jun", entradas: 140, saidas: 130 },
  ]

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard do Almoxarifado</h1>
            <p className="text-muted-foreground">
              Visão geral do estoque e movimentações do almoxarifado
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
              />
            ))}
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Coluna esquerda */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gráfico Entradas vs Saídas */}
              <Card>
                <CardHeader>
                  <CardTitle>Entradas vs Saídas (Últimos 6 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                  <EntriesVsExitsChart data={entradasVSsaidas} />
                </CardContent>
              </Card>

              {/* Alertas */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertas Importantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <AlertCard
                        key={index}
                        title={alert.title}
                        message={alert.message}
                        type={alert.type}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna direita */}
            <div className="space-y-6">
              {/* Últimas movimentações */}
              <MovementsTimeline movimentacoes={movimentacoes} />

              {/* Itens mais utilizados */}
              <TopItemsList
                title="Itens Mais Utilizados"
                items={itensMaisUtilizados}
              />
            </div>
          </div>

          {/* Segunda linha */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Distribuição do inventário */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição do Inventário</CardTitle>
                </CardHeader>
                <CardContent>
                  <InventoryDistributionChart data={distribuicaoInventario} />
                </CardContent>
              </Card>
            </div>

            {/* Compartimentos */}
            <CompartmentsCard compartimentos={compartimentos} />
          </div>

          {/* Terceira linha */}
          <div className="grid grid-cols-1 gap-6">
            {/* Atividade recente */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movimentacoes.map((mov) => (
                    <div key={mov.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          mov.tipo === 'entrada' ? 'bg-green-100 text-green-700' :
                          mov.tipo === 'saida' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {mov.tipo === 'entrada' ? <Package className="h-4 w-4" /> :
                           mov.tipo === 'saida' ? <TrendingDown className="h-4 w-4" /> :
                           <RotateCcw className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{mov.descricao}</p>
                          <p className="text-sm text-muted-foreground">por {mov.usuario}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{mov.data}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}