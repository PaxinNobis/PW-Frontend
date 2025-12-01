import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import type { Stream } from "./GlobalObjects/Objects_DataTypes";
import type { GameTag } from "./GlobalObjects/Objects_DataTypes";
import type { Game } from "./GlobalObjects/Objects_DataTypes";
import type { User } from "./GlobalObjects/Objects_DataTypes";
import type { Pack } from "./GlobalObjects/Objects_DataTypes";
import type { Message } from "./GlobalObjects/Objects_DataTypes";

// Importar servicios del backend
import { getAllStreams, getAllTags, getAllGames } from "./services/data.service";
import { getFollowing, toggleFollow } from "./services/user.service";
import { getCoinPacks, createCheckoutSession } from "./services/payment.service";
import { loginUser as apiLoginUser, signupUser as apiSignupUser, logoutUser as apiLogoutUser } from "./services/auth.service";

// Importar nuevos servicios
// Importar nuevos servicios
import * as profileService from "./services/profile.service";
import * as streamerService from "./services/streamer.service";

const App = () => {
    const DivisiónAproximada = (dividendo : number, divisor : number, decimas : number) => {
    const cociente = dividendo/divisor;
    return(cociente.toFixed(decimas))
    }
    const [user, setUser] = useState<User | null>(null);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [tags, setTags] = useState<GameTag[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    // Estado de niveles y medallas no utilizado eliminado

    const [packs, setPacks] = useState<Pack[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    //Para guardar el usuario
    const USER_STORAGE_KEY = "streaming_user";

    const FollowFunction = async (user: User) => {
        try {
            // Intentar con el backend
            const result = await toggleFollow(user.id.toString());

            if (result.isFollowing) {
                // Ahora sigue al usuario
                setFollowing([...following, user]);

            } else {
                // Dejó de seguir
                const newfollowing = following.filter(f => f.id !== user.id);
                setFollowing(newfollowing);

            }
        } catch (error) {

            // Fallback a lógica local
            for (let i = 0; i < following.length; i++) {
                if (following[i].id == user.id) {
                    const newfollowing = [...following]
                    newfollowing.splice(i, 1)
                    setFollowing(newfollowing)
                    return
                }
            }
            setFollowing([...following, user])
        }
    }

    const ChatFunction = (message: Message, stream: Stream) => {
        // Actualizar lista de mensajes del stream
        const streamIndex = streams.findIndex(s => s.id === stream.id);
        if (streamIndex !== -1) {
            const newStreams = [...streams];
            newStreams[streamIndex] = {
                ...newStreams[streamIndex],
                messagelist: [...newStreams[streamIndex].messagelist, message]
            };
            setStreams(newStreams);
        }

        // Actualizar progreso del usuario actual
        if (user && message.user.id === user.id) {
            const currentUser = { ...user };
            const currentMessagessent = [...(currentUser.messagessent || [])];
            const streamerId = stream.user.id;

            const streamerIndex = currentMessagessent.findIndex(m => m && m[1] && m[1].id === streamerId);

            if (streamerIndex !== -1) {
                const currentPoints = currentMessagessent[streamerIndex][0];
                const newpoints = (typeof currentPoints === 'number' ? currentPoints : 0) + 1;
                currentMessagessent[streamerIndex] = [
                    newpoints,
                    currentMessagessent[streamerIndex][1]
                ];
            } else {
                currentMessagessent.push([1, stream.user]);
            }

            currentUser.messagessent = currentMessagessent;
            setUser(currentUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));

            // También actualizar en el array de users si existe (para consistencia local)
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                const newUsers = [...users];
                newUsers[userIndex] = currentUser;
                setUsers(newUsers);
            }
        }
    };
    const ReloadViewers = (viewers : number, game : Game) => {
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === game.id) {
            const copygames = [...games];
            copygames[i].spectators = viewers
            setGames(copygames)
        }
    }
    };
    const PayingFunction = async (user: User | null, packId: string) => {
        if (!user) {
            console.error("Usuario no autenticado");
            return;
        }

        try {
            // Crear sesión de pago con Stripe
            console.log("PayingFunction: Sending packId:", packId, "Type:", typeof packId);

            const session = await createCheckoutSession({ coinPackId: packId });
            console.log("Sesión de pago creada, redirigiendo a Stripe...");

            // Redirigir a Stripe Checkout
            if (session.url) {
                window.location.href = session.url;
            } else {
                console.error("No se recibió URL de redirección de Stripe");
            }

            // Nota: El webhook de Stripe actualizará las monedas automáticamente
            // cuando el pago se complete
        } catch (error) {
            console.error("Error al crear sesión de pago:", error);
            throw error;
        }
    }   
    const LogInFunction = async (email: string, pass: string) => {
        if (email == "" || pass == "") {
            throw new Error("Por favor, rellena todos los campos");
        }

        try {
            // Intentar login con el backend
            const user = await apiLoginUser({ email, password: pass });

            // Obtener perfil completo del usuario
            let profileData = null;
            try {
                const { getUserProfile } = await import('./services/profile.service');
                profileData = await getUserProfile(user.id);
            } catch (profileError) {
                console.log("No se pudo cargar el perfil completo, usando datos básicos");
            }

            // Convertir usuario del backend al formato local
            const localUser: User = {
                id: user.id, // UUID del backend
                name: profileData?.name || user.name,
                email: user.email,
                password: pass,
                coins: user.coins || 0,
                pfp: profileData?.pfp || "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png",
                online: profileData?.online || false,
                bio: profileData?.bio || "",
                followed: [],
                followers: [],
                friends: [],
                pointsrecieved: [],
                messagessent: [],
                medalsrecieved: [],
                streaminghours: profileData?.stats?.streamingHours || 0,
                streamerlevel: { id: 1, level: "Astronauta Novato", min_followers: 0, max_followers: 100, min_hours: 0, max_hours: 50 },
                medalsforviewers: [],
                clips: [],
                xlink: profileData?.socialLinks?.x || "",
                youtubelink: profileData?.socialLinks?.youtube || "",
                instagramlink: profileData?.socialLinks?.instagram || "",
                tiktoklink: profileData?.socialLinks?.tiktok || "",
                discordlink: profileData?.socialLinks?.discord || ""
            };

            setUser(localUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));

            // Cargar datos del usuario autenticado
            try {
                // Cargar following
                const followingData = await getFollowing();

                const followingList = Array.isArray(followingData) ? followingData : (followingData as any).following || [];
                const convertedFollowing = followingList.map((f: any) => ({
                    id: f.id, // UUID del backend
                    name: f.name,
                    email: f.email,
                    password: "",
                    coins: 0,
                    pfp: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png",
                    online: f.stream?.isLive || false,
                    bio: "",
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
                }));
                setFollowing(convertedFollowing);

                // Recargar packs si aún no están cargados
                if (packs.length === 0) {
                    const packsData = await getCoinPacks();
                    const convertedPacks = packsData.map((p: any) => ({
                        id: parseInt(p.id) || 0,
                        name: p.nombre,
                        value: p.valor,
                        initialprice: p.en_soles,
                        finalprice: p.en_soles,
                        discount: 0
                    }));
                    setPacks(convertedPacks);
                }
            } catch (err) {

            }


            return 1;
        } catch (backendError) {

            // Fallback a login local
            for (const user of users) {
                if (email == user.email && pass == user.password) {
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
                    return 1;
                }
            };

            throw new Error("Usuario no encontrado o contraseña incorrecta");
        }
    };

    const doStreaming = async (_user: string, title: string, game: string, link: string) => {
        try {
            // Buscar el ID del juego basado en el nombre (si game es el nombre)
            // O asumir que game es el ID si viene del select
            let gameId = game;
            const selectedGame = games.find(g => g.name === game || g.id === game);
            if (selectedGame) {
                gameId = selectedGame.id;
            }

            await streamerService.updateStreamSettings({
                title,
                gameId,
                iframeUrl: link,
                isLive: true
            });

            // Actualizar lista de streams
            const response = await getAllStreams();
            const apiStreams = Array.isArray(response) ? response : (response as any).streams || [];

            if (!Array.isArray(apiStreams)) {
                console.error("Formato de respuesta de streams inesperado:", response);
                return;
            }

            // Convertir streams de API a formato local
            const convertedStreams: Stream[] = apiStreams.map((s: any) => ({
                id: typeof s.id === 'number' ? s.id : parseInt(s.id) || 0,
                user: {
                    id: s.user?.id || s.userId || "",
                    name: s.user?.name || "Unknown",
                    email: "",
                    password: "",
                    coins: 0,
                    pfp: s.user?.pfp || "",
                    online: true,
                    bio: "",
                    followed: [],
                    followers: [],
                    friends: [],
                    pointsrecieved: [],
                    messagessent: [],
                    medalsrecieved: [],
                    streaminghours: 0,
                    streamerlevel: { id: 1, level: "Novato", min_followers: 0, max_followers: 100, min_hours: 0, max_hours: 50 },
                    medalsforviewers: [],
                    clips: [],
                    xlink: "",
                    youtubelink: "",
                    instagramlink: "",
                    tiktoklink: "",
                    discordlink: ""
                },
                game: s.game || { id: "0", name: "Unknown", photo: "", spectators: 0, followers: 0, tags: [] },
                thumbnail: s.thumbnailUrl || "",
                title: s.title || "",
                viewersnumber: s.viewers || 0,
                viewersid: [],
                messagelist: []
            }));

            setStreams(convertedStreams);

        } catch (error) {
            console.error("Error al iniciar stream:", error);
            throw error;
        }
    };

    const LogOutFunction = async () => {
        apiLogoutUser(); // Limpia el token del backend
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
        console.log("Logout exitoso");
    }

    const SignInFunction = async (name: string, email: string, pass: string) => {
        if (name == "" || email == "" || pass == "") {
            throw new Error("Por favor, rellena todos los campos");
        }
        if (pass.length < 6) {
            throw new Error("La contraseña debe tener como mínimo 6 caracteres");
        }

        try {
            // Intentar registro con el backend
            const user = await apiSignupUser({ name, email, password: pass });

            // Convertir usuario del backend al formato local
            const localUser: User = {
                id: user.id, // UUID del backend
                name: user.name,
                email: user.email,
                password: pass,
                coins: user.coins || 0,
                pfp: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png",
                online: false,
                bio: "",
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
            };

            setUser(localUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
            return 1;
        } catch (backendError) {

            // Fallback a registro local
            for (const user of users) {
                if (email == user.email) {
                    throw new Error("Email ya en uso");
                }
            }
            const newuser: User = {
                id: `local-${Date.now()}`, // ID temporal para usuarios locales
                name: name,
                email: email,
                password: pass,
                coins: 0,
                pfp: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png",
                online: false,
                bio: "",
                followed: [],
                followers: [],
                friends: [],
                pointsrecieved: [],
                messagessent: [],
                medalsrecieved: [],
                streaminghours: 0,
                streamerlevel: {
                    id: 1,
                    level: "Astronauta Novato",
                    min_followers: 0,
                    max_followers: 100,
                    min_hours: 0,
                    max_hours: 50
                },
                medalsforviewers: [],
                clips: [],
                xlink: "",
                youtubelink: "",
                instagramlink: "",
                tiktoklink: "",
                discordlink: ""
            };
            setUsers([...users, newuser]);
            setUser(newuser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newuser));
            return 1;
        }
    }

    const GetUser = () => {
        const userJson = localStorage.getItem(USER_STORAGE_KEY);
        if (!userJson) {
            return null;
        }
        try {
            return JSON.parse(userJson) as User;
        }
        catch (error) {
            console.error('Error parsing user data:', error);

            // localStorage.removeItem(USER_STORAGE_KEY);
            return null;
        }
    };
    const refreshUserData = async () => {
        try {
            // Obtener usuario actual
            const posibleuser = GetUser();
            setUser(posibleuser);

            // Cargar datos del backend
            try {
                const [streamsData, tagsData, gamesData, packsData] = await Promise.all([
                    getAllStreams(),
                    getAllTags(),
                    getAllGames(),
                    getCoinPacks()
                ]);

                // Validar que streamsData sea un array
                const streams = Array.isArray(streamsData) ? streamsData : (streamsData as any)?.streams || [];
                const tags = Array.isArray(tagsData) ? tagsData : (tagsData as any)?.tags || [];
                const games = Array.isArray(gamesData) ? gamesData : (gamesData as any)?.games || [];
                const packs = Array.isArray(packsData) ? packsData : (packsData as any)?.coinPacks || (packsData as any)?.packs || [];

                // Si no hay streams en el backend, forzar carga de datos locales (para demo)
                if (streams.length === 0) {
                    console.warn("Backend devolvió 0 streams. Usando datos locales para demostración.");
                    throw new Error("Empty backend streams - Fallback to local data");
                }

                // Convertir datos del backend al formato local
                const convertedStreams = streams.map((s: any) => ({
                    id: parseInt(s.id) || 0,
                    user: {
                        id: s.streamer.id, // UUID del backend
                        name: s.streamer.name,
                        email: s.streamer.email,
                        password: "",
                        coins: 0,
                        pfp: (s.streamer.pfp || "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png").replace('via.placeholder.com', 'placehold.co'),
                        online: s.isLive,
                        bio: "",
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
                    game: {
                        name: s.game.name,
                        photo: s.game.photo,
                        spectators: 0,
                        followers: 0,
                        tags: s.tags.map((t: any) => ({ id: parseInt(t.id) || 0, name: t.name }))
                    },
                    thumbnail: (s.thumbnail || "").replace('via.placeholder.com', 'placehold.co'),
                    title: s.title,
                    viewersnumber: s.viewers,
                    viewersid: [],
                    messagelist: []
                }));

                const convertedTags = tags.map((t: any) => ({
                    id: parseInt(t.id) || 0,
                    name: t.name
                }));

                const convertedGames = games.map((g: any) => ({
                    name: g.name,
                    photo: g.photo,
                    spectators: g._count?.streams || 0,
                    followers: 0,
                    tags: g.tags.map((t: any) => ({ id: parseInt(t.id) || 0, name: t.name }))
                }));

                const uniquePacksMap = new Map();
                packs.forEach((p: any) => {
                    if (!uniquePacksMap.has(p.id)) {
                        uniquePacksMap.set(p.id, {
                            id: p.id,
                            name: p.nombre,
                            value: p.valor,
                            initialprice: p.en_soles,
                            finalprice: p.en_soles,
                            discount: 0
                        });
                    }
                });
                const convertedPacks = Array.from(uniquePacksMap.values());

                setStreams(convertedStreams);
                setTags(convertedTags);
                setGames(convertedGames);
                setPacks(convertedPacks);

                // Cargar following si hay usuario autenticado
                if (posibleuser) {
                    if (streams.length > 0) {

                    }
                    try {
                        const followingData = await getFollowing();
                        const followingList = Array.isArray(followingData) ? followingData : (followingData as any).following || [];
                        const convertedFollowing = followingList.map((f: any) => ({
                            id: f.id, // UUID del backend
                            name: f.name,
                            email: f.email,
                            password: "",
                            coins: 0,
                            pfp: (f.pfp || "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png").replace('via.placeholder.com', 'placehold.co'),
                            online: f.streams?.[0]?.isLive || false, // Usar streams[0] en lugar de stream
                            bio: "",
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
                        }));
                        setFollowing(convertedFollowing);

                        // Actualizar monedas del usuario desde el backend si es posible
                        // Esto es crucial para la sincronización
                        try {
                            // Intentar obtener el perfil más reciente para actualizar monedas
                            if (posibleuser && posibleuser.id) {
                                const updatedProfile = await profileService.getUserProfile(posibleuser.id);
                                if (updatedProfile && typeof updatedProfile.coins === 'number') {
                                    const updatedUser: User = {
                                        ...posibleuser,
                                        coins: updatedProfile.coins,
                                        name: updatedProfile.name || posibleuser.name,
                                        email: updatedProfile.email || posibleuser.email,
                                        pfp: (updatedProfile.pfp && updatedProfile.pfp !== "undefined") ? updatedProfile.pfp : ((posibleuser.pfp && posibleuser.pfp !== "undefined") ? posibleuser.pfp : "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png"),
                                        bio: updatedProfile.bio || posibleuser.bio || "",
                                        online: updatedProfile.online ?? posibleuser.online,
                                        streaminghours: updatedProfile.stats?.streamingHours ?? posibleuser.streaminghours,
                                        xlink: updatedProfile.socialLinks?.x || posibleuser.xlink || '',
                                        youtubelink: updatedProfile.socialLinks?.youtube || posibleuser.youtubelink || '',
                                        instagramlink: updatedProfile.socialLinks?.instagram || posibleuser.instagramlink || '',
                                        tiktoklink: updatedProfile.socialLinks?.tiktok || posibleuser.tiktoklink || '',
                                        discordlink: updatedProfile.socialLinks?.discord || posibleuser.discordlink || ''
                                    };
                                    setUser(updatedUser);
                                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                                }
                            } else {
                                console.warn("User ID is missing in posibleuser:", posibleuser);
                            }
                        } catch (e) {
                            console.log("No se pudo actualizar saldo en tiempo real");
                        }

                    } catch (err) {
                        console.error("Error loading following:", err);
                    }
                }

            } catch (backendError) {
                console.warn("Error al cargar desde backend, usando datos locales");
                // Fallback a datos locales si el backend falla
                const baseUrl = import.meta.env.BASE_URL;
                const response1 = await fetch(`${baseUrl}data/streams.json`);
                const data1 = await response1.json();
                setStreams(data1);
                const response2 = await fetch(`${baseUrl}data/tags.json`);
                const data2 = await response2.json();
                setTags(data2);
                const response3 = await fetch(`${baseUrl}data/games.json`);
                const data3 = await response3.json();
                setGames(data3);
                const response4 = await fetch(`${baseUrl}data/following.json`);
                const data4 = await response4.json();
                setFollowing(data4);
                const response5 = await fetch(`${baseUrl}data/packs.json`);
                const data5 = await response5.json();
                setPacks(data5);
                console.log("Datos locales cargados como fallback");
            }

            // Cargar datos locales que no están en el backend aún
            const baseUrl = import.meta.env.BASE_URL;
            const response6 = await fetch(`${baseUrl}data/users.json`);
            const data6 = await response6.json();
            setUsers(data6);
            // Carga de niveles y medallas no utilizada eliminada

        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    const refreshUserCoins = async () => {
        const currentUser = GetUser();
        if (!currentUser) return;

        try {
            // Usar fetchCurrentUser (auth/me) en lugar de getUserProfile porque garantiza devolver coins
            const { fetchCurrentUser } = await import('./services/auth.service');
            const updatedUser = await fetchCurrentUser();

            if (updatedUser && typeof updatedUser.coins === 'number') {
                // Siempre actualizar si es diferente para asegurar sincronización
                if (currentUser.coins !== updatedUser.coins) {
                    const newLocalUser = { ...currentUser, coins: updatedUser.coins };
                    setUser(newLocalUser);
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newLocalUser));
                }
            }
        } catch (error) {
            console.error("Error refreshing user coins:", error);
        }
    };

    useEffect(() => {
        refreshUserData();

        // Reintentar obtener datos del usuario después de 2 segundos para manejar posibles race conditions (ej. después de pago)
        const timer = setTimeout(() => {
            refreshUserCoins();
        }, 2000);

        // Escuchar evento de actualización de monedas
        const handleCoinsUpdate = (event: Event) => {
            // refreshUserData(); // Evitar recargar todos los streams para no reiniciar el iframe

            // Actualización optimista para feedback inmediato si se proporciona el costo
            const customEvent = event as CustomEvent;
            if (customEvent.detail && typeof customEvent.detail.cost === 'number') {
                const cost = customEvent.detail.cost;
                setUser(prevUser => {
                    if (!prevUser) return null;
                    const newCoins = Math.max(0, prevUser.coins - cost);
                    const updatedUser = { ...prevUser, coins: newCoins };
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
                    return updatedUser;
                });
            }

            refreshUserCoins();
        };

        const handleStreamUpdate = () => {

            refreshUserData();
        };

        window.addEventListener('userCoinsUpdated', handleCoinsUpdate);
        window.addEventListener('streamUpdated', handleStreamUpdate);

        return () => {
            window.removeEventListener('userCoinsUpdated', handleCoinsUpdate);
            window.removeEventListener('streamUpdated', handleStreamUpdate);
            clearTimeout(timer);
        };
    }, []);

    return <AppRouter streams={streams} tags={tags} games={games} following={following} packs={packs} users={users} user={user} doPayment={PayingFunction} doFollowing={FollowFunction} doChatting={ChatFunction} doLogIn={LogInFunction} doSignIn={SignInFunction} doLogOut={LogOutFunction} GetUser={GetUser} doStreaming={doStreaming} doViewersDivision = {DivisiónAproximada}   reloadGameViewers={ReloadViewers}/>;
};

export default App;