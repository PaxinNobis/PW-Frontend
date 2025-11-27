//Import de componentss
import CategoryCard from "./CategoryCard";

//Import de types
import type { GameTag } from "../../GlobalObjects/Objects_DataTypes";

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

//Props
interface ExploreTagsProps{
  	tags : GameTag[]
}
const ExploreTags = (props: ExploreTagsProps) => {
	return (
		<div className="container my-5">
			<h1 className="mb-4">Explora por tags</h1>
			<div className="row">
				{props.tags.map((tag, index) => (
				<CategoryCard key={`tag-${tag.id}-${index}`} tag = {tag}></CategoryCard>
				))}
			</div>
		</div>
	);
}

export default ExploreTags;