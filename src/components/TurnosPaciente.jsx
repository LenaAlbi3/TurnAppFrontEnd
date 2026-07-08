import React, { useState, useEffect } from 'react';

const TurnosPaciente = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:5001/api/turnos/mis-turnos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTurnos(data);
        }
      } catch (error) {
        console.error("Error al cargar turnos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  }, []);

  if (loading) return <p>Cargando mis turnos...</p>;

  return (
    <div className="turnos-container">
      <h3>Mis Turnos Médicos</h3>
      {turnos.length === 0 ? (
        <p>No tienes turnos reservados.</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              <strong>Fecha:</strong> {turno.fecha} | <strong>Doctor:</strong> {turno.nombreDoctor} | <strong>Estado:</strong> {turno.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurnosPaciente