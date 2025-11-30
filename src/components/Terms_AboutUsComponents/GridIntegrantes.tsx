
import "./GridIntegrantes.css"

const CardGrid = (props: CardGridProps) => {

    return <div className="container">
        <div className="row">
            {
                props.miembros.map((integrante: Integrante) => {
                    return <div key={integrante.cod} className="col-md-4 mt-4 d-flex">
                        <div>
                            <div className="card card_integrante">
                                <img src={integrante.foto} className="card-img-top imagen_integrante" />
                                <div className="card-body">
                                    <h5 className="card-title">{integrante.nombre}</h5>
                                    <p className="card-text">Código: {integrante.cod}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}

interface CardGridProps {
    miembros: Integrante[]
}

export type Integrante = {
    nombre: string;
    cod: number;
    foto: string
}

export default CardGrid