import { useState } from 'react';
import { Link } from 'wouter';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const MyProfile = () => {
  const { user, updateUser, hasRole } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatearParaInput = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const mes = `0${d.getMonth() + 1}`.slice(-2);
    const dia = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${mes}-${dia}`;
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

  if (!user) {
    return <div className="p-6 text-center text-error">Debes iniciar sesión para ver tu perfil.</div>;
  }

  const esProfesional = hasRole('Prof');
  const esAdmin = hasRole('Admin');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.put('/usuario/actualizar', formData);

      const datosActualizados = response.data || { ...user, ...formData };
      
      updateUser(datosActualizados); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert(error.response?.data?.Message || "Hubo un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      fechaNacimiento: formatearParaInput(user?.fechaNacimiento)
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-base-content">Mi Perfil</h2>
      
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold">Información Personal</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel} 
                  className="btn btn-sm btn-ghost"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="btn btn-sm btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : "Guardar"}
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-sm btn-outline btn-primary"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!isEditing && <p><strong className="text-base-content/70">DNI:</strong> {user.dni}</p>}

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label font-medium text-xs text-base-content/70">Nombre</label>
                <input 
                  type="text"
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                />
              </div>

              <div className="form-control">
                <label className="label font-medium text-xs text-base-content/70">Apellido</label>
                <input 
                  type="text"
                  name="apellido" 
                  value={formData.apellido} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label font-medium text-xs text-base-content/70">Email</label>
                <input 
                  type="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label font-medium text-xs text-base-content/70">Fecha de Nacimiento</label>
                <input 
                  type="date"
                  name="fechaNacimiento" 
                  value={formData.fechaNacimiento} 
                  onChange={handleInputChange} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p><strong className="text-base-content/70">Nombre:</strong> {user.nombre || "No especificado"}</p>
              <p><strong className="text-base-content/70">Apellido:</strong> {user.apellido || "No especificado"}</p>
              <p><strong className="text-base-content/70">Email:</strong> {user.email}</p>
              <p><strong className="text-base-content/70">Fecha de Nacimiento:</strong> {formatearParaLectura(user.fechaNacimiento)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Link href="/mis-turnos-paciente">
          <button className="w-full btn btn-outline btn-primary py-3 h-auto">Ver Mis Turnos</button>
        </Link>

        {esProfesional && (
          <Link href="/agenda-doctor">
            <button className="w-full btn btn-primary py-3 h-auto">Ver Mi Agenda Profesional</button>
          </Link>
        )}

        {esAdmin && (
          <Link href="/admin">
            <button className="w-full btn btn-error py-3 h-auto text-white">Panel de Administrador</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MyProfile;