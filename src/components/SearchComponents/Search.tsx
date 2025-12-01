//Import de librerías
import { useParams } from "react-router-dom";

//Import de componentss
import StreamCard from "../HomeComponents/Streamcard";
import StreamerCard from "./Streamercard"
import GameCard from "../ExploreComponents/GameCard";

//Import de types
import type { Stream } from "../../GlobalObjects/Objects_DataTypes";
import type { User } from "../../GlobalObjects/Objects_DataTypes";
import type { Game } from "../../GlobalObjects/Objects_DataTypes";

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

//Props
interface SearchProps{
    streams : Stream[]
	users : User[]
	games : Game[]
}

const Search = (props : SearchProps) => {
    const { name } = useParams<{ name: string }>();
    const searchedstream = props.streams.filter((stream: Stream) => {
    return stream.game.name.toUpperCase() === name?.toUpperCase() || 
           stream.user.name.toUpperCase() === name?.toUpperCase();
	})
	const searcheduser = props.users.filter((user : User)=>{
        return user.name.toUpperCase() === name?.toUpperCase()
    })
	const searchedgame = props.games.filter((game : Game)=>{
        return game.name.toUpperCase() === name?.toUpperCase()
    })
	return (
		<div className="container my-5 px-4">
			<h1 className="mb-4">Streams:</h1>
			<div className="row">
				{
                searchedstream.map((stream : Stream) => (
				<StreamCard stream = {stream}></StreamCard>
				))
                }
			</div>
			<h1 className="mb-4">Usuarios:</h1>
			<div className="row">
				{
                searcheduser.map((user : User) => (
				<StreamerCard user = {user}></StreamerCard>
				))
                }
			</div>
			<h1 className="mb-4">Juegos:</h1>
			<div className="row">
				{
                searchedgame.map((game : Game) => (
					<GameCard game = {game}></GameCard>
				))
                }
			</div>
		</div>
	);
}

export default Search;