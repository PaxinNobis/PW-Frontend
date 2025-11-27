/**
 * Gestor de Regalos Personalizados del Streamer
 * Usa los endpoints:
 * - GET /api/panel/gifts
 * - POST /api/panel/gifts
 * - PUT /api/panel/gifts/:id
 * - DELETE /api/panel/gifts/:id
 */

import { useEffect, useState } from 'react';
import { getCustomGifts, createCustomGift, updateCustomGift, deleteCustomGift } from '../../services/panel.service';

interface Gift {
  id: string;
  nombre: string;
  costo: number;
  puntos: number;
  streamerId: string;
}

const GiftsManager = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    costo: 0,
    puntos: 0
  });

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const data = await getCustomGifts();
      setGifts(data);
      console.log('Regalos cargados:', data.length);
    } catch (err: any) {
      console.error('Error al cargar regalos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGift) {
        // Actualizar regalo existente
        await updateCustomGift(editingGift.id, formData);
        console.log('Regalo actualizado');
      } else {
        // Crear nuevo regalo
        await createCustomGift(formData);
        console.log('Regalo creado');
      }
      
      // Recargar lista y cerrar modal
      await loadGifts();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar regalo:', err);
      alert('Error al guardar regalo: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este regalo?')) return;
    
    try {
      await deleteCustomGift(id);
      console.log('Regalo eliminado');
      await loadGifts();
    } catch (err: any) {
      console.error('Error al eliminar regalo:', err);
      alert('Error al eliminar regalo: ' + err.message);
    }
  };

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setFormData({
      nombre: gift.nombre,
      costo: gift.costo,
      puntos: gift.puntos
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGift(null);
    setFormData({ nombre: '', costo: 0, puntos: 0 });
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando regalos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-gift me-2"></i>
          Regalos Personalizados
        </h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Regalo
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Lista de regalos */}
      <div className="row g-3">
        {gifts.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No tienes regalos personalizados. ¡Crea uno!
            </div>
          </div>
        ) : (
          gifts.map((gift) => (
            <div key={gift.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{gift.nombre}</h5>
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">
                      <i className="bi bi-coin me-1"></i>
                      {gift.costo} monedas
                    </span>
                    <span className="badge bg-success">
                      <i className="bi bi-star me-1"></i>
                      {gift.puntos} puntos
                    </span>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button 
                      className="btn btn-sm btn-outline-primary flex-fill"
                      onClick={() => handleEdit(gift)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(gift.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingGift ? 'Editar Regalo' : 'Nuevo Regalo'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Regalo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Costo (monedas)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.costo}
                      onChange={(e) => setFormData({ ...formData, costo: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puntos otorgados</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.puntos}
                      onChange={(e) => setFormData({ ...formData, puntos: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingGift ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftsManager;
