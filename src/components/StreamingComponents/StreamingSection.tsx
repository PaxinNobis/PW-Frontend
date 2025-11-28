import { useState } from "react"
import { useEffect } from "react"
import FollowButton from "./FollowButton"
import ProgressBar from "./ProgressBar"
import SocialLink from "./SocialLink"
import { Link } from "react-router-dom"
import type { Stream } from "../../GlobalObjects/Objects_DataTypes"
import type { User } from "../../GlobalObjects/Objects_DataTypes"
import "./StreamingSection.css"

interface StreamingSectionProps {
    stream: Stream
    following: User[];
    GetUser: () => User | null
    doFollowing: (user: User) => void
}
const StreamingSection = (props: StreamingSectionProps) => {
    const DivisiónAproximada = (dividendo: number, divisor: number, decimas: number) => {
        const cociente = dividendo / divisor;
        return (cociente.toFixed(decimas))
    }
    const [Issighting, SetIssighting] = useState<boolean>(true)
    const user = props.GetUser()
    useEffect(() => {
        SetIssighting(true)
        if (!user) {
            return
        }
        if (props.stream.user.name == user.name) {
            SetIssighting(false)
        }
    }, [user, props.stream]);
    const isFollowing = () => {
        let following = false
        for (let i = 0; i < props.following.length; i++) {
            if (props.following[i].id == props.stream.user.id) {
                following = true;
            }
        }
        return following
    }
    return (
        <div className="MiddleSide">
            <div className="VideoPlace">
                <img className="VideoPlaceHolder" src={props.stream.thumbnail} alt="Stream" />
            </div>
            <div className="d-flex justify-content-between my-3">
                <div className="text-start d-flex align-items-center">
                    <div className="ImgStreamBox mx-3">
                        <Link to={`/profile/${props.stream.user.name}`}>
                            <img className="StreamerImg" src={props.stream.user.pfp} alt="Img" />
                        </Link>
                    </div>
                    <div>
                        <h3 className="TextBox">{props.stream.user.name}</h3>
                        <h4 className="TextBox my-0">{props.stream.title}</h4>
                        <h4 className="TextBox m-0">{props.stream.game.name}</h4>
                    </div>
                </div>
                <div className="text-start ">
                    {
                        !Issighting ?
                            ""
                            :
                            <FollowButton doFollowing={props.doFollowing} isFollowing={isFollowing()} user={props.stream.user}></FollowButton>
                    }
                    <div className="ms-4">
                        <span className="badge bg-danger">{props.stream.viewersnumber >= 1000000 ? DivisiónAproximada(props.stream.viewersnumber, 1000000, 1) + " M " : props.stream.viewersnumber >= 1000 ? DivisiónAproximada(props.stream.viewersnumber, 1000, 1) + " K " : props.stream.viewersnumber}viewers</span>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between ">
                <div className="fill-sides">
                    <div className="d-flex justify-content-between ">
                        <h3 className="TextBox mx-4">Acerca de {props.stream.user.name} </h3>
                    </div>
                    <div className="alert alert-info m-4 mt-2 text-card border-0">
                        <div className="d-flex justify-content-between my-3">
                            <div className="mx-3">
                                <h3 className="TextBox mx-3">{props.stream.user.followers.length} seguidores</h3>
                                <p className="mx-3 text-break word-break-break-word">{props.stream.user.bio ? props.stream.user.bio : `Hola soy ${props.stream.user.name} y hago streams!`}</p>
                            </div>
                            <div className="text-end me-5">
                                <SocialLink link={props.stream.user.xlink} icon="bi-twitter-x" text="Twitter"></SocialLink>
                                <SocialLink link={props.stream.user.instagramlink} icon="bi-instagram" text="Instagram"></SocialLink>
                                <SocialLink link={props.stream.user.tiktoklink} icon="bi-tiktok" text="Tiktok"></SocialLink>
                                <SocialLink link={props.stream.user.discordlink} icon="bi-discord" text="Discord"></SocialLink>
                                <SocialLink link={props.stream.user.youtubelink} icon="bi-youtube" text="Youtube"></SocialLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fill-sides">
                    <div className="d-flex justify-content-between">
                        <h3 className="TextBox mx-4">Metas de {props.stream.user.name} </h3>
                    </div>
                    <div className="alert alert-info m-4 mt-2 text-card border-0">
                        <div className="my-3">
                            <ProgressBar actual={props.stream.user.streaminghours} max={props.stream.user.streamerlevel.max_hours} topic={"horas"} ></ProgressBar >
                            <ProgressBar actual={props.stream.user.followers.length} max={props.stream.user.streamerlevel.max_followers} topic={"followers"}></ProgressBar>

                            {user && user.id !== props.stream.user.id && (
                                <>
                                    <hr className="my-3" />
                                    <h5 className="TextBox mb-2">Mi Progreso como Espectador</h5>
                                    <ProgressBar
                                        actual={(() => {
                                            if (!Array.isArray(user.messagessent)) return 0;
                                            const entry = user.messagessent.find(m => m && m[1] && m[1].id === props.stream.user.id);
                                            return entry ? entry[0] : 0;
                                        })()}
                                        max={100}
                                        topic={"mensajes"}
                                    ></ProgressBar>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StreamingSection