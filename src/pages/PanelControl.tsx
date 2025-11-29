import { useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import PanelStream from '../components/PanelStream';
import PanelOptions from '../components/PanelOptions';
import Videos from '../components/ProfileComponents/Videos';
import Analiticas from './Analiticas';
import Configuracion from './Configuracion';
import ConfiguracionNiveles from './ConfiguracionNiveles';
import GestionRegalos from './GestionRegalos';

const PanelControl = function () {
  type Stream = { id: number; title: string; viewers: number; status: 'live' | 'idle' | 'offline' };
  const mockStreams: Stream[] = [
    { id: 1, title: 'Mi stream en vivo', viewers: 120, status: 'live' },
    { id: 2, title: 'Prueba de audio', viewers: 8, status: 'idle' },
  ];

  const [seccionActiva, setSeccionActiva] = useState('Stream');

  let contenidoCentral = (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Panel de Control - Stream</h5>
        <p className="text-muted">Controles y vista previa del stream activo.</p>
      </div>
    </div>
  );

  if (seccionActiva === 'Stream') contenidoCentral = (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Vista previa del Stream</h5>
        <p className="text-muted">Aquí aparecerá la vista previa y controles del stream.</p>
        <div className="mt-3">
          <p className="mb-2">
            <small className="text-muted">Horas restantes para acceder al siguiente nivel:</small>
          </p>
          <div className="progress profile-progress-bar">
            <div
              className="progress-bar bg-success profile-progress-value"
              role="progressbar"
              aria-valuenow={30}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              65%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (seccionActiva === 'Videos') contenidoCentral = <Videos />;
  if (seccionActiva === 'Estadísticas') contenidoCentral = <Analiticas />;
  if (seccionActiva === 'Configuración') contenidoCentral = <Configuracion />;
  if (seccionActiva === 'Regalos') contenidoCentral = <GestionRegalos />;
  if (seccionActiva === 'Niveles') contenidoCentral = <ConfiguracionNiveles />;

  return (
    <div className="container mt-4">
      <PanelHeader />

      <div className="row mt-3">
        <PanelOptions
          opciones={["Stream", "Videos", "Estadísticas", "Regalos", "Niveles"]}
          onSeleccionar={(o) => setSeccionActiva(o)}
        />

        <div className="col-8">
          {contenidoCentral}
        </div>

        <div className="col-2">
          <div className="list-group">
            {mockStreams.map(s => (
              <PanelStream key={s.id} stream={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
