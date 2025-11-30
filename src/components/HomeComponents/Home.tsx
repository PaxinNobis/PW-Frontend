//Import de librerías

//Import de components
import Feed from './Feed';
import Carousel from './Carousel';

//Import de types
import type { Stream } from '../../GlobalObjects/Objects_DataTypes';

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

//Props
interface HomeProps {
  recommendedstreams: Stream[]
}
const Home = (props: HomeProps) => {
  return (
    <div className='px-4'>
      <Carousel slides={props.recommendedstreams.filter(s => s.user.online)} />
      <Feed streams={props.recommendedstreams.filter(s => s.user.online)} />
    </div>
  );
};

export default Home;