//Import de librerías
import { Link } from 'react-router-dom';
import "../../GlobalObjects/Icons.css"
import "./StreamBox.css"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"

interface StreamBoxProps {
    stream: Stream
}
const StreamBox = (props: StreamBoxProps) => {
    const DivisiónAproximada = (dividendo: number, divisor: number, decimas: number) => {
        const cociente = dividendo / divisor;
        return (cociente.toFixed(decimas))
    }
    return (
        <Link to={`/streaming/${props.stream.user.name}`}>
            <div className="row">
                <div className="col-9" id="StreamerBox">
                    <div className="ImgBox">
                        <img className="StreamerImg" src={props.stream.user.pfp || "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png"} alt="Img" />
                    </div>
                    <div id="NickNameOverflow">
                        <h5 className="TextBox">{props.stream.user.name}</h5>
                        <h6 className="TextBox">{props.stream.game.name}</h6>
                    </div>
                </div>
                <div className="col-3" id="OnStreamBox">
                    <i className={props.stream.user.online ? "bi bi-circle-fill red icondot" : ""}></i>
                    <h6 className="TextBox">{props.stream.user.online ? (props.stream.viewersnumber >= 1000000 ? DivisiónAproximada(props.stream.viewersnumber, 1000000, 1) + " M " : props.stream.viewersnumber >= 1000 ? DivisiónAproximada(props.stream.viewersnumber, 1000, 1) + " k" : props.stream.viewersnumber) : "Desconectado"}</h6>
                </div>
            </div>
        </Link>
    )
}

export default StreamBox