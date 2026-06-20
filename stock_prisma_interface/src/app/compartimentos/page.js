import Compartimento from '../../components/Compartimento'

export default function Compartimentos({ compartimentos, selecionarCompartimento }) {
    return (
        <div className="grid grid-cols-4 gap-6">
            {compartimentos.map((comp) => (
                <Compartimento
                    key={comp.id}
                    compartimento={comp}
                    onClick={() => selecionarCompartimento(comp)}
                />
            ))}
        </div>
    )
}