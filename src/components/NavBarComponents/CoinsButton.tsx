import { useNavigate } from "react-router-dom";
import type { Pack } from "../../GlobalObjects/Objects_DataTypes";
import "./CoinsButton.css"

interface CoinsButtonProps {
	packs: Pack[]
}
const CoinsButton = (props: CoinsButtonProps) => {
	const navigate = useNavigate();
	return (
		<div className="dropdown">
			<button className="carousel-button d-flex justify-content-center align-items-center border-0" id="userDropdown" data-bs-toggle="dropdown">
				<img src="https://i.imgur.com/QQfiDQ1.png" alt="AstroCoin" width="90" height="90" className="coin-icon-large" />
			</button>
			<ul className="dropdown-menu dropdown-menu-end astro-dropdown" aria-labelledby="userDropdown">
				<li className="text-center mb-3"><h5 className="TextBox fw-bold">Tienda de AstroCoins</h5></li>
				{
					props.packs.map((pack: Pack) => {
						return (
							<li key={pack.id} className="astro-pack-item">
								<div className="d-flex flex-column text-start mx-2">
									<h6 className="TextBox my-1 fw-bold">{pack.name}</h6>
									<div className="d-flex align-items-center">
										<span className="TextBox fs-5 me-2">{pack.value}</span>
										<img src="https://i.imgur.com/QQfiDQ1.png" alt="AstroCoin" width="24" height="24" className="coin-icon-small" />
									</div>
								</div>
								<div className="d-flex flex-column text-end align-items-end mx-2">
									<button onClick={() => navigate("/payment", { state: { pack } })} className="page-button border-0 buybutton astro-buy-btn d-flex justify-content-center align-items-center">
										PEN {pack.finalprice}
									</button>
									{pack.discount > 0 && (
										<h6 className="Discount my-1">{pack.discount}% OFF</h6>
									)}
								</div>
							</li>
						)
					})
				}
				<li><hr className="dropdown-divider" /></li>
				<li className="astro-pack-item justify-content-center cursor-pointer" onClick={() => navigate("/payment")}>
					<span className="TextBox fw-bold">Elige la cantidad de tus monedas!</span>
				</li>
			</ul>
		</div>
	);
};

export default CoinsButton;
