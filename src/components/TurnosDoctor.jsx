import React, { useState, useEffect } from 'react';

const TurnosDoctor = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchAgenda = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:5001/api/turnos/agenda-doctor', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTurnos(data);
        }
      } catch (error) {
        console.error("Error al cargar agenda", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  if (loading) return <p>Cargando agenda de turnos...</p>;

  return (
    <div className="turnos-container agenda-doctor">
      <h3>Mi Agenda de Pacientes</h3>
      {turnos.length === 0 ? (
        <p>No tienes turnos programados.</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              <strong>Fecha:</strong> {turno.fecha} | <strong>Paciente:</strong> {turno.nombrePaciente} | <strong>Motivo:</strong> {turno.motivo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurnosDoctor