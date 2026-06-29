import { Card } from "@/components/ui/card";

export default function StatCard({ title, value }) {
    return (
        <Card className="p-4">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </Card>
    );
}