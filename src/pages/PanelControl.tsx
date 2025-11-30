import { useState, useEffect, useRef } from 'react';
import PanelHeader from '../components/PanelHeader';
import PanelStream from '../components/PanelStream';
import PanelOptions from '../components/PanelOptions';
import Videos from '../components/ProfileComponents/Videos';
import Analiticas from './Analiticas';
import Configuracion from './Configuracion';
import ConfiguracionNiveles from './ConfiguracionNiveles';
import GestionRegalos from './GestionRegalos';
import StreamConfig from '../components/Dashboard/StreamConfig';
import ChatSection from '../components/StreamingComponents/ChatSection';
import { getStreamDetails } from '../services/data.service';
import { startStream, stopStream } from '../services/streamer.service';
import { getCurrentUser } from '../services/auth.service';
import type { User, Stream, Message } from '../GlobalObjects/Objects_DataTypes';

interface PanelControlProps {
  GetUser: () => User | null;
  doChatting: (message: Message, stream: Stream) => void;
}

const PanelControl = (props: PanelControlProps) => {
  const [seccionActiva, setSeccionActiva] = useState('Stream');
  const [userStream, setUserStream] = useState<Stream | null>(null);
  const [loadingStream, setLoadingStream] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      const user = getCurrentUser();
      if (user?.name) {
        try {
          const stream = await getStreamDetails(user.name);
          console.log("Stream details from API:", stream);

          // Unwrap response if it's wrapped in { success: true, stream: ... }
          const actualStreamData = (stream as any).stream || stream;

          // Si no hay stream data (null, undefined, o error), crear un stream por defecto
          if (!actualStreamData || !actualStreamData.id) {
            console.warn("No stream found for user, creating default offline stream");
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
            setLoadingStream(false);
            return;
          }

          // Adaptar el objeto stream de la API al tipo Stream que espera ChatSection
          // La API devuelve 'streamer', pero ChatSection espera 'user'
          // Si no hay streamer, intentar usar 'user' si ya existe, o un objeto vacío para evitar crash
          const streamerData = (actualStreamData as any).streamer || (actualStreamData as any).user || {};

          // Asegurar que tenga nombre e ID (usando datos del usuario actual si faltan)
          if (!streamerData.name && user.name) streamerData.name = user.name;
          if (!streamerData.id && user.id) streamerData.id = user.id;

          if (!streamerData.id) {
            console.warn("Streamer data missing ID:", streamerData);
          }

          const adaptedStream = {
            ...actualStreamData,
            user: streamerData,
            messagelist: []
          };

          setUserStream(adaptedStream as unknown as Stream);
        } catch (error) {
          console.error("Error fetching user stream:", error);
          // Si hay error (404 = no stream), crear un stream por defecto
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
      setLoadingStream(false);
    };
    fetchStream();
  }, []);

  // Auto-stop stream when leaving the page (component unmount)
  useEffect(() => {
    return () => {
      // Use a ref or direct check if possible, but since we can't access state in cleanup easily without ref,
      // we'll rely on the fact that if they leave, we should probably ensure it's stopped if they were live.
      // However, accessing 'userStream' inside cleanup requires it to be in dependency array, which triggers re-runs.
      // A better approach for "on unmount only" with latest state is using a ref.
    };
  }, []);

  // Keep a ref of the current stream state to access it in the cleanup function
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
    try {
      let response;
      console.log("Current Stream ID before toggle:", userStream.id);

      if (isLive) {
        response = await stopStream();
      } else {
        response = await startStream();
      }

      console.log("Toggle Response:", response);

      if (response && response.success && response.stream) {
        // Unwrap and adapt the new stream data similar to fetchStream
        const actualStreamData = (response.stream as any).stream || response.stream;
        console.log("New Stream Data from Backend:", actualStreamData);
        console.log("New Stream ID:", actualStreamData.id);

        const streamerData = (actualStreamData as any).streamer || (actualStreamData as any).user || {};

        // Preserve user info if missing in response
        if (!streamerData.name && userStream.user.name) streamerData.name = userStream.user.name;
        if (!streamerData.id && userStream.user.id) streamerData.id = userStream.user.id;

        const adaptedStream = {
          ...actualStreamData,
          user: streamerData,
          messagelist: []
        };

        setUserStream(adaptedStream as unknown as Stream);
      } else {
        // Fallback if response structure is unexpected
        setUserStream({ ...userStream, isLive: !isLive } as any);
      }

    } catch (error) {
      console.error("Error toggling stream:", error);
      alert("Error al cambiar el estado del stream");
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
        <div className="col-12 col-lg-8">
          <StreamConfig />
        </div>
        <div className="col-12 col-lg-4 h-100">
          {userStream && (userStream as any).isLive ? (
            <div className="h-100 border rounded overflow-hidden" style={{ minHeight: '500px' }}>
              <ChatSection
                stream={userStream}
                GetUser={props.GetUser}
                doChatting={props.doChatting}
              />
            </div>
          ) : (
            <div className="alert alert-secondary text-center">
              {userStream ? (
                <>
                  <h5>Chat en Espera</h5>
                  <p>El chat aparecerá aquí cuando inicies tu transmisión.</p>
                </>
              ) : (
                "No se pudo cargar el chat. Asegúrate de tener un canal creado."
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (seccionActiva === 'Videos') contenidoCentral = <Videos />;
  if (seccionActiva === 'Estadísticas') contenidoCentral = <Analiticas />;
  if (seccionActiva === 'Configuración') contenidoCentral = <Configuracion />;
  if (seccionActiva === 'Regalos') contenidoCentral = <GestionRegalos />;
  if (seccionActiva === 'Niveles') contenidoCentral = <ConfiguracionNiveles />;

  return (
    <div className="container-fluid mt-4 h-100">
      <PanelHeader
        isLive={userStream ? (userStream as any).isLive : false}
        onToggleStream={handleToggleStream}
      />

      <div className="row mt-3 h-100">
        <PanelOptions
          opciones={["Stream", "Videos", "Estadísticas", "Regalos", "Niveles"]}
          onSeleccionar={(o) => setSeccionActiva(o)}
        />

        <div className="col-10">
          {contenidoCentral}
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
