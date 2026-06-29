"use client"

import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
    const styles = {
        OK: "bg-green-500/10 text-green-600",
        Baixo: "bg-yellow-500/10 text-yellow-600",
        Ruim: "bg-red-500/10 text-red-600",
    };

    return (
        <Badge className={styles[status] || ""}>
            {status}
        </Badge>
    );
}