import "./ProgressBar.css"

interface ProgressBarProps {
	actual: number
	max: number
	topic: string
}
const ProgressBar = (props: ProgressBarProps) => {
	const percentage = (props.actual / props.max) * 100;
	return (
		<div className="m-3">
			<h5 className="m-0">Faltan {props.max - props.actual} {props.topic}</h5>
			<h6>{props.actual}/{props.max} {props.topic} restantes</h6>
			<div className="progress-bar-container">
				<div className="progress progress-bar-fill" style={{ '--progress-width': `${percentage}%` } as React.CSSProperties}>
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;