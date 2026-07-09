import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TurnosDoctorPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE_URL = 'https://localhost:7298/api/turno'; 
  
  const token = localStorage.getItem('token');
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  const fetchAgenda = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: authHeaders
      });
      setTurnos(response.data);
    } catch (err) {
      console.error("Error al cargar los turnos desde el backend:", err);
      setError("No se pudo cargar el listado de turnos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const handleEliminarTurno = async (id, fechaHora) => {
    const { dia, horario } = formatearFechaHora(fechaHora);
    
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el turno del día ${dia} a las ${horario} hs?`);
    if (!confirmar) return;

    setActionLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: authHeaders
      });

      setTurnos(prevTurnos => prevTurnos.filter(turno => turno.id !== id));
      alert("Turno eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar el turno:", err);
      const mensajeError = err.response?.data?.message || "No se pudo eliminar el turno en el servidor.";
      setError(mensajeError);
    } finally {
      setActionLoading(false);
    }
  };

  const formatearFechaHora = (fechaHoraString) => {
    const fechaObj = new Date(fechaHoraString);
    
    const dia = fechaObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const horario = fechaObj.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return { dia, horario };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">Cargando agenda de turnos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mis turnos</h1>
          <p className="text-gray-500">Listado completo de citas y gestión de horarios</p>
        </div>
        {actionLoading && (
          <span className="text-sm text-amber-600 font-medium animate-pulse">
            Procesando cambios...
          </span>
        )}
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {turnos.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No existen turnos cargados en el sistema actualmente.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Día
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {turnos.map((turno) => {
                const { dia, horario } = formatearFechaHora(turno.fechaHora);
                
                return (
                  <tr key={turno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {turno.pacienteNombreCompleto || <span className="text-gray-400 italic">No asignado</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.pacienteDni || <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {dia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {horario} hs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        turno.estadoTurno === 'D' || turno.estadoTurno === 'Disponible'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {turno.estadoTurno}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleEliminarTurno(turno.id, turno.fechaHora)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TurnosDoctorPage;