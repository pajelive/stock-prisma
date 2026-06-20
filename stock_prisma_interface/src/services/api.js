import { useEffect, useState } from "react";
import api from "../../services/api";
import Compartimento from "../../components/Compartimento";

export default function Compartimentos() {
    const [compartimentos, setCompartimentos] = useState([]);

    useEffect(() => {
        async function carregarCompartimentos() {
            try {
                const response = await api.get("/compartimentos");
                setCompartimentos(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        carregarCompartimentos();
    }, []);

    return (
        <div className="grid grid-cols-4 gap-6">
            {compartimentos.map((comp) => (
                <Compartimento
                    key={comp.id}
                    compartimento={comp}
                />
            ))}
        </div>
    );
}