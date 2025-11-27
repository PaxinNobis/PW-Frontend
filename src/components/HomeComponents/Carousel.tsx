//Import de librerías

//Import de components
import CarouselSlide from './CarouselSlide';

//Import de types
import type {Stream} from '../../GlobalObjects/Objects_DataTypes';

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

// Props
interface CarouselProps {
  slides: Stream[];
}

const Carousel = (props: CarouselProps) => {
    return (
        <div className="d-flex col-12 col-sm-12 col-md-12 col-lg-12 mt-4 mb-4">
            <div className="d-flex flex-fill justify-content-center align-items-center border-0">
                <button className="border carousel-button border-0 m-3" type="button" data-bs-target="#Carousel" data-bs-slide="prev">
                <i className="bi bi-arrow-bar-left"></i>
                </button>

                <div id="Carousel" className="carousel slide border-0" data-bs-ride="carousel">
                    <div className="carousel-inner">
                    {props.slides.map((slide, index) => (
                        <CarouselSlide key={`carousel-${slide.id}-${index}`} slide={slide} index={index}></CarouselSlide>
                    ))}
                    </div>
                </div>

                <button className="border carousel-button border-0 m-3" type="button" data-bs-target="#Carousel" data-bs-slide="next">
                    <i className="bi bi-arrow-bar-right"></i>
                </button>
            </div>
        </div>
  );
}

export default Carousel;