//Import de librerías
import { Link } from "react-router-dom"

//Import de components

//Import de types
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"
import "./CarouselSlide.css"

// Props
interface CarouselSlideProps{
    slide : Stream
    index?: number
}

const CarouselSlide = (props : CarouselSlideProps) => {
    return(
        <div className={`carousel-item ${props.index === 0 ? "active" : ""}`}>
            <Link to={`/streaming/${props.slide.user.name}`}>
                <div className="card d-flex flex-row align-items-center border-0">
                        <div>
                            <img src={props.slide.thumbnail} className="carousel-image" alt={props.slide.title}/>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{props.slide.title}</h5>
                            <p className="card-text text-muted">{props.slide.user.name}</p>
                        </div>
                </div>
            </Link>
        </div>
    )
}
export default CarouselSlide;