import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import api from '../services/api';
import { AppContext } from '../context/AppContext';

const TurnosPaciente = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  
  // Obtenemos el token desde el contexto global
  const { token } = useContext(AppContext);

  const fetchMisTurnos = async () => {
    // Seguridad: Si no hay token, no realizamos la petición
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/turnos'); 
      
      if (Array.isArray(response.data)) {
        setTurnos(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setTurnos(response.data.turnos || []); 
      } else {
        setTurnos([]);
      }
    } catch (err) {
      console.error("Error al cargar turnos:", err);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMisTurnos(); 
  }, [token]); // Dependencia del token para recargar si cambia

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar este turno?")) return;
    
    try {
      await api.delete(`/turnos/${id}`);
      setTurnos(prev => prev.filter(t => t.id !== id));
    } catch (err) { 
      alert("Error al cancelar el turno."); 
    }
  };

  const handleReprogramar = (turno) => {
    sessionStorage.setItem("turnoAReprogramar", turno.id);
    setLocation(`/turno/${turno.profesionalId}`); 
  };

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner"></span></div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Mis Turnos</h1>
      
      <div className="overflow-x-auto bg-base-100 shadow rounded-box border border-base-200">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Profesional</th>
              <th>Especialidad</th>
              <th>Fecha y Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.profesionalNombreCompleto}</td>
                  <td>{turno.profesionalEspecialidad}</td>
                  <td>{new Date(turno.fechaHora).toLocaleString()}</td>
                  <td className="flex gap-2">
                    <button 
                      onClick={() => handleCancelar(turno.id)} 
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => handleReprogramar(turno)} 
                      className="btn btn-sm btn-primary"
                    >
                      Reprogramar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
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

export default TurnosPaciente;