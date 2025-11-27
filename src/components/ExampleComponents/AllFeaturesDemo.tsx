/**
 * Componente de Demostración - Todas las Nuevas Funcionalidades
 * 
 * Este componente muestra cómo usar todos los hooks nuevos
 */

import { 
  useViewers, 
  usePoints, 
  useMedals, 
  useProfile,
  useNotifications,
  useClips,
  useFriends,
  useStreamerLevel
} from '../../hooks/useNewFeatures';

interface AllFeaturesDemoProps {
  streamId?: string;
  userId?: string;
}

export default function AllFeaturesDemo({ streamId, userId }: AllFeaturesDemoProps) {
  // 1. Viewers
  const { 
    viewers, 
    viewerCount, 
    loading: viewersLoading 
  } = useViewers(streamId || null);

  // 2. Puntos
  const { 
    points, 
    loading: pointsLoading,
    earnPoints 
  } = usePoints();

  // 3. Medallas
  const { 
    medals, 
    loading: medalsLoading 
  } = useMedals();

  // 4. Perfil
  const { 
    profile, 
    loading: profileLoading 
  } = useProfile(userId);

  // 5. Notificaciones
  const { 
    notifications, 
    unreadCount,
    markAsRead,
    loading: notificationsLoading 
  } = useNotifications();

  // 6. Clips
  const { 
    clips, 
    loading: clipsLoading 
  } = useClips();

  // 7. Amigos
  const { 
    friends, 
    requests,
    loading: friendsLoading 
  } = useFriends();

  // 8. Nivel de Streamer
  const { 
    levelData, 
    allLevels,
    loading: levelLoading 
  } = useStreamerLevel();

  return (
    <div className="container my-4">
      <h1 className="mb-4">🎉 Demo de Todas las Funcionalidades</h1>

      {/* 1. VIEWERS */}
      <section className="mb-5">
        <h2>👥 Viewers en Vivo</h2>
        {viewersLoading ? (
          <p>Cargando viewers...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>Espectadores: {viewerCount}</h3>
              <ul className="list-group">
                {viewers.slice(0, 5).map(viewer => (
                  <li key={viewer.id} className="list-group-item">
                    <img 
                      src={viewer.pfp} 
                      alt={viewer.name} 
                      width="30" 
                      height="30" 
                      className="rounded-circle me-2"
                    />
                    {viewer.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* 2. PUNTOS */}
      <section className="mb-5">
        <h2>⭐ Sistema de Puntos</h2>
        {pointsLoading ? (
          <p>Cargando puntos...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>Puntos Totales: {points?.total || 0}</h3>
              <div className="row">
                {points?.byStreamer.slice(0, 3).map(s => (
                  <div key={s.streamerId} className="col-md-4">
                    <div className="card mb-2">
                      <div className="card-body">
                        <h5>{s.streamerName}</h5>
                        <p className="mb-0">{s.points} puntos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => earnPoints('streamer-1', 'message_sent', 1)}
              >
                Ganar 1 Punto (Demo)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. MEDALLAS */}
      <section className="mb-5">
        <h2>🏅 Medallas</h2>
        {medalsLoading ? (
          <p>Cargando medallas...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>Medallas Ganadas: {medals.length}</h3>
              <div className="row">
                {medals.slice(0, 4).map(medal => (
                  <div key={medal.id} className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <div className="display-4">🏅</div>
                        <h6>{medal.name}</h6>
                        <small className="text-muted">{medal.level}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. PERFIL */}
      <section className="mb-5">
        <h2>👤 Perfil de Usuario</h2>
        {profileLoading ? (
          <p>Cargando perfil...</p>
        ) : profile ? (
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src={profile.pfp} 
                  alt={profile.name} 
                  width="80" 
                  height="80" 
                  className="rounded-circle me-3"
                />
                <div>
                  <h3 className="mb-0">{profile.name}</h3>
                  <p className="text-muted mb-0">{profile.email}</p>
                  <span className={`badge ${profile.online ? 'bg-success' : 'bg-secondary'}`}>
                    {profile.online ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
              </div>
              <p>{profile.bio}</p>
              <div className="row text-center">
                <div className="col-3">
                  <strong>{profile.stats.followers}</strong>
                  <p className="text-muted small">Seguidores</p>
                </div>
                <div className="col-3">
                  <strong>{profile.stats.following}</strong>
                  <p className="text-muted small">Siguiendo</p>
                </div>
                <div className="col-3">
                  <strong>{profile.stats.streamingHours}</strong>
                  <p className="text-muted small">Horas</p>
                </div>
                <div className="col-3">
                  <strong>{profile.stats.totalViewers}</strong>
                  <p className="text-muted small">Viewers</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No se pudo cargar el perfil</p>
        )}
      </section>

      {/* 5. NOTIFICACIONES */}
      <section className="mb-5">
        <h2>🔔 Notificaciones</h2>
        {notificationsLoading ? (
          <p>Cargando notificaciones...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>
                Notificaciones 
                {unreadCount > 0 && (
                  <span className="badge bg-danger ms-2">{unreadCount}</span>
                )}
              </h3>
              <div className="list-group">
                {notifications.slice(0, 5).map(notif => (
                  <div 
                    key={notif.id} 
                    className={`list-group-item ${!notif.read ? 'bg-light' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{notif.title}</h6>
                      {!notif.read && <span className="text-danger">●</span>}
                    </div>
                    <p className="mb-1">{notif.message}</p>
                    <small className="text-muted">
                      {new Date(notif.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. CLIPS */}
      <section className="mb-5">
        <h2>🎬 Clips</h2>
        {clipsLoading ? (
          <p>Cargando clips...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>Mis Clips: {clips.length}</h3>
              <div className="row">
                {clips.slice(0, 3).map(clip => (
                  <div key={clip.id} className="col-md-4">
                    <div className="card">
                      <img 
                        src={clip.thumbnail} 
                        alt={clip.title} 
                        className="card-img-top"
                      />
                      <div className="card-body">
                        <h6>{clip.title}</h6>
                        <p className="text-muted small">
                          👁️ {clip.views} vistas
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. AMIGOS */}
      <section className="mb-5">
        <h2>👥 Amigos</h2>
        {friendsLoading ? (
          <p>Cargando amigos...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <h3>Amigos: {friends.length}</h3>
              <div className="row">
                {friends.slice(0, 4).map(friend => (
                  <div key={friend.id} className="col-md-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <img 
                          src={friend.pfp} 
                          alt={friend.name} 
                          width="60" 
                          height="60" 
                          className="rounded-circle mb-2"
                        />
                        <h6>{friend.name}</h6>
                        <span className={`badge ${friend.online ? 'bg-success' : 'bg-secondary'}`}>
                          {friend.online ? 'En línea' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {requests && (
                <div className="mt-3">
                  <h5>Solicitudes Pendientes</h5>
                  <p>Recibidas: {requests.received.length}</p>
                  <p>Enviadas: {requests.sent.length}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 8. NIVEL DE STREAMER */}
      <section className="mb-5">
        <h2>🚀 Nivel de Streamer</h2>
        {levelLoading ? (
          <p>Cargando nivel...</p>
        ) : levelData ? (
          <div className="card">
            <div className="card-body">
              <h3>Nivel Actual: {levelData.currentLevel.name}</h3>
              
              <div className="mb-4">
                <label className="form-label">
                  Horas Transmitidas: {levelData.progress.currentHours} / {levelData.currentLevel.maxHours}
                </label>
                <div className="progress" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${levelData.progress.hoursProgress}%` }}
                  >
                    {levelData.progress.hoursProgress}%
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Seguidores: {levelData.progress.currentFollowers} / {levelData.currentLevel.maxFollowers}
                </label>
                <div className="progress" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${levelData.progress.followersProgress}%` }}
                  >
                    {levelData.progress.followersProgress}%
                  </div>
                </div>
              </div>

              {levelData.nextLevel && (
                <div className="alert alert-info">
                  <strong>Siguiente Nivel:</strong> {levelData.nextLevel.name}
                </div>
              )}

              <div className="mt-4">
                <h5>Todos los Niveles ({allLevels.length})</h5>
                <div className="row">
                  {allLevels.slice(0, 6).map(level => (
                    <div key={level.id} className="col-md-2">
                      <div className="card text-center">
                        <div className="card-body p-2">
                          <small>{level.level}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No se pudo cargar el nivel</p>
        )}
      </section>

      {/* RESUMEN */}
      <section className="mb-5">
        <div className="alert alert-success">
          <h4>✅ Todas las Funcionalidades Conectadas</h4>
          <p className="mb-0">
            Este componente demuestra que todos los hooks están funcionando correctamente
            y conectados al backend en <code>http://localhost:8080</code>
          </p>
        </div>
      </section>
    </div>
  );
}
