import { Card } from "@/components/ui/card";

export default function StatCard({ title, value }) {
    return (
        <Card className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {title}
            </p>

            <h2 className="mt-3 text-4xl font-bold">
                {value}
            </h2>
        </Card>
    );
}