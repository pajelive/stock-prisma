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
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground">
                        Visão geral do almoxarifado.
                    </p>
                </div>

                <StatsGrid>
                    <StatCard title="Itens cadastrados" value="128" />
                    <StatCard title="Ferramentas" value="46" />
                    <StatCard title="Insumos" value="82" />
                    <StatCard title="Estoque baixo" value="7" />
                </StatsGrid>

                <DashboardCard title="Itens do Almoxarifado">
                    <InventoryTable items={inventory} />
                </DashboardCard>
            </div>
        </AdminGuard>
    );
}