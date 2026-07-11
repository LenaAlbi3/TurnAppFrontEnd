import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import api from '../services/api';// Importamos la instancia configurada

const TurnosPacientePage = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const fetchMisTurnos = async () => {
    try {
      const response = await api.get('/turnos'); 
      if (Array.isArray(response.data)) {
        setTurnos(response.data);
    } else if (response.data && typeof response.data === 'object') {
        // A veces el backend devuelve { "turnos": [...] }
        // Ajusta "turnos" según el nombre de la propiedad en tu JSON de respuesta
        setTurnos(response.data.turnos || []); 
    } else {
        setTurnos([]);
    }
  } catch (err) {
    console.error("Error al cargar turnos:", err);
    setTurnos([]); // Por seguridad si falla
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { 
    fetchMisTurnos(); 
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar este turno?")) return;
    
    try {
      // Usamos la instancia api para la petición DELETE
      await api.delete(`/turnos/${id}`);
      setTurnos(prev => prev.filter(t => t.id !== id));
    } catch (err) { 
      alert("Error al cancelar."); 
    }
  };

  const handleReprogramar = (turno) => {
    localStorage.setItem("turnoAReprogramar", turno.id);
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
                    >Cancelar</button>
                    <button 
                      onClick={() => handleReprogramar(turno)} 
                      className="btn btn-sm btn-primary"
                    >Reprogramar</button>
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

export default TurnosPacientePage;