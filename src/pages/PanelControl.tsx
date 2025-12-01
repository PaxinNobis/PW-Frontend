import { useState, useEffect, useRef } from 'react';
import PanelHeader from '../components/PanelHeader';
import PanelStream from '../components/PanelStream';
import PanelOptions from '../components/PanelOptions';
import Videos from '../components/ProfileComponents/Videos';
import Analiticas from './Analiticas';
import Configuracion from './Configuracion';
import ConfiguracionNiveles from './ConfiguracionNiveles';
import GestionRegalos from './GestionRegalos';
import ChatSection from '../components/StreamingComponents/ChatSection';
import StartStreamModal from '../components/Dashboard/StartStreamModal';
import StreamerLevelProgress from '../components/Dashboard/StreamerLevelProgress';
import GiftNotification from '../components/StreamingComponents/GiftNotification';
import { getStreamDetails } from '../services/data.service';
import { stopStream, getStreamerStats, getStreamerLevel } from '../services/streamer.service';
import * as chatService from '../services/chat.service';
import { getCurrentUser } from '../services/auth.service';
import { useStreamerLevel } from '../hooks/useNewFeatures';
import type { User, Stream, Message, Game } from '../GlobalObjects/Objects_DataTypes';
import './PanelControl.css';

interface PanelControlProps {
  GetUser: () => User | null;
  doChatting: (message: Message, stream: Stream) => void;
  doStreaming: (user: string, title: string, game: string, link: string) => Promise<void>;
  games: Game[];
}

