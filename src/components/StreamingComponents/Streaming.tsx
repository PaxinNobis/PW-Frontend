import { useParams } from "react-router-dom"
import ChatSection from "./ChatSection"
import StreamingSection from "./StreamingSection"

import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import type { Message } from "../../GlobalObjects/Objects_DataTypes"
import "./Streaming.css"
interface StreamingProps {
    streams: Stream[]
    following: User[];
    doFollowing: (user: User) => void
    doChatting: (message: Message, stream: Stream) => void
    GetUser: () => User | null
}
const Streaming = (props: StreamingProps) => {
    const { name } = useParams<{ name: string }>();
    const stream = props.streams.filter((stream: Stream) => {
        return stream.user.name.toUpperCase() === name?.toUpperCase()
    })

    if (!stream[0]) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center w-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="d-flex vh-100 no-scroll">
            <div id="Middle-Page">
                <StreamingSection GetUser={props.GetUser} stream={stream[0]} following={props.following} doFollowing={props.doFollowing}></StreamingSection>
            </div>
            <div id="Right-Page">
                <ChatSection stream={stream[0]} doChatting={props.doChatting} GetUser={props.GetUser}></ChatSection>
            </div>
        </div>
    )
}

export default Streaming
