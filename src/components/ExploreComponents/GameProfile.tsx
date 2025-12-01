// pages/Profile.tsx
// Página de perfil del usuario (ruta protegida)
import { useParams } from 'react-router-dom';
import './GameProfile.css';
import { useEffect } from 'react';
import StreamCard from '../HomeComponents/Streamcard';
import type { Game } from '../../GlobalObjects/Objects_DataTypes';
import type { Stream } from '../../GlobalObjects/Objects_DataTypes';
import type { GameTag } from '../../GlobalObjects/Objects_DataTypes';
import { Link } from 'react-router-dom';

interface GameProfileProps{
    games : Game[]
    streams : Stream[]
    doViewersDivision : (dividendo : number, divisor : number, decimas : number) => string
    reloadGameViewers : (viewers : number, game : Game)  => void 
}
const GameProfile = (props : GameProfileProps) => {
    const { name } = useParams<{ name: string }>();
    const gametoshow = props.games.find((game : Game)=>{
            return game.name == name
        })
    const streamstoshow = props.streams.filter((stream : Stream)=>{
            return stream.game.name == name
        })
    
    if (!gametoshow){
    return (
        <div className="container mt-5">
            <div className="alert alert-warning">
            No existe tal juego
            </div>
        </div>
        );
    }
    useEffect(() => {
        const viewersquantity = streamstoshow.reduce((sum , stream)=> sum + stream.viewersnumber, 0)
        props.reloadGameViewers(viewersquantity, gametoshow)
    },[props.streams, name]);
return (
    <div className="container p-5 ">
        <div className="row justify-content-center">
            <div className="card position-relative  w-100 h-100">
                <div className="card-body">
                    <div className="card-body p-4 d-flex pb-5">
                        <img className="Game_Img" src={gametoshow.photo} alt="Img"/>
                        <div className='d-flex bd-highlight flex-column'>
                            <div className="mx-5">
                                <div className="mb-3">
                                    <h1> {gametoshow.name} <i className="bi bi-patch-check-fill"></i></h1>
                                </div>
                                {
                                    gametoshow.tags.map((tag : GameTag) => {
                                    return (
                                        <Link to={`/exploretags/${tag.name}`}>
                                            <span className="badge tag m-1">{tag.name}</span>
                                        </Link>
                                    )
                                })
                                }
                                <div>
                                    <span className="badge bg-danger m-1">{gametoshow.spectators >= 1000000? props.doViewersDivision(gametoshow.spectators,1000000,1) + " M ": gametoshow.spectators >= 1000? props.doViewersDivision(gametoshow.spectators,1000,1) + " K ":gametoshow.spectators}viewers</span>
                                </div>
                            </div>      
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-2'></div>
                {
                streamstoshow.map((stream : Stream) => (
                        <StreamCard stream = {stream}></StreamCard>
                    )                   
                ) 
            }
        </div>
    </div>
)
};

export default GameProfile;