const PanelControl = (props: PanelControlProps) => {
  const [seccionActiva, setSeccionActiva] = useState('Stream');
  const [userStream, setUserStream] = useState<Stream | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevelName, setNewLevelName] = useState('');

  // Hook para el nivel del streamer
  const { levelData, loading: levelLoading, reload: reloadLevel } = useStreamerLevel();

  useEffect(() => {
    const fetchStream = async () => {
      const user = getCurrentUser();
      if (user?.name) {
        try {
          const stream = await getStreamDetails(user.name);

          // Unwrap response if it's wrapped in { success: true, stream: ... }
          const actualStreamData = (stream as any).stream || stream;

          // Si no hay stream data (null, undefined, o error), crear un stream por defecto
          if (!actualStreamData || !actualStreamData.id) {
            const defaultStream = {
              id: `temp-${user.id}`,
              title: "",
              thumbnail: "",
              viewers: 0,
              isLive: false,
              user: {
                id: user.id,
                name: user.name,
                email: user.email || "",
                password: "",
                coins: 0,
                pfp: user.pfp || "https://placehold.co/40",
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
              },
              game: { name: "Just Chatting", photo: "", spectators: 0, followers: 0, tags: [] },
              viewersnumber: 0,
              viewersid: [],
              messagelist: []
            };
            setUserStream(defaultStream as unknown as Stream);
            return;
          }

          // Adaptar el objeto stream de la API al tipo Stream que espera ChatSection
          const streamerData = (actualStreamData as any).streamer || (actualStreamData as any).user || {};

          // Asegurar que tenga nombre e ID
          if (!streamerData.name && user.name) streamerData.name = user.name;
          if (!streamerData.id && user.id) streamerData.id = user.id;

          const adaptedStream = {
            ...actualStreamData,
            user: streamerData,
            messagelist: []
          };

          setUserStream(adaptedStream as unknown as Stream);
        } catch (error) {
          // 404 es normal si el usuario no tiene stream aún
          const defaultStream = {
            id: `temp-${user.id}`,
            title: "",
            thumbnail: "",
            viewers: 0,
            isLive: false,
            user: {
              id: user.id,
              name: user.name,
              email: user.email || "",
              password: "",
              coins: 0,
              pfp: user.pfp || "https://placehold.co/40",
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
            },
            game: { name: "Just Chatting", photo: "", spectators: 0, followers: 0, tags: [] },
            viewersnumber: 0,
            viewersid: [],
            messagelist: []
          };
          setUserStream(defaultStream as unknown as Stream);
        }
      }
    };
    fetchStream();

    // Trigger stats sync
    const syncStats = async () => {
      try {
        // 1. Get current level BEFORE sync
        const initialData = await getStreamerLevel();
        const oldLevelId = (initialData as any).levelData?.currentLevel?.id || (initialData as any).currentLevel?.id;

        // 2. Trigger stats sync
        await getStreamerStats();

        // 3. Get new level AFTER sync
        const newLevelData = await reloadLevel();

        // 4. Compare
        if (newLevelData && oldLevelId && newLevelData.currentLevel.id > oldLevelId) {
          setNewLevelName(newLevelData.currentLevel.name);
          setShowLevelUp(true);
        }
      } catch (e) {
        console.error("Error syncing streamer stats:", e);
      }
    };
    syncStats();

    // Subscribe to WebSocket level up notifications
    const unsubscribeLevelUp = chatService.onLevelUp((data) => {
      setNewLevelName(data.levelName);
      setShowLevelUp(true);
      // Reload level data to update UI
      reloadLevel();
    });

    return () => {
      unsubscribeLevelUp();
    };
  }, []);

  // Auto-stop stream when leaving the page (component unmount)
  const userStreamRef = useRef<Stream | null>(null);
  useEffect(() => {
    userStreamRef.current = userStream;
  }, [userStream]);

  useEffect(() => {
    return () => {
      const currentStream = userStreamRef.current;
      if (currentStream && (currentStream as any).isLive) {
        stopStream().catch(err => console.error("Error auto-stopping stream:", err));
      }
    };
  }, []);

  const handleToggleStream = async () => {
    if (!userStream) return;

    const isLive = (userStream as any).isLive;

    if (isLive) {
      // Si está en vivo, detener stream
      try {
        await stopStream();

        // Actualizar estado local a offline
        setUserStream({ ...userStream, isLive: false } as any);
      } catch (error) {
        console.error("Error stopping stream:", error);
      }
    } else {
      // Si está offline, abrir modal para iniciar
      setShowStartModal(true);
    }
  };

  // Callback para cuando se inicia el stream desde el modal
  const handleStreamStarted = async (user: string, title: string, game: string, link: string) => {
    await props.doStreaming(user, title, game, link);

    // Actualizar estado local a online
    if (userStream) {
      setUserStream({
        ...userStream,
        isLive: true,
        startedAt: new Date().toISOString() // Set start time locally for immediate feedback
      } as any);
    }

    // Recargar detalles del stream para asegurar consistencia
    const currentUser = getCurrentUser();
    if (currentUser?.name) {
      try {
        const stream = await getStreamDetails(currentUser.name);
        const actualStreamData = (stream as any).stream || stream;
        if (actualStreamData && actualStreamData.id) {
          const streamerData = (actualStreamData as any).streamer || (actualStreamData as any).user || {};
          if (!streamerData.name && currentUser.name) streamerData.name = currentUser.name;
          if (!streamerData.id && currentUser.id) streamerData.id = currentUser.id;

          const adaptedStream = {
            ...actualStreamData,
            user: streamerData,
            messagelist: []
          };
          setUserStream(adaptedStream as unknown as Stream);
        }
      } catch (e) {
        // Silent fail on refresh
      }
    }
  };

  let contenidoCentral = (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  if (seccionActiva === 'Stream') {
    contenidoCentral = (
      <div className="row h-100">
        {userStream ? (
          <div className="d-flex w-100 h-100 panel-stream-layout">
            <div className="flex-grow-1 d-flex flex-column stream-content-wrapper">
              <div className="d-flex align-items-start justify-content-center w-100">
                <div className="ratio ratio-16x9 border rounded overflow-hidden bg-black position-relative w-100">
                  {(userStream as any).isLive && userStream.iframeUrl ? (
                    <iframe
                      src={userStream.iframeUrl}
                      title="Stream Video"
                      className="w-100 h-100"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white offline-placeholder">
                      <i className="bi bi-broadcast-pin fs-1 mb-3 offline-icon"></i>
                      <h3 className="fw-bold">OFFLINE</h3>
                      <p className="text-muted">El stream está desconectado</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 w-100">
                <StreamerLevelProgress levelData={levelData} loading={levelLoading} />
              </div>

              <div className="col-12 mb-3">
                {userStream && (
                  <PanelStream
                    stream={{
                      id: typeof userStream.id === 'number' ? userStream.id : parseInt(userStream.id) || 0,
                      title: userStream.title || "Sin título",
                      viewers: userStream.viewersnumber || 0,
                      status: (userStream as any).isLive ? 'live' : 'offline'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="panel-chat-column">
              <div className="h-100 border rounded overflow-hidden chat-container-height">
                <ChatSection
                  stream={userStream}
                  GetUser={props.GetUser}
                  doChatting={props.doChatting}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="col-12">
            <div className="alert alert-secondary text-center">
              No se pudo cargar la información del stream.
            </div>
          </div>
        )}
      </div>
    );
  }

  if (seccionActiva === 'Videos') contenidoCentral = <Videos />;
  if (seccionActiva === 'Estadísticas') contenidoCentral = <Analiticas />;
  if (seccionActiva === 'Configuración') contenidoCentral = <Configuracion />;
  if (seccionActiva === 'Regalos') contenidoCentral = <GestionRegalos />;
  if (seccionActiva === 'Niveles') contenidoCentral = <ConfiguracionNiveles />;

  return (
    <div className="container-fluid d-flex flex-column panel-main-container">
      <div className="flex-shrink-0 pt-4">
        <PanelHeader
          isLive={userStream ? (userStream as any).isLive : false}
          onToggleStream={handleToggleStream}
          startedAt={userStream?.startedAt}
        />
      </div>

      <StartStreamModal
        show={showStartModal}
        onClose={() => setShowStartModal(false)}
        doStreaming={handleStreamStarted}
        user={props.GetUser()}
        games={props.games}
      />



      {showLevelUp && (
        <GiftNotification
          senderName="¡Felicidades!"
          giftName={newLevelName || "Nivel Superior"}
          actionText="has alcanzado el nivel"
          iconClass="bi-stars"
          onClose={() => setShowLevelUp(false)}
        />
      )}

      <div className="row mt-3 flex-grow-1 panel-content-row">
        <PanelOptions
          opciones={["Stream", "Videos", "Estadísticas", "Regalos", "Niveles"]}
          onSeleccionar={(o) => setSeccionActiva(o)}
        />

        <div className="col-10 h-100">
          {contenidoCentral}
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
