import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'wouter';
import { AppContext } from '../context/AppContext';

const Doctores = () => {
  const { doctors, especialidades, obtenerNombreEspecialidad } = useContext(AppContext);
  const [especialidadFiltro, setEspecialidadFiltro] = useState('Todas');
  const [doctoresFiltrados, setDoctoresFiltrados] = useState([]);

  useEffect(() => {
    if (especialidadFiltro === 'Todas') {
      setDoctoresFiltrados(doctors);
    } else {
      const filtroId = especialidades.find(e => e.nombre === especialidadFiltro)?.id;
      setDoctoresFiltrados(doctors.filter(doc => doc.especialidadesIds.includes(filtroId)));
    }
  }, [especialidadFiltro, doctors, especialidades]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Profesionales</h1>

      {/* Menú de Especialidades */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button 
          onClick={() => setEspecialidadFiltro('Todas')}
          className={`px-4 py-2 rounded-full border ${especialidadFiltro === 'Todas' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white hover:bg-gray-50'}`}
        >
          Todas
        </button>
        {especialidades.map((esp) => (
          <button
            key={esp.id}
            onClick={() => setEspecialidadFiltro(esp.nombre)}
            className={`px-4 py-2 rounded-full border ${especialidadFiltro === esp.nombre ? 'bg-sky-600 text-white border-sky-600' : 'bg-white hover:bg-gray-50'}`}
          >
            {esp.nombre}
          </button>
        ))}
      </div>

      {doctoresFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No hay profesionales disponibles para esta especialidad.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctoresFiltrados.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <img 
                src={doc.imagen || "/placeholder-doctor.png"} 
                alt={doc.nombre} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold text-gray-900">{doc.nombre} {doc.apellido}</h2>
              <div className="text-sm text-gray-500 mt-1 mb-4">
                {doc.especialidadesIds.map(id => obtenerNombreEspecialidad(id)).join(', ')}
              </div>
              <Link to={`/turno/${doc.id}`}>
                <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors">
                  Ver Disponibilidad
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctores;