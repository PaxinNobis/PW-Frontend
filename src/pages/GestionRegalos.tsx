// pages/GestionRegalos.tsx
// Componente para que streamers gestionen regalos personalizados

import { useState, useEffect } from 'react';
import { getCustomGifts, createCustomGift, updateCustomGift, deleteCustomGift } from '../services/panel.service';
import type { CustomGift, CreateGiftRequest } from '../types/api';
import ConfirmationModal from '../components/Shared/ConfirmationModal';
import './GestionRegalos.css';

const GestionRegalos = () => {
  const [regalos, setRegalos] = useState<CustomGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    costo: 0,
    puntos: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchRegalos();
  }, []);

  const fetchRegalos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomGifts();
      setRegalos(data);
    } catch (error: any) {
      console.error('Error fetching gifts:', error);
      setError('No se pudieron cargar los regalos. El backend no está disponible o el endpoint no está implementado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const giftData: CreateGiftRequest = {
      nombre: formData.nombre,
      costo: formData.costo,
      puntos: formData.puntos
    };

    try {
      if (editingId) {
        await updateCustomGift(editingId, giftData);
      } else {
        await createCustomGift(giftData);
      }
      await fetchRegalos();
      resetForm();
    } catch (error) {
      console.error('Error saving gift:', error);
    }
  };

  const handleEdit = (regalo: CustomGift) => {
    setFormData({
      nombre: regalo.nombre,
      costo: regalo.costo,
      puntos: regalo.puntos
    });
    setEditingId(regalo.id);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteCustomGift(itemToDelete);
      await fetchRegalos();
    } catch (error) {
      console.error('Error deleting gift:', error);
    } finally {
      setItemToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', costo: 0, puntos: 0 });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Regalos</h3>
          <p className="text-muted mb-0">Personaliza los regalos disponibles en tu canal</p>
        </div>

        <div className="card-body">
          {/* Formulario para agregar/editar regalo */}
          <div className="nuevo-regalo-form mb-4">
            <h5>{editingId ? 'Editar Regalo' : 'Agregar Nuevo Regalo'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nombre del Regalo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: 🌟 Estrella Dorada"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Costo (DogeCoins)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="10"
                    value={formData.costo}
                    onChange={(e) => setFormData({ ...formData, costo: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Puntos que otorga</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="5"
                    value={formData.puntos}
                    onChange={(e) => setFormData({ ...formData, puntos: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    {editingId ? 'Actualizar' : 'Agregar'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Lista de regalos */}
          <div className="regalos-lista">
            <h5 className="mb-3">Regalos Actuales ({regalos.length})</h5>

            {error ? (
              <div className="alert alert-warning" role="alert">
                <strong>Error:</strong> {error}
                <br />
                <small className="text-muted">
                  El backend necesita implementar el endpoint <code>GET /api/panel/gifts</code>
                </small>
              </div>
            ) : loading ? (
              <div className="text-center py-4">Cargando...</div>
            ) : regalos.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No has creado regalos aún. ¡Crea tu primer regalo personalizado!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Costo (DogeCoins)</th>
                      <th>Puntos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regalos.map(regalo => (
                      <tr key={regalo.id}>
                        <td>
                          <span className="regalo-nombre">{regalo.nombre}</span>
                        </td>
                        <td>
                          <span>{regalo.costo}</span>
                        </td>
                        <td>
                          <span>{regalo.puntos}</span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(regalo)}
                            >
                              <i className="bi bi-pencil"></i> Editar
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteClick(regalo.id)}
                            >
                              <i className="bi bi-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Regalo"
        message="¿Estás seguro de que quieres eliminar este regalo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        confirmColor="danger"
      />
    </div>
  );
};

export default GestionRegalos;
