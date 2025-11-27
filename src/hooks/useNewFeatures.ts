/**
 * Hooks personalizados para las nuevas funcionalidades del backend
 */

import { useState, useEffect, useCallback } from 'react';

// Importar servicios
import * as viewerService from '../services/viewer.service';
import * as pointsService from '../services/points.service';
import * as medalService from '../services/medal.service';
import * as profileService from '../services/profile.service';
import * as notificationService from '../services/notification.service';
import * as clipService from '../services/clip.service';
import * as friendService from '../services/friend.service';
import * as streamerService from '../services/streamer.service';

/**
 * Hook para gestionar viewers de un stream
 */
export const useViewers = (streamId: string | null) => {
  const [viewers, setViewers] = useState<viewerService.ActiveViewer[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadViewers = useCallback(async () => {
    if (!streamId) return;
    
    try {
      setLoading(true);
      const data = await viewerService.getViewers(streamId);
      setViewers(data.viewers);
      setViewerCount(data.count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [streamId]);

  const joinStream = useCallback(async () => {
    if (!streamId) return;
    
    try {
      const data = await viewerService.joinStream(streamId);
      setViewers(data.viewersList);
      setViewerCount(data.currentViewers);
    } catch (err: any) {
      setError(err.message);
    }
  }, [streamId]);

  const leaveStream = useCallback(async () => {
    if (!streamId) return;
    
    try {
      const data = await viewerService.leaveStream(streamId);
      setViewerCount(data.currentViewers);
    } catch (err: any) {
      setError(err.message);
    }
  }, [streamId]);

  useEffect(() => {
    loadViewers();
  }, [loadViewers]);

  return { viewers, viewerCount, loading, error, joinStream, leaveStream, reload: loadViewers };
};

/**
 * Hook para gestionar puntos del usuario
 */
export const usePoints = () => {
  const [points, setPoints] = useState<pointsService.UserPoints | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pointsService.getUserPoints();
      setPoints(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const earnPoints = useCallback(async (streamerId: string, action: string, amount: number) => {
    try {
      const data = await pointsService.earnPoints({
        streamerId,
        action: action as any,
        amount
      });
      await loadPoints(); // Recargar puntos
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadPoints]);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return { points, loading, error, earnPoints, reload: loadPoints };
};

/**
 * Hook para gestionar medallas del usuario
 */
export const useMedals = () => {
  const [medals, setMedals] = useState<medalService.UserMedal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMedals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await medalService.getUserMedals();
      setMedals(data.medals);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedals();
  }, [loadMedals]);

  return { medals, loading, error, reload: loadMedals };
};

/**
 * Hook para gestionar perfil de usuario
 */
export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<profileService.UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log(`Cargando perfil del usuario: ${userId}`);
      const data = await profileService.getUserProfile(userId);
      console.log(`Datos recibidos del backend:`, data);
      setProfile(data);
      console.log(`Perfil cargado exitosamente: ${data.name || 'SIN NOMBRE'}`);
    } catch (err: any) {
      console.error(`Error al cargar perfil de ${userId}:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (data: profileService.UpdateProfileRequest) => {
    try {
      const result = await profileService.updateProfile(data);
      setProfile(result.updatedUser);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateAvatar = useCallback(async (file: File) => {
    try {
      const result = await profileService.updateAvatar(file);
      await loadProfile(); // Recargar perfil
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, error, updateProfile, updateAvatar, reload: loadProfile };
};

/**
 * Hook para gestionar notificaciones
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<notificationService.Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (unread?: boolean) => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(unread);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, reload: loadNotifications };
};

/**
 * Hook para gestionar clips
 */
export const useClips = () => {
  const [clips, setClips] = useState<clipService.Clip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClips = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await clipService.getClips(page);
      setClips(data.clips);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClip = useCallback(async (data: clipService.CreateClipRequest) => {
    try {
      const newClip = await clipService.createClip(data);
      await loadClips();
      return newClip;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadClips]);

  const deleteClip = useCallback(async (id: string) => {
    try {
      await clipService.deleteClip(id);
      await loadClips();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadClips]);

  useEffect(() => {
    loadClips();
  }, [loadClips]);

  return { clips, loading, error, createClip, deleteClip, reload: loadClips };
};

/**
 * Hook para gestionar amigos
 */
export const useFriends = () => {
  const [friends, setFriends] = useState<friendService.Friend[]>([]);
  const [requests, setRequests] = useState<friendService.FriendRequestsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      const data = await friendService.getFriends();
      setFriends(data.friends);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const data = await friendService.getFriendRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const sendRequest = useCallback(async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId);
      await loadRequests();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadRequests]);

  const acceptRequest = useCallback(async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      await loadFriends();
      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadFriends, loadRequests]);

  const rejectRequest = useCallback(async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadRequests]);

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, [loadFriends, loadRequests]);

  return { friends, requests, loading, error, sendRequest, acceptRequest, rejectRequest, reload: loadFriends };
};

/**
 * Hook para gestionar nivel de streamer
 */
export const useStreamerLevel = () => {
  const [levelData, setLevelData] = useState<streamerService.StreamerLevelResponse | null>(null);
  const [allLevels, setAllLevels] = useState<streamerService.Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLevel = useCallback(async () => {
    try {
      setLoading(true);
      const data = await streamerService.getStreamerLevel();
      setLevelData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllLevels = useCallback(async () => {
    try {
      const data = await streamerService.getAllLevels();
      setAllLevels(data.levels);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const updateHours = useCallback(async (hours: number) => {
    try {
      const result = await streamerService.updateStreamingHours(hours);
      await loadLevel(); // Recargar nivel
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [loadLevel]);

  useEffect(() => {
    loadLevel();
    loadAllLevels();
  }, [loadLevel, loadAllLevels]);

  return { levelData, allLevels, loading, error, updateHours, reload: loadLevel };
};
