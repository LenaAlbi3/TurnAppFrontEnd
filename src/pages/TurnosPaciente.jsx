import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TurnosPacientePage = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://localhost:7298/api/turno'; 
  
  const token = localStorage.getItem('token');
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const fetchMisTurnos = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: authHeaders
        });
        
        setTurnos(response.data);
      } catch (err) {
        console.error("Error al obtener los turnos del paciente:", err);
        setError("No se pudo cargar tu listado de turnos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchMisTurnos();
  }, []);

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
        <p className="text-gray-600 text-lg animate-pulse">Cargando tus turnos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis turnos</h1>
        <p className="text-gray-500">Historial y próximos turnos agendados con tus profesionales</p>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {turnos.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Aún no tienes turnos reservados en el sistema.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Especialidad
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {turnos.map((turno) => {
                const { dia, horario } = formatearFechaHora(turno.fechaHora);
                
                return (
                  <tr key={turno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {turno.profesionalNombreCompleto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.profesionalEspecialidad || <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {dia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {horario} hs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        turno.estadoTurno === 'A' || turno.estadoTurno === 'Asignado'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {turno.estadoTurno}
                      </span>
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

export default TurnosPacientePage;