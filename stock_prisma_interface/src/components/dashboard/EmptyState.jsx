export default function EmptyState({ title, description }) {
    return (
        <div className="text-center py-10 text-muted-foreground">
            <p className="font-medium">{title}</p>
            <p className="text-sm">{description}</p>
        </div>
    );
}