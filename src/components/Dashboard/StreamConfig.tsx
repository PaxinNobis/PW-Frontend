import React, { useState, useEffect } from 'react';
import { updateStreamSettings, type StreamSettings } from '../../services/streamer.service';
import { getAllGames, getAllTags, getStreamDetails } from '../../services/data.service';
import { getCurrentUser } from '../../services/auth.service';
import type { Game, Tag, Stream } from '../../types/api';
import './StreamConfig.css'; // Asumimos que crearemos este archivo o usaremos estilos existentes

// Extend Stream type to include potential missing properties from backend
interface ExtendedStream extends Stream {
    gameId?: string;
    iframeUrl?: string;
}

const StreamConfig: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [gameId, setGameId] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [iframeUrl, setIframeUrl] = useState('');
    const [isLive, setIsLive] = useState(false);

    const [games, setGames] = useState<Game[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [gamesData, tagsData] = await Promise.all([
                    getAllGames(),
                    getAllTags()
                ]);
                // Handle potential response wrapping (e.g. { games: [...] } instead of [...])
                const gamesList = Array.isArray(gamesData) ? gamesData : (gamesData as any).games || [];
                const tagsList = Array.isArray(tagsData) ? tagsData : (tagsData as any).tags || [];

                setGames(gamesList);
                setTags(tagsList);

                if (user?.name) {
                    const streamData = await getStreamDetails(user.name) as ExtendedStream;
                    if (streamData) {
                        setTitle(streamData.title || '');
                        // Map game object to gameId if gameId is not present
                        setGameId(streamData.gameId || streamData.game?.id || '');
                        // Map tags to IDs
                        const currentTagIds = streamData.tags?.map(t => t.id) || [];
                        setSelectedTags(currentTagIds);
                        setIframeUrl(streamData.iframeUrl || '');
                        setIsLive(streamData.isLive || false);
                    }
                }
            } catch (error) {
                console.error("Error loading stream config data:", error);
                setMessage({ text: "Error al cargar datos de configuración", type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        }
    }, [user]);

    const handleTagChange = (tagId: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                if (prev.length >= 3) return prev; // Límite de 3 tags
                return [...prev, tagId];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const settings: StreamSettings = {
            title,
            gameId,
            tags: selectedTags,
            iframeUrl,
            isLive
        };

        try {
            const response = await updateStreamSettings(settings);
            if (response.success) {
                setMessage({ text: "Configuración actualizada correctamente", type: 'success' });

                // Fallback 1: Save iframeUrl to localStorage (for self-view)
                if (iframeUrl) {
                    localStorage.setItem('stream_iframe_url', iframeUrl);
                }

                // Fallback 2: Save iframeUrl to User Bio (for public view)
                // This is a workaround because the backend doesn't return iframeUrl in public stream details
                try {
                    const { updateProfile, getUserProfile } = await import('../../services/profile.service');
                    const { getCurrentUser } = await import('../../services/auth.service');
                    const currentUser = getCurrentUser();

                    if (currentUser && iframeUrl) {
                        // Fetch current profile to get existing bio
                        const profile = await getUserProfile(currentUser.id);
                        let currentBio = profile.bio || "";

                        // Remove existing hidden tag if any
                        currentBio = currentBio.replace(/\|STREAM_URL=.*?\|/g, '').trim();

                        // Append new hidden tag
                        const newBio = `${currentBio} |STREAM_URL=${iframeUrl}|`;

                        await updateProfile({ bio: newBio });
                        console.log("Saved iframeUrl to bio as workaround");
                    }
                } catch (err) {
                    console.error("Error saving iframeUrl to bio:", err);
                }

                window.dispatchEvent(new Event('streamUpdated'));
            } else {
                setMessage({ text: "Error al actualizar configuración", type: 'error' });
            }
        } catch (error) {
            console.error("Error updating stream settings:", error);
            setMessage({ text: "Error al actualizar configuración", type: 'error' });
        } finally {
            setSaving(false);
        }
    };



    if (loading) return <div className="loading-spinner">Cargando configuración...</div>;

    return (
        <div className="stream-config-container glass-panel">
            <h2>Configuración del Stream</h2>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="stream-config-form">
                <div className="form-group">
                    <label htmlFor="title">Título del Stream</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: Jugando League of Legends - Ranked"
                        className="glass-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="game">Categoría / Juego</label>
                    <select
                        id="game"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        className="glass-input"
                    >
                        <option value="">Selecciona un juego</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Tags (Máx 3)</label>
                    <div className="tags-selector">
                        {tags.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                className={`tag-btn ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                                onClick={() => handleTagChange(tag.id)}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="iframeUrl">URL del Iframe (Embed)</label>
                    <input
                        type="text"
                        id="iframeUrl"
                        value={iframeUrl}
                        onChange={(e) => setIframeUrl(e.target.value)}
                        placeholder="https://player.twitch.tv/?channel=..."
                        className="glass-input"
                    />
                    <small className="help-text">URL directa del reproductor de video</small>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StreamConfig;
