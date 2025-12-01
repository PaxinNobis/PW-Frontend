// routes/AppRouter.tsx
// Configuración de todas las rutas de la aplicación

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import NavBar from '../components/NavBarComponents/NavBar';
import SideBar from "../components/SideBar/SideBar";
import Home from '../components/HomeComponents/Home';
import ExploreTags from '../components/ExploreComponents/ExploreTags';
import ExploreGames from "../components/ExploreComponents/ExploreGames";
import Search from '../components/SearchComponents/Search';
import Login from '../components/Login_SiginComponents/Login';
import Signin from '../components/Login_SiginComponents/Signin';
import TyC from '../components/Terms_AboutUsComponents/TyC';
import Nosotros from '../components/Terms_AboutUsComponents/Nosotros';
import Streaming from '../components/StreamingComponents/Streaming';
import CardInput from '../components/PayingComponents/CardInput';
import PaymentReturn from '../components/PayingComponents/PaymentReturn';
import GameProfile from '../components/ExploreComponents/GameProfile';

import Profile from '../components/ProfileComponents/Profile';
import PrivateRoute from './PrivateRoute';
import PanelControl from '../pages/PanelControl';
import GestionRegalos from '../pages/GestionRegalos';

import "../GlobalObjects/Animations.css"
import "../GlobalObjects/Global.css"

import type { Stream } from '../GlobalObjects/Objects_DataTypes';
import type { GameTag } from '../GlobalObjects/Objects_DataTypes';
import type { Game } from '../GlobalObjects/Objects_DataTypes';
import type { User } from '../GlobalObjects/Objects_DataTypes';
import type { Pack } from '../GlobalObjects/Objects_DataTypes';
import type { Message } from '../GlobalObjects/Objects_DataTypes';

// Componente auxiliar para sincronizar el estado de usuario de App.tsx con AuthContext
const AuthSync = ({ user }: { user: User | null }) => {
	const { updateUser, user: contextUser } = useAuth();

	useEffect(() => {
		// Si hay un usuario en props pero no en contexto, o son diferentes, actualizar contexto
		if (user && (!contextUser || contextUser.id !== user.id)) {
			updateUser(user);
		}
	}, [user, contextUser, updateUser]);

	return null;
};

interface AppRouterProps {
	streams: Stream[]
	following: User[]
	tags: GameTag[]
	games: Game[]
	packs: Pack[]
	users: User[]
	user: User | null
	doFollowing: (user: User) => Promise<void>
	doPayment: (user: User | null, packId: string) => Promise<void>
	doLogIn: (email: string, pass: string) => Promise<number>
	doSignIn: (name: string, email: string, pass: string) => Promise<number>
	doLogOut: () => void
	doViewersDivision : (dividendo : number, divisor : number, decimas : number) => string
	doChatting: (message: Message, stream: Stream) => void
	reloadGameViewers : (viewers : number, game : Game)  => void 
	doStreaming: (user: string, title: string, game: string, link: string) => Promise<void>
	GetUser: () => User | null
}

const AppRouter = (props: AppRouterProps) => {
	return (
		<BrowserRouter basename='/PW-Frontend'>
			<AuthProvider>
				<AuthSync user={props.user} />
				<NavBar doLogOut={props.doLogOut} user={props.user} packs={props.packs}></NavBar>
				<div className="d-flex pages vh-100 no-scroll">
					<div className="col-2" id="Sidebar">
						<SideBar doViewersDivision={props.doViewersDivision} streams = {props.streams} following = {props.following}></SideBar>
					</div>
					<div className="col-10 d-flex flex-column" id="Main-Page">
						<Routes>
							<Route path="/" element={<Home recommendedstreams={props.streams} />} />
							<Route path="/exploretags" element={<ExploreTags tags={props.tags} />} />
							<Route path="/exploretags/:name" element={<ExploreGames games={props.games} />} />
							<Route path="/search/:name" element={<Search games={props.games} users={props.users}streams={props.streams}/>}/>
							<Route path="/streaming/:name" element={<Streaming doViewersDivision={props.doViewersDivision} doFollowing={props.doFollowing} streams={props.streams} following = {props.following} GetUser={props.GetUser} doChatting={props.doChatting}/>} />
							<Route path="/TyC" element={<TyC/>}/>
							<Route path="/nosotros" element={<Nosotros GetUser={props.GetUser} />} />
							<Route path="/login" element={<Login doLogIn={props.doLogIn} />} />
							<Route path="/signin" element={<Signin doSignIn={props.doSignIn} />} />
							<Route path="/payment" element={<CardInput GetUser={props.GetUser} doPayment={props.doPayment} />} />
							<Route path="/payment/return" element={<PaymentReturn />} />
							<Route path="/game/:name" element={<GameProfile reloadGameViewers={props.reloadGameViewers} doViewersDivision={props.doViewersDivision} games={props.games} streams={props.streams}/>}/>

							<Route path="/profile/:identifier" element={<Profile doFollowing={props.doFollowing} following={props.following} users={props.users} GetUser={props.GetUser} />} />
							<Route path="/profile/:identifier" element={<Profile doFollowing={props.doFollowing} following={props.following} users={props.users} GetUser={props.GetUser} />} />
							<Route path="/panelcreador" element={<PrivateRoute><PanelControl GetUser={props.GetUser} doChatting={props.doChatting} doStreaming={props.doStreaming} games={props.games} /></PrivateRoute>} />
							<Route path="/gestion-regalos" element={<PrivateRoute><GestionRegalos /></PrivateRoute>} />

							{/* Redirección explícita de /Home a / */}
							<Route path="/Home" element={<Navigate to="/" replace />} />

							{/* Ruta 404 - redirige al home */}
							<Route path="*" element={<Home recommendedstreams={props.streams} />} />
						</Routes>
					</div>
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
};
export default AppRouter;
