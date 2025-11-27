import {useNavigate} from "react-router-dom";
import type { Pack } from "../../GlobalObjects/Objects_DataTypes";
import "./CoinsButton.css"

interface CoinsButtonProps {
	packs : Pack[]
}
const CoinsButton = (props : CoinsButtonProps) => {
const navigate = useNavigate();
return (
	<div className="dropdown">
        <button className="carousel-button d-flex justify-content-center align-items-center border-0" id="userDropdown" data-bs-toggle="dropdown">
			<i className="bi bi-star-fill stars"></i>
		</button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
			<li className="d-flex dropdown-item-text justify-content-center"><h5 className="TextBox">Comprar stars</h5></li>
			{
			props.packs.map((pack : Pack) => {
                    return(
						<div key={pack.id}>
							<li><hr className="dropdown-divider"/></li>
							{/*El w-100 fue lo que expandió, junto con el dropdown menu classname en el css*/}
							<li className="d-flex dropdown-item-text align-items-center justify-content-between w-100">
								<div className="d-flex flex-column text-start mx-2">
									<h5 className="TextBox my-1">{pack.name}</h5>
									<h6 className="TextBox my-1">{pack.value} <i className="bi bi-star-fill ministars"></i></h6>
								</div>
								<div className="d-flex flex-column text-end align-items-start mx-2">
									<button onClick={() => navigate("/payment", {state : {pack}})} className="page-button border-0 buybutton d-flex justify-content-center">PEN {pack.finalprice}</button>
									<h6 className="Discount my-1">{pack.discount}% de descuento</h6>
								</div>
								
							</li>
						</div>
                    )})
			}
			<li><hr className="dropdown-divider"/></li>
			<li className="d-flex dropdown-item-text align-items-center justify-content-between w-100">
				<div className="d-flex flex-column text-start mx-2">
					<h5 className="TextBox my-1">Comprar stars</h5>
				</div>
				<div className="d-flex flex-column text-end align-items-start mx-2">
					<button onClick={() => navigate("/payment")} className="page-button border-0 buybutton d-flex justify-content-center">Comprar</button>
				</div>
				
			</li>
        </ul>
    </div>
);
};

export default CoinsButton;
