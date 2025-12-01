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
    doViewersDivision : (dividendo : number, divisor : number, decimas : number) => string
}
import { useState, useEffect } from "react"
import { API_CONFIG, getAuthHeaders } from "../../config/api.config"
import { apiGet } from "../../utils/api.utils"

const Streaming = (props: StreamingProps) => {
    const { name } = useParams<{ name: string }>();
    const [localStream, setLocalStream] = useState<Stream | null>(null);
    const [loading, setLoading] = useState(true);

    // Try to find in props first
    const propStream = props.streams.find((stream: Stream) =>
        stream.user.name === name
    );

    useEffect(() => {
        if (propStream) {
            // Even if we have propStream, it might be missing iframeUrl if it came from the public list
            // So we might want to fetch details anyway if iframeUrl is missing
            if ((propStream as any).iframeUrl) {
                setLocalStream(propStream);
                setLoading(false);
                return;
            }
        }

        // If not in props or missing iframeUrl, fetch directly with auth
        const fetchStream = async () => {
            if (!name) return;
            try {
                setLoading(true);
                // Use direct API call with Auth Headers to ensure we get all fields (like iframeUrl)
                const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_STREAM_DETAILS(name)}`;
                const data = await apiGet<Stream>(url, getAuthHeaders());



                if (data) {
                    // Unwrap response if it's wrapped in { success: true, stream: ... }
                    const actualStreamData = (data as any).stream || data;

                    // Adapt data to match GlobalObjects/Objects_DataTypes Stream interface
                    // The API might return 'streamer' or 'user' or neither depending on the endpoint
                    const streamerData = (actualStreamData as any).streamer || (actualStreamData as any).user || {};

                    // Fallback if streamer data is missing but we have the name from params
                    if (!streamerData.name && name) streamerData.name = name;

                    // Check if this is the current user to use the correct ID
                    const currentUser = props.GetUser();
                    const isCurrentUser = currentUser && (
                        (streamerData.name && currentUser.name && streamerData.name.toLowerCase() === currentUser.name.toLowerCase()) ||
                        (name && currentUser.name && name.toLowerCase() === currentUser.name.toLowerCase())
                    );

                    const userId = streamerData.id || (isCurrentUser ? currentUser.id : `temp-${Date.now()}`);

                    // WORKAROUND: Fetch full profile to get bio (and potentially hidden iframeUrl)
                    // The backend doesn't return bio or iframeUrl in stream details
                    let fullBio = "";
                    let extractedIframeUrl = null;

                    if (userId && !userId.startsWith('temp-')) {
                        try {
                            const { getUserProfile } = await import('../../services/profile.service');
                            const profile = await getUserProfile(userId);
                            fullBio = profile.bio || "";

                            // Extract hidden iframeUrl from bio
                            const match = fullBio.match(/\|STREAM_URL=(.*?)\|/);
                            if (match && match[1]) {
                                extractedIframeUrl = match[1];
                                // Clean bio for display
                                fullBio = fullBio.replace(/\|STREAM_URL=.*?\|/g, '').trim();
                            }
                        } catch (err) {
                            console.error("Error fetching full profile for bio:", err);
                        }
                    }

                    const adaptedStream: any = {
                        ...actualStreamData,
                        iframeUrl: (actualStreamData as any).iframeUrl || extractedIframeUrl, // Use extracted URL if backend one is missing
                        user: {
                            id: userId,
                            name: streamerData.name || "Unknown",
                            email: streamerData.email || "",
                            // Default values for missing properties
                            password: "",
                            coins: 0,
                            pfp: (streamerData.pfp || "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png").replace('via.placeholder.com', 'placehold.co'),
                            online: (actualStreamData as any).isLive || false,
                            bio: fullBio, // Use fetched bio
                            followed: [],
                            followers: [],
                            friends: [],
                            pointsrecieved: [],
                            messagessent: [],
                            medalsrecieved: [],
                            streaminghours: 0,
                            streamerlevel: { id: 1, level: "Astronauta Novato", min_followers: 0, max_followers: 100, min_hours: 0, max_hours: 50 },
                            medalsforviewers: [],
                            clips: [],
                            xlink: "",
                            youtubelink: "",
                            instagramlink: "",
                            tiktoklink: "",
                            discordlink: ""
                        },
                        // Ensure other properties are compatible
                        game: (actualStreamData as any).game || {
                            id: "unknown",
                            name: "Just Chatting",
                            photo: "https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg",
                            tags: []
                        },
                        messagelist: [],
                        viewersnumber: (actualStreamData as any).viewers || 0,
                        viewersid: []
                    };

                    // Sanitize images
                    if (adaptedStream.thumbnail) {
                        adaptedStream.thumbnail = adaptedStream.thumbnail.replace('via.placeholder.com', 'placehold.co');
                    }

                    setLocalStream(adaptedStream as Stream);
                }
            } catch (error) {
                console.error("Error fetching stream details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStream();
    }, [name, propStream]);

    if (loading) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center w-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!localStream) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center w-100 flex-column">
                <h2>Stream no encontrado</h2>
                <p>El usuario {name} no está transmitiendo o no existe.</p>
            </div>
        )
    }

    return (
        <div className="d-flex vh-100 no-scroll">
            <div id="Middle-Page">
                <StreamingSection doViewersDivision = {props.doViewersDivision} GetUser={props.GetUser}stream={localStream} following = {props.following} doFollowing={props.doFollowing}></StreamingSection>
            </div>
            <div id="Right-Page">
                {localStream.user.online ? (
                    <ChatSection stream={localStream} doChatting={props.doChatting} GetUser={props.GetUser}></ChatSection>
                ) : (
                    <div className="d-flex h-100 flex-column justify-content-center align-items-center text-center p-4 chat-offline-container">
                        <h5>Chat Offline</h5>
                        <p className="text-muted">El chat está deshabilitado porque el stream ha finalizado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Streaming
