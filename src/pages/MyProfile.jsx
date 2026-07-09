import React, { useContext } from 'react';
import { Link } from 'wouter';
import { AppContext } from '../context/AppContext';

const MyProfile = () => {
  const { usuarioLogueado } = useContext(AppContext);

  if (!usuarioLogueado) {
    return <div className="p-6 text-center">Debes iniciar sesión para ver tu perfil.</div>;
  }

  const esProfesional = usuarioLogueado.roles?.includes('Prof');

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mi Perfil</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="space-y-3">
          <p><strong className="text-gray-700">DNI:</strong> {usuarioLogueado.dni}</p>
          <p><strong className="text-gray-700">Email:</strong> {usuarioLogueado.email}</p>
          <p><strong className="text-gray-700">Rol:</strong> {usuarioLogueado.roles?.join(', ') || 'Sin asignar'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {esProfesional ? (
          <Link href="/turnosdoctor">
            <button className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition shadow-md">
              Ver Mi Agenda Profesional
            </button>
          </Link>
        ) : (
          <Link href="/turnospaciente">
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md">
              Ver Mis Turnos Agendados
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MyProfile;