import TelaLogin from "@/components/TelaLogin";

export default function Login() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <TelaLogin titulo="Histórico" dados={movimentacoes} />
        </div>
    )
}