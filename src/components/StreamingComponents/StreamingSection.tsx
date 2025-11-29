import { useState, useEffect } from "react"
import FollowButton from "./FollowButton"
import ProgressBar from "./ProgressBar"
import SocialLink from "./SocialLink"
import { Link } from "react-router-dom"
import type { Stream, User } from "../../GlobalObjects/Objects_DataTypes"
import "./StreamingSection.css"
import { getStreamerLoyaltyLevels, type LoyaltyLevel } from "../../services/loyalty.service"
import { getUserPoints } from "../../services/points.service"

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
    const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>([]);
    const [currentPoints, setCurrentPoints] = useState<number>(0);

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

    // Fetch loyalty levels and user points
    useEffect(() => {
        const fetchData = async () => {
            if (props.stream.user.id) {
                try {
                    // Fetch levels
                    const levels = await getStreamerLoyaltyLevels(props.stream.user.id.toString());
                    const sortedLevels = levels.sort((a, b) => a.puntosRequeridos - b.puntosRequeridos);
                    setLoyaltyLevels(sortedLevels);

                    // Fetch user points if logged in
                    if (user) {
                        const pointsData = await getUserPoints();
                        const streamerPoints = pointsData.byStreamer.find(
                            p => p.streamerId === props.stream.user.id.toString()
                        );
                        setCurrentPoints(streamerPoints ? streamerPoints.points : 0);
                    }
                } catch (error) {
                    console.error("Error fetching loyalty data:", error);
                }
            }
        };
        fetchData();
    }, [props.stream.user.id, user?.id]); // Add user.id dependency to refetch if user changes

    const isFollowing = () => {
        let following = false
        for (let i = 0; i < props.following.length; i++) {
            if (props.following[i].id == props.stream.user.id) {
                following = true;
            }
        }
        return following
    }

    // Calculate progress
    const getViewerProgress = () => {
        if (!user) return { current: 0, max: 100, topic: "puntos" };

        // Use fetched points
        const points = currentPoints;

        if (loyaltyLevels.length === 0) return { current: points, max: 100, topic: "puntos" };

        // Find current and next level
        let currentLvl = null;
        let nextLvl = null;

        for (let i = 0; i < loyaltyLevels.length; i++) {
            if (points >= loyaltyLevels[i].puntosRequeridos) {
                currentLvl = loyaltyLevels[i];
            } else {
                nextLvl = loyaltyLevels[i];
                break;
            }
        }

        // If no next level, we are at max
        if (!nextLvl) {
            return {
                current: points,
                max: points,
                topic: `puntos (Nivel Máximo: ${currentLvl?.nombre || 'Leyenda'})`
            };
        }

        return {
            current: points,
            max: nextLvl.puntosRequeridos,
            topic: `puntos para ${nextLvl.nombre}`
        };
    };

    const progress = getViewerProgress();

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
                                        actual={progress.current}
                                        max={progress.max}
                                        topic={progress.topic}
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