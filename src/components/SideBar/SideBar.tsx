import StreamBox from "./StreamBox"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
interface SideBarProps {
    streams: Stream[]
    following: User[]
    doViewersDivision: (dividendo: number, divisor: number, decimas: number) => string
}
const SideBar = (props: SideBarProps) => {
    const streamsfollowed = props.streams.filter((stream: Stream) => {
        return props.following.some((user: User) => {
            return stream.user.id === user.id
        })
    })
    return (
        <div className="container-fluid">
            <h5 className="TextBox">Canales que sigues</h5>
            {
                streamsfollowed.map((stream: Stream) => {
                    return (
                        <StreamBox doViewersDivision={props.doViewersDivision} stream={stream}></StreamBox>
                    )
                })
            }
            <h5 className="TextBox">Canales que podrían interesarte</h5>
            {
                props.streams.filter(s => s.user.online).map((stream: Stream) => {
                    return (
                        <StreamBox doViewersDivision={props.doViewersDivision} stream={stream}></StreamBox>
                    )
                })
            }
        </div>
    )
}
export default SideBar