//Import de librerías
import { useNavigate } from 'react-router-dom';
//Import de components

//Import de types

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

import "../../css/Title.css";
import "./BrandLogo.css";

//Props

const BrandLogo = () => {
	const navigate = useNavigate()
	const handleReload = () => {
		navigate("/Home")
	}
	return (
		<h1 onClick={handleReload} className="title"><span className="a-nave ">A</span>stroTV</h1>
	);
};

export default BrandLogo;
