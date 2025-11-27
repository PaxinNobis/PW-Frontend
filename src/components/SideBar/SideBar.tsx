import StreamBox from "./StreamBox"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
interface SideBarProps {
    streams : Stream[]
    following : User[]
}
const SideBar = (props : SideBarProps) => {
    const streamsfollowed = props.streams.filter((stream : Stream)=>{
            return props.following.some((user : User)=>{
                return stream.user.id === user.id
            })
        })
    return(
        <div className="container-fluid">
            <h5 className="TextBox">Canales que sigues</h5>
            {
                streamsfollowed.map((stream : Stream, index: number) => {
                    return(
                        <StreamBox key={`followed-${stream.id}-${index}`} stream = {stream}></StreamBox>
                    )
                })
            }
            <h5 className="TextBox">Canales que podrían interesarte</h5>
            {
                props.streams.map((stream : Stream, index: number) => {
                    return(
                        <StreamBox key={`recommended-${stream.id}-${index}`} stream = {stream}></StreamBox>
                    )
                })
            }
        </div>
    )
}
export default SideBar