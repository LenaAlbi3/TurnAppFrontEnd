import { useState } from 'react';
import { Link } from 'wouter';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const MyProfile = () => {
  const { user, updateUser, hasRole } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const esProfesional = hasRole('Prof');
  const esAdmin = hasRole('Admin');

  const formatearParaInput = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0];
  };

  const formatearParaLectura = (fecha) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    fechaNacimiento: formatearParaInput(user?.fechaNacimiento)
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/pacientes/${user.id}`, formData);
      updateUser({ ...user, ...response.data });
      setIsEditing(false);
      alert("Perfil de paciente actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert(error.response?.data?.message || "Error al actualizar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-6 text-center text-error">Debes iniciar sesión.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Mi Perfil</h2>
      
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold">Información Personal</h3>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-ghost">Cancelar</button>
              <button onClick={handleSave} className="btn btn-sm btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline btn-primary">Editar Perfil</button>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="input input-bordered w-full" placeholder="Nombre" />
            <input name="apellido" value={formData.apellido} onChange={handleInputChange} className="input input-bordered w-full" placeholder="Apellido" />
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="input input-bordered w-full md:col-span-2" placeholder="Email" />
            <input name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleInputChange} className="input input-bordered w-full md:col-span-2" />
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Apellido:</strong> {user.apellido}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Fecha de Nacimiento:</strong> {formatearParaLectura(user.fechaNacimiento)}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/mis-turnos-paciente" className="btn btn-outline">Ver Mis Turnos</Link>
        {esProfesional && <Link href="/agenda-doctor" className="btn btn-primary">Ver Agenda Profesional</Link>}
        {esAdmin && <Link href="/admin" className="btn btn-error text-white">Panel Admin</Link>}
      </div>
    </div>
  );
};

export default MyProfile;