//Import de librerías

//Import de components
import StreamCard from "./Streamcard"

//Import de types
import type {Stream} from "../../GlobalObjects/Objects_DataTypes"

//Import de css
import "../../GlobalObjects/Animations.css"
import "../../GlobalObjects/Global.css"

//Props
interface FeedProps {
  streams: Stream[];
}

const Feed = (props: FeedProps) => {
  return (
    <div className="container my-4">
      <h2 className="mb-3 fw-bold">Streams Recomendados</h2>
      <div className="row">
        {props.streams.map((stream : Stream, index: number) => (
          <StreamCard key={`stream-${stream.id}-${index}`} stream = {stream}/>
        ))}
      </div>
    </div>
  );
};

export default Feed;