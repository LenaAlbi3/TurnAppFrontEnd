import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AppContext } from '../context/AppContext';

const TurnosProfesional = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Obtenemos el token del contexto para asegurar la autenticación
  const { token } = useContext(AppContext);
  
  const fetchAgenda = async () => {
    // Seguridad: No realizar la petición si no existe un token activo
    if (!token) {
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/turnos');
      setTurnos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("No se pudo cargar la agenda. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, [token]); // Se vuelve a ejecutar si el token cambia

  const handleEliminarTurno = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno?")) return;

    setActionLoading(true);
    try {
      await api.delete(`/turnos/${id}`);
      setTurnos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("Error al eliminar el turno.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Agenda Profesional</h1>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 shadow rounded-box border border-base-200">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>DNI</th>
              <th>Fecha y Hora</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.pacienteNombreCompleto || "Libre"}</td>
                  <td>{turno.pacienteDni || "-"}</td>
                  <td>{new Date(turno.fechaHora).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${turno.estadoTurno === 'Reservado' ? 'badge-primary' : 'badge-ghost'}`}>
                      {turno.estadoTurno}
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      onClick={() => handleEliminarTurno(turno.id)} 
                      disabled={actionLoading}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Todavía no tienes turnos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnosProfesional;