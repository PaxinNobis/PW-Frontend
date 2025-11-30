// pages/Profile.tsx
// Página de perfil del usuario (ruta protegida)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SocialLink from '../StreamingComponents/SocialLink';
import EditProfileButton from './EditProfileButton';
import FollowButton from '../StreamingComponents/FollowButton';
import './Profile.css';
import type { User } from '../../GlobalObjects/Objects_DataTypes';
import Videos from './Videos';
import { useProfile } from '../../hooks/useNewFeatures';

interface ProfileProps {
    GetUser: () => User | null
    users: User[]
    following: User[]
    doFollowing: (user: User) => Promise<void>
}
const Profile = (props: ProfileProps) => {
    const { identifier } = useParams<{ identifier: string }>();

    // Usar el identifier (puede ser nombre, email o UUID)
    const user = props.GetUser();
    let userId = identifier;

    // Si el identificador coincide con el nombre del usuario logueado, usar su ID (UUID)
    // Esto ayuda si el backend espera UUID pero la URL tiene el nombre
    if (user && (user.name === identifier || user.email === identifier)) {
        userId = user.id;
    }

    // Cargar perfil completo del backend
    const { profile: backendProfile, loading } = useProfile(userId);

    // Usar perfil del backend directamente
    const profiletoshow = backendProfile ? {
        id: backendProfile.id, // UUID del backend
        name: backendProfile.name,
        email: backendProfile.email,
        pfp: backendProfile.pfp,
        bio: backendProfile.bio,
        online: backendProfile.online,
        password: '',
        coins: 0,
        followers: backendProfile.stats?.followers ? Array(backendProfile.stats.followers).fill({}) : [],
        followed: backendProfile.stats?.following ? Array(backendProfile.stats.following).fill({}) : [],
        friends: [],
        pointsrecieved: [],
        messagessent: [],
        medalsrecieved: [],
        streaminghours: backendProfile.stats?.streamingHours || 0,
        streamerlevel: { id: 1, level: "Astronauta Novato", min_followers: 0, max_followers: 100, min_hours: 0, max_hours: 50 },
        medalsforviewers: [],
        clips: [],
        xlink: backendProfile.socialLinks?.x || '',
        youtubelink: backendProfile.socialLinks?.youtube || '',
        instagramlink: backendProfile.socialLinks?.instagram || '',
        tiktoklink: backendProfile.socialLinks?.tiktok || '',
        discordlink: backendProfile.socialLinks?.discord || ''
    } as User : null;

    const [Issighting, SetIssighting] = useState<boolean>(true);
    // const user = props.GetUser(); // Already declared above

    useEffect(() => {
        SetIssighting(true)
        if (!user || !profiletoshow) {
            return
        }
        if (profiletoshow.name == user.name) {
            SetIssighting(false)
        }
    }, [profiletoshow, user]);

    // Mostrar loading mientras carga
    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    Cargando perfil...
                </div>
            </div>
        );
    }

    if (!profiletoshow) {
        if (!loading) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-warning">
                        <h4>⚠️ Usuario no encontrado</h4>
                        <p>No se encontró el usuario "{identifier}" en el backend.</p>
                        <hr />
                        <p className="mb-0">
                            <small className="text-muted">
                                Asegúrate de que el usuario existe y está registrado en la base de datos.
                            </small>
                        </p>
                    </div>
                </div>
            );
        }
        return null; // Mientras carga
    }

    const isFollowing = () => {
        let following = false
        for (let i = 0; i < props.following.length; i++) {
            if (props.following[i].id == profiletoshow.id) {
                following = true;
            }
        }
        return following
    }
    return (
        <div className="container p-5 ">
            <div className="row justify-content-center">
                <div className="card position-relative  w-100 h-100">
                    <div className="card-body">
                        <div className="card-body p-4 d-flex flex-column flex-lg-row pb-5 border-bottom align-items-center align-items-lg-start">
                            <img className="Profile_Img mb-4 mb-lg-0 me-lg-5" src={profiletoshow.pfp} alt="Img" />
                            <div className='d-flex bd-highlight flex-column flex-grow-1 w-100'>
                                <div className="pe-lg-5 text-center text-lg-start">
                                    <div className="mb-3">
                                        <h1> {profiletoshow.name} <i className="bi bi-patch-check-fill"></i></h1>
                                        <h3> {profiletoshow.email}</h3>
                                        <p className="">{profiletoshow.bio ? profiletoshow.bio : `Hola soy ${profiletoshow.name} y hago streams!`}</p>
                                    </div>
                                </div>
                                {
                                    !Issighting ?
                                        <div className="position-absolute top-0 end-0 m-4 d-flex justify-content-between">
                                            <EditProfileButton></EditProfileButton>
                                        </div>
                                        :
                                        <div className="position-absolute top-0 end-0 m-4 d-flex justify-content-between">
                                            <FollowButton doFollowing={props.doFollowing} isFollowing={isFollowing()} user={profiletoshow}></FollowButton>
                                        </div>
                                }
                                <div className="d-flex mt-auto bd-highlight justify-content-center justify-content-lg-start align-items-end flex-wrap">
                                    <h3 className="mx-3 mx-lg-4"> <i className="bi bi-person-fill"></i> {profiletoshow.followers.length} </h3>
                                    <h3 className="mx-3 mx-lg-4"> <i className="bi bi-person"></i> {profiletoshow.followed.length} </h3>
                                    <div className="d-flex mt-3 mt-lg-0 ms-lg-auto">
                                        <SocialLink link={profiletoshow.xlink} icon="bi-twitter-x" text=""></SocialLink>
                                        <SocialLink link={profiletoshow.instagramlink} icon="bi-instagram" text=""></SocialLink>
                                        <SocialLink link={profiletoshow.tiktoklink} icon="bi-tiktok" text=""></SocialLink>
                                        <SocialLink link={profiletoshow.discordlink} icon="bi-discord" text=""></SocialLink>
                                        <SocialLink link={profiletoshow.youtubelink} icon="bi-youtube" text=""></SocialLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 d-flex">
                            <Videos></Videos>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Profile;
