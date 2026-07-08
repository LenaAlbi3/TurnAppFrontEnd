import React, { useState, useEffect } from 'react';
import TurnosPaciente from '../components/TurnosPaciente';
import TurnosDoctor from '../components/TurnosDoctor';

const MyProfile = () => {

  const [user, setUser] = useState({ nombre: '', apellido: '', email: '', rol: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://localhost:5001/api/usuarios/perfil';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar el perfil');
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(API_URL, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error('Error al guardar los cambios');
      
      setIsEditing(false); 
      alert('Perfil actualizado con éxito');
    } catch (err) {
      alert(err.message);
    }
  };

  const renderizarTurnosPorRol = () => {
    
    if (user.rol?.toLowerCase() === 'doctor' || user.rol?.toLowerCase() === 'profesional') {
      return <TurnosDoctor />;
    } 
    
    return <TurnosPaciente />;
  };

  if (isLoading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={user.nombre} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Apellido:</label>
            <input type="text" name="apellido" value={user.apellido} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={user.email} onChange={handleInputChange} disabled />
            <small> El email no se puede cambiar.</small>
          </div>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <div className="datos-usuario">
          <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol || 'Paciente'}</p>
          <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
        </div>
      )}
        <hr />
        <div className="seccion-turnos">
          {renderizarTurnosPorRol()}
        </div>
      
    </div>
  );
};

export default MyProfile