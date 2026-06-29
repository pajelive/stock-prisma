import AdminGuard from "@/auth/AdminGuard";

export default function Dashboard() {
    return (
        <AdminGuard>
            <div>
                <h1>Dashboard Admin</h1>
                <p>Somente administradores acessam isso</p>
            </div>
        </AdminGuard>
    );
}