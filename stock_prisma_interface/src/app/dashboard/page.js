import AdminGuard from "@/auth/AdminGuard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import InventoryTable from "@/components/dashboard/InventoryTable";
import StatCard from "@/components/dashboard/StatCard";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function Dashboard() {
    const inventory = [
        {
            id: 1,
            name: "Furadeira Bosch",
            type: "Ferramenta",
            quantity: 8,
            status: "OK",
        },
        {
            id: 2,
            name: "Luva de Segurança",
            type: "EPI",
            quantity: 3,
            status: "Baixo",
        },
        {
            id: 3,
            name: "Parafuso 6mm",
            type: "Insumo",
            quantity: 350,
            status: "OK",
        },
    ];
    return (
        <AdminGuard>
            <div className="space-y-8 p-6">

                {/* Cabeçalho */}
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Visão geral do almoxarifado.
                    </p>
                </div>

                {/* KPIs */}
                <StatsGrid>
                    <StatCard title="Itens cadastrados" value="128" />
                    <StatCard title="Ferramentas" value="46" />
                    <StatCard title="Insumos" value="82" />
                    <StatCard title="Estoque baixo" value="7" />
                </StatsGrid>

                {/* Linha principal */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* ocupa 2 colunas */}
                    <div className="lg:col-span-2">
                        <DashboardCard title="Itens recentes">
                            <InventoryTable items={inventory} />
                        </DashboardCard>
                    </div>

                    {/* ocupa 1 coluna */}
                    <DashboardCard title="Últimas movimentações">
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">João retirou uma Furadeira Bosch</p>
                                <p className="text-sm text-muted-foreground">há 10 minutos</p>
                            </div>

                            <div>
                                <p className="font-medium">Entrada de 50 Parafusos</p>
                                <p className="text-sm text-muted-foreground">há 35 minutos</p>
                            </div>

                            <div>
                                <p className="font-medium">Maria devolveu um Alicate</p>
                                <p className="text-sm text-muted-foreground">há 1 hora</p>
                            </div>
                        </div>
                    </DashboardCard>

                </div>

                {/* Linha inferior */}
                <DashboardCard title="Compartimentos">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold">A-01</h3>
                            <p className="text-sm text-muted-foreground">35 itens</p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold">A-02</h3>
                            <p className="text-sm text-muted-foreground">18 itens</p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold">B-01</h3>
                            <p className="text-sm text-muted-foreground">12 itens</p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="font-semibold">B-02</h3>
                            <p className="text-sm text-muted-foreground">27 itens</p>
                        </div>

                    </div>
                </DashboardCard>

            </div>
        </AdminGuard>
    );
}