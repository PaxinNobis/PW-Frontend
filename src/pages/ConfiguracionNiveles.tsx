import { useState, useEffect } from 'react';
import './ConfiguracionNiveles.css';
import { getLoyaltyLevels, updateLoyaltyLevels, type LoyaltyLevel } from '../services/loyalty.service';
import ConfirmationModal from '../components/Shared/ConfirmationModal';

const ConfiguracionNiveles = () => {
  const [niveles, setNiveles] = useState<LoyaltyLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const data = await getLoyaltyLevels();
      // Ensure we have at least 5 levels or use the fetched ones
      if (data && data.length > 0) {
        // Map to ensure all fields exist
        const mapped = data.map((l, index) => ({
          id: l.id || index + 1,
          nombre: l.nombre || '',
          puntosRequeridos: l.puntosRequeridos || 0,
          recompensa: l.recompensa || ''
        }));
        setNiveles(mapped);
      } else {
        // Default levels if none exist
        setNiveles([]);
      }
    } catch (err) {
      console.error('Error loading levels:', err);
      setError('No se pudieron cargar los niveles. Usando valores por defecto.');
      // Fallback defaults
      setNiveles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: number, field: keyof LoyaltyLevel, value: string | number) => {
    setNiveles(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleAddLevel = () => {
    const newId = niveles.length > 0 ? Math.max(...niveles.map(n => n.id || 0)) + 1 : 1;
    setNiveles([...niveles, { id: newId, nombre: '', puntosRequeridos: 0, recompensa: '' }]);
  };

  const handleDeleteClick = (id: number) => {
    setLevelToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (levelToDelete !== null) {
      setNiveles(niveles.filter(n => n.id !== levelToDelete));
      setLevelToDelete(null);
    }
  };

  const saveAllLevels = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Send levels without ID if backend doesn't need it, or just send as is.
      // The interface has optional ID.
      await updateLoyaltyLevels(niveles);

      setSuccessMessage('Configuración guardada exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving levels:', err);
      setError('Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5 text-white">Cargando configuración...</div>;
  }

  return (
    <div className="card config-niveles-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h3>Configuración de Niveles de Lealtad</h3>
          <p className="text-muted mb-0">Define los niveles y recompensas para tus seguidores más fieles</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={handleAddLevel}>
          <i className="bi bi-plus-lg me-1"></i> Agregar Nivel
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nombre del Nivel</th>
                <th>Puntos Requeridos</th>
                <th>Recompensa</th>
                <th style={{ width: '100px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {niveles.map((nivel) => (
                <tr key={nivel.id || Math.random()}>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={nivel.nombre}
                      onChange={(e) => handleUpdate(nivel.id!, 'nombre', e.target.value)}
                      placeholder="Nombre del nivel"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={nivel.puntosRequeridos}
                      onChange={(e) => handleUpdate(nivel.id!, 'puntosRequeridos', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={nivel.recompensa}
                      onChange={(e) => handleUpdate(nivel.id!, 'recompensa', e.target.value)}
                      placeholder="Recompensa"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteClick(nivel.id!)}
                      title="Eliminar nivel"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {niveles.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No hay niveles configurados. Agrega uno nuevo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted small">
            <i className="bi bi-info-circle me-2"></i>
            Los cambios se aplicarán inmediatamente a todos los usuarios.
          </div>
          <button
            className="btn btn-save px-4"
            onClick={saveAllLevels}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i> Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Nivel"
        message="¿Estás seguro de que quieres eliminar este nivel?"
        confirmText="Eliminar"
        confirmColor="danger"
      />
    </div>
  );
};

export default ConfiguracionNiveles;
