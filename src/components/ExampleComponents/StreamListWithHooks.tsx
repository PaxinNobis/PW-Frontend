/**
 * EJEMPLO: Componente que usa hooks del backend
 * 
 * Este componente demuestra cómo usar los hooks personalizados
 * para cargar datos directamente del backend sin pasar por App.tsx
 */

import { useStreams } from '../../hooks/useStreams';
import StreamCard from '../HomeComponents/Streamcard';
import type { Stream } from '../../GlobalObjects/Objects_DataTypes';

const StreamListWithHooks = () => {
  // Usar el hook para obtener streams del backend
  const { data: backendStreams, loading, error, refetch } = useStreams();

  // Convertir datos del backend al formato local
  const convertedStreams: Stream[] = backendStreams?.map((s: any) => ({
    id: parseInt(s.id) || 0,
    user: {
      id: parseInt(s.streamer.id) || 0,
      name: s.streamer.name,
      email: s.streamer.email,
      password: "",
      coins: 0,
      pfp: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png",
      online: s.isLive,
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
    },
    game: {
      name: s.game.name,
      photo: s.game.photo,
      spectators: 0,
      followers: 0,
      tags: s.tags.map((t: any) => ({ id: parseInt(t.id) || 0, name: t.name }))
    },
    thumbnail: s.thumbnail,
    title: s.title,
    viewersnumber: s.viewers,
    viewersid: [],
    messagelist: []
  })) || [];

  // Manejar estados de carga
  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando streams...</span>
          </div>
          <p className="mt-2">Cargando streams desde el backend...</p>
        </div>
      </div>
    );
  }

  // Manejar errores
  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar streams</h4>
          <p>{error.message}</p>
          <hr />
          <button className="btn btn-danger" onClick={refetch}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizar streams
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Streams desde Backend</h2>
        <button className="btn btn-outline-primary" onClick={refetch}>
          <i className="bi bi-arrow-clockwise"></i> Recargar
        </button>
      </div>
      
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle"></i> Estos datos se cargan directamente del backend usando hooks
      </div>

      <div className="row">
        {convertedStreams.length === 0 ? (
          <div className="col-12">
            <p className="text-center text-muted">No hay streams disponibles</p>
          </div>
        ) : (
          convertedStreams.map((stream: Stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))
        )}
      </div>
    </div>
  );
};

export default StreamListWithHooks;
