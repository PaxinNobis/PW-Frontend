import { useState } from "react"
import { Link } from "react-router-dom"

import "./Nosotros.css"
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

import GridIntegrantes, { type Integrante } from "./GridIntegrantes"
import type { User } from "../../GlobalObjects/Objects_DataTypes"

interface NosotrosProps {
    GetUser: () => User | null;
}

const personas: Integrante[] = [
    {
        nombre: "Sebastian Balbuena Herrera ",
        cod: 20230286,
        foto: "https://media.licdn.com/dms/image/v2/D5603AQHsygdu-WS_Hg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726353305108?e=1765411200&v=beta&t=7fDN_PFZ93X6Y8wsDl5v8pCpIB6VOBFiglnzKaUg7uo"

    },
    {
        nombre: "Yusef Barreto Ibrahim",
        cod: 20224518,
        foto: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/001.png"

    },
    {
        nombre: "Victoria Herrera Paredes",
        cod: 20225503,
        foto: "https://media.licdn.com/dms/image/v2/D5603AQFTOWJ35_itMg/profile-displayphoto-shrink_400_400/B56ZZbj7zjGQAg-/0/1745292869268?e=1765411200&v=beta&t=PAcOTajsqbDQyY9YxGArxxc5GfOH6DDvDmxfFzE2g-4"

    },
    {
        nombre: "Cossete Mañuico Jauregui",
        cod: 20211606,
        foto: "https://media.licdn.com/dms/image/v2/D4D03AQF8nSNL_IQbNg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1713766799500?e=1765411200&v=beta&t=Yr6_Isfy1ai1H50n3W3JYxjgS4dQtCOVkbjD4CtJm1A"

    },
    {
        nombre: "Alvaro Mera Incio",
        cod: 20224973,
        foto: "https://media.licdn.com/dms/image/v2/D4E03AQHZ2tt-uQDjVA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726367165721?e=1765411200&v=beta&t=uztpPJmo89Mq9mc-fzMBS-UDregLwytPr_it7qFkQDE"

    },
    {
        nombre: "Melissa Ruíz Delgado",
        cod: 20232637,
        foto: "https://media.licdn.com/dms/image/v2/D4E03AQHdSzZ3tN1JKA/profile-displayphoto-shrink_400_400/B4EZZX5PerHoAg-/0/1745231346321?e=1765411200&v=beta&t=mFfi7mIqXohfjjiiGP9WIWcMOmAKW87utII1QZT749Y"

    }
]

const Nosotros = (props: NosotrosProps) => {

    const [Grupo1] = useState<Integrante[]>(personas)
    const user = props.GetUser();

    return <div>

        <div className="seccion px-3">
            <div className="m-5 px-5">

                <div className="row contenido">
                    <h1 className="fw-bold mb-5">Sobre Nosotros</h1>
                    <div className="seccion_contenido  col-md-6  mt-4 ml-5">

                        <h2 className="h4 mb-3">Nuestra Misión</h2>
                        <p>
                            AstroTV es la plataforma líder de streaming en vivo que conecta a
                            creadores de contenido con audiencias globales. Nuestra misión es democratizar
                            la transmisión en vivo y hacer que sea accesible para todos.
                        </p>
                        <h2 className="h4 mb-3">¿Qué Ofrecemos?</h2>
                        <ul>
                            <li>Streaming en alta calidad con baja latencia</li>
                            <li>Herramientas para creadores de contenido</li>
                            <li>Sistema de recompensas para espectadores</li>
                            <li>Comunidad activa y moderada</li>
                            <li>Soporte 24/7 para todos los usuarios</li>
                        </ul>


                    </div>
                    <div className="col-md-6 mt-md-0">
                        <div className="mt-5">
                            {!user && (
                                <div className="card mb-2 bg-primary mt-5 text-card">
                                    <div className="card-body p-4 text-center">
                                        <h2 className="h4 mb-3">Únete a Nuestra Comunidad</h2>
                                        <p>Miles de streamers y espectadores ya forman parte de StreamPlatform</p>
                                        <Link to="/signin" className="btn page-button border-0 btn-lg mt-2">
                                            Registrarse Ahora
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container py-3">
            <hr className="w-30 mx-auto border border-2 border-primary" />
            <h4 className="text-center py-3 fw-bold">Grupo 1 - Integrantes</h4>
            <GridIntegrantes miembros={Grupo1} />
        </div>

    </div>

}

export default Nosotros