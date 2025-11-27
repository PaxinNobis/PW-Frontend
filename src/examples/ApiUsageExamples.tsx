/**
 * EJEMPLOS DE USO DE LA API
 * 
 * Este archivo contiene ejemplos de cómo usar los servicios y hooks
 * para conectar con el backend. Puedes copiar y adaptar estos ejemplos
 * en tus componentes.
 */

import React from 'react';
import {
  useStreams,
  useTags,
  useGames,
  useFollowing,
  useToggleFollow,
  useAnalytics,
  useCustomGifts,
  useCreateGift,
  useCoinPacks,
  useCreateCheckout,
} from '../hooks';

import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
} from '../services/auth.service';

import { searchStreams } from '../services/data.service';

// ============================================
// EJEMPLO 1: Listar todos los streams
// ============================================
export function StreamListExample() {
  const { data: streams, loading, error, refetch } = useStreams();

  if (loading) return <div>Cargando streams...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Streams Disponibles</h2>
      <button onClick={refetch}>Recargar</button>
      <div>
        {streams?.map((stream) => (
          <div key={stream.id}>
            <h3>{stream.title}</h3>
            <p>Streamer: {stream.streamer.name}</p>
            <p>Viewers: {stream.viewers}</p>
            <p>Juego: {stream.game.name}</p>
            <p>Estado: {stream.isLive ? '🔴 En vivo' : '⚫ Offline'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 2: Login de usuario
// ============================================
export function LoginExample() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await loginUser({ email, password });
      console.log('Usuario logueado:', user);
      alert(`Bienvenido ${user.name}!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ============================================
// EJEMPLO 3: Registro de usuario
// ============================================
export function SignupExample() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await signupUser(formData);
      console.log('Usuario registrado:', user);
      alert(`Cuenta creada exitosamente! Bienvenido ${user.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Crear Cuenta</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Registrarse'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ============================================
// EJEMPLO 4: Seguir/Dejar de seguir streamer
// ============================================
export function FollowButtonExample({ streamerId }: { streamerId: string }) {
  const { mutate: toggleFollow, loading } = useToggleFollow();
  const [isFollowing, setIsFollowing] = React.useState(false);

  const handleToggleFollow = async () => {
    try {
      const result = await toggleFollow(streamerId);
      setIsFollowing(result.isFollowing);
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al seguir/dejar de seguir');
    }
  };

  return (
    <button onClick={handleToggleFollow} disabled={loading}>
      {loading ? 'Procesando...' : isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </button>
  );
}

// ============================================
// EJEMPLO 5: Buscar streams
// ============================================
export function SearchExample() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const streams = await searchStreams(query);
      setResults(streams);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Streams</h2>
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      <div>
        {results.map((stream) => (
          <div key={stream.id}>
            <h3>{stream.title}</h3>
            <p>{stream.streamer.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 6: Panel de Creador - Analíticas
// ============================================
export function AnalyticsPanelExample() {
  const { data: analytics, loading, error } = useAnalytics();

  if (loading) return <div>Cargando analíticas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Mis Analíticas</h2>
      <p>⏱️ Horas transmitidas: {analytics?.horasTransmitidas}</p>
      <p>💰 Monedas recibidas: {analytics?.monedasRecibidas}</p>
    </div>
  );
}

// ============================================
// EJEMPLO 7: Crear regalo personalizado
// ============================================
export function CreateGiftExample() {
  const { mutate: createGift, loading, error } = useCreateGift();
  const [formData, setFormData] = React.useState({
    nombre: '',
    costo: 0,
    puntos: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gift = await createGift(formData);
      console.log('Regalo creado:', gift);
      alert('Regalo creado exitosamente!');
      setFormData({ nombre: '', costo: 0, puntos: 0 });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Regalo Personalizado</h2>
      <input
        type="text"
        placeholder="Nombre del regalo"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Costo en monedas"
        value={formData.costo}
        onChange={(e) => setFormData({ ...formData, costo: Number(e.target.value) })}
        required
      />
      <input
        type="number"
        placeholder="Puntos que otorga"
        value={formData.puntos}
        onChange={(e) => setFormData({ ...formData, puntos: Number(e.target.value) })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Regalo'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  );
}

// ============================================
// EJEMPLO 8: Listar regalos personalizados
// ============================================
export function CustomGiftsListExample() {
  const { data: gifts, loading, error, refetch } = useCustomGifts();

  if (loading) return <div>Cargando regalos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Mis Regalos Personalizados</h2>
      <button onClick={refetch}>Recargar</button>
      <div>
        {gifts?.map((gift) => (
          <div key={gift.id}>
            <h3>{gift.nombre}</h3>
            <p>💰 Costo: {gift.costo} monedas</p>
            <p>⭐ Puntos: {gift.puntos}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 9: Comprar monedas
// ============================================
export function CoinShopExample() {
  const { data: packs, loading } = useCoinPacks();
  const { mutate: createCheckout, loading: checkoutLoading } = useCreateCheckout();

  const handleBuy = async (packId: string) => {
    try {
      const session = await createCheckout({ coinPackId: packId });
      // Redirigir a Stripe
      window.location.href = session.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear sesión de pago');
    }
  };

  if (loading) return <div>Cargando paquetes...</div>;

  return (
    <div>
      <h2>Comprar Monedas</h2>
      <div>
        {packs?.map((pack) => (
          <div key={pack.id}>
            <h3>{pack.nombre}</h3>
            <p>💎 {pack.valor} monedas</p>
            <p>💵 S/ {pack.en_soles}</p>
            <button onClick={() => handleBuy(pack.id)} disabled={checkoutLoading}>
              {checkoutLoading ? 'Procesando...' : 'Comprar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 10: Obtener usuario actual
// ============================================
export function CurrentUserExample() {
  const [user, setUser] = React.useState(getCurrentUser());

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    alert('Sesión cerrada');
  };

  if (!user) {
    return <div>No hay usuario logueado</div>;
  }

  return (
    <div>
      <h2>Usuario Actual</h2>
      <p>👤 Nombre: {user.name}</p>
      <p>📧 Email: {user.email}</p>
      {user.level && <p>🎯 Nivel: {user.level}</p>}
      {user.points && <p>⭐ Puntos: {user.points}</p>}
      {user.coins && <p>💰 Monedas: {user.coins}</p>}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

// ============================================
// EJEMPLO 11: Listar tags y juegos
// ============================================
export function TagsAndGamesExample() {
  const { data: tags, loading: tagsLoading } = useTags();
  const { data: games, loading: gamesLoading } = useGames();

  return (
    <div>
      <div>
        <h2>Tags</h2>
        {tagsLoading ? (
          <p>Cargando...</p>
        ) : (
          tags?.map((tag) => (
            <span key={tag.id} style={{ margin: '5px', padding: '5px', background: '#eee' }}>
              {tag.name}
            </span>
          ))
        )}
      </div>

      <div>
        <h2>Juegos</h2>
        {gamesLoading ? (
          <p>Cargando...</p>
        ) : (
          games?.map((game) => (
            <div key={game.id}>
              <h3>{game.name}</h3>
              <p>Streams: {game._count?.streams}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 12: Streamers que sigo
// ============================================
export function FollowingListExample() {
  const { data: following, loading, error } = useFollowing();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Streamers que Sigo</h2>
      {following?.length === 0 ? (
        <p>No sigues a ningún streamer</p>
      ) : (
        following?.map((streamer) => (
          <div key={streamer.id}>
            <h3>{streamer.name}</h3>
            <p>Email: {streamer.email}</p>
            {streamer.stream && (
              <div>
                <p>Stream: {streamer.stream.title}</p>
                <p>Viewers: {streamer.stream.viewers}</p>
                <p>{streamer.stream.isLive ? '🔴 En vivo' : '⚫ Offline'}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
