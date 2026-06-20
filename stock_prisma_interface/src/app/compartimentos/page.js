import Compartimento from '../../components/Compartimento'

export default function Compartimentos() {
    return (
        <div className="grid grid-cols-4 gap-6">
            {compartiments.map((comp)=>{{
                <Compartimento>
                  key = {comp.id}
                  compartimento = {comp}
                  onClick={() => selecionarCompartimento(comp)}
                </Compartimento>
            }})

            }
        </div>
    )
}