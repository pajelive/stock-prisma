"use client"

import { Card } from "@/components/ui/card";

export default function DashboardCard({ title, children }) {
    return (
        <Card className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
                {title}
            </h3>

            <div>{children}</div>
        </Card>
    );
}