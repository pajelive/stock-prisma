export default function StatsGrid({ children }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {children}
        </div>
    );
}