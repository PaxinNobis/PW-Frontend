/**
 * Componente de búsqueda conectado al backend
 * Usa el endpoint GET /api/data/search/:query
 */

import { useState } from 'react';
import { searchStreams } from '../../services/data.service';
import StreamCard from '../HomeComponents/Streamcard';
import type { Stream } from '../../GlobalObjects/Objects_DataTypes';

const SearchWithBackend = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchStreams(query);
      
      // Convertir datos del backend al formato local
      const convertedResults: Stream[] = data.map((s: any) => ({
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
      }));

      setResults(convertedResults);
      console.log(`Búsqueda completada: ${convertedResults.length} resultados`);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar streams. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      {/* Barra de búsqueda */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar streams o streamers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>
                    Buscar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mensaje de info */}
      {!searched && (
        <div className="alert alert-info text-center" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Busca streams por título o nombre del streamer
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Resultados */}
      {searched && !loading && !error && (
        <>
          <div className="mb-3">
            <h4 className="fw-bold">
              {results.length > 0 
                ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
                : `No se encontraron resultados para "${query}"`
              }
            </h4>
          </div>

          <div className="row">
            {results.length > 0 ? (
              results.map((stream: Stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-warning text-center" role="alert">
                  <i className="bi bi-search me-2"></i>
                  No se encontraron streams que coincidan con tu búsqueda.
                  <br />
                  <small className="text-muted">Intenta con otros términos</small>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchWithBackend;
