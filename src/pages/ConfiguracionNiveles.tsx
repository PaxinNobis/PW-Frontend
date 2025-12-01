import { useState, useEffect } from 'react';
import './ConfiguracionNiveles.css';
import { getLoyaltyLevels, updateLoyaltyLevels, getLoyaltyTemplates, type LoyaltyLevel } from '../services/loyalty.service';

const ConfiguracionNiveles = () => {
  const [niveles, setNiveles] = useState<LoyaltyLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userLevelsData, templateData] = await Promise.all([
        getLoyaltyLevels(),
        getLoyaltyTemplates()
      ]);

      if (templateData && templateData.length > 0) {
        // Merge template data with user's saved points/rewards
        const mergedLevels = templateData.map((templateLevel, index) => {
          // Try to find matching user level by ID or index
          // Assuming template IDs are 1-10 and user IDs might match or be sequential
          const userLevel = userLevelsData.find(ul => ul.id === templateLevel.id) || userLevelsData[index];

          return {
            ...templateLevel,
            // Use user's points/reward if available, otherwise default to template
            puntosRequeridos: userLevel ? userLevel.puntosRequeridos : templateLevel.puntosRequeridos,
            recompensa: userLevel ? userLevel.recompensa : templateLevel.recompensa,
            // Always use template name and image
            nombre: templateLevel.nombre,
            image: templateLevel.image
          };
        });
        setNiveles(mergedLevels);
      } else {
        setError('No se pudo cargar la plantilla de niveles del sistema solar.');
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: number, field: keyof LoyaltyLevel, value: string | number) => {
    setNiveles(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const saveAllLevels = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

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
      <div className="card-header">
        <div>
          <h3>Niveles de Lealtad: Sistema Solar</h3>
          <p className="text-muted mb-0">Configura los puntos y recompensas para cada nivel planetario.</p>
        </div>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Icono</th>
                <th>Nombre del Nivel</th>
                <th>Puntos Requeridos</th>
                <th>Recompensa</th>
              </tr>
            </thead>
            <tbody>
              {niveles.map((nivel) => (
                <tr key={nivel.id || Math.random()}>
                  <td>
                    {nivel.image ? (
                      <img src={nivel.image} alt={nivel.nombre} className="rounded-circle medal"/>
                    ) : (
                      <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white">
                        {nivel.nombre.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="fw-bold">{nivel.nombre}</span>
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
                      placeholder="Recompensa (Opcional)"
                    />
                  </td>
                </tr>
              ))}
              {niveles.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No se encontraron niveles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted small">
            <i className="bi bi-info-circle me-2"></i>
            Los nombres e imágenes de los niveles son fijos.
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
    </div>
  );
};

export default ConfiguracionNiveles;
