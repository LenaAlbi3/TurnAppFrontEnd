import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import api from "../services/api";

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [especialidadAbierta, setEspecialidadAbierta] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Ahora el endpoint /profesionales ya trae el campo 'especialidadesIds'
        const [resProfs, resEsps] = await Promise.all([
          api.get('/profesionales'),
          api.get('/especialidades')
        ]);
        
        setProfesionales(Array.isArray(resProfs.data) ? resProfs.data : []);
        setEspecialidades(Array.isArray(resEsps.data) ? resEsps.data : []);
      } catch (err) {
        console.error("Error al cargar:", err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Función para obtener doctores de una especialidad usando el nuevo campo 'especialidadesIds'
  const obtenerDoctoresPorEspecialidad = (espId) => {
    return profesionales.filter(prof => 
      prof.especialidadesIds && prof.especialidadesIds.includes(espId)
    );
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Cargando profesionales...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-300 mb-8">Nuestros Profesionales</h1>

      <div className="space-y-4">
        {especialidades.map((esp) => {
          const doctores = obtenerDoctoresPorEspecialidad(esp.id);
          const isOpen = especialidadAbierta === esp.id;

          return (
            <div key={esp.id} className="border border-gray-200 text-gray-600 rounded-lg bg-white shadow-sm overflow-hidden">
              <button 
                onClick={() => setEspecialidadAbierta(isOpen ? null : esp.id)}
                className="w-full p-4 text-left font-bold bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                {esp.nombre}
                <span className="text-xs bg-sky-600 text-white px-3 py-1 rounded-full">
                  {doctores.length} disponible{doctores.length !== 1 ? 's' : ''}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {doctores.length > 0 ? (
                    doctores.map(doc => (
                      <Link key={doc.id} href={`/turno/${doc.id}`}>
                        <a className="block p-4 border border-gray-100 rounded-lg hover:border-sky-500 hover:shadow-md transition-all">
                          <p className="font-bold text-gray-900">{doc.nombreCompleto}</p>
                          <p className="text-xs text-gray-500 mt-1">Matrícula: {doc.matricula}</p>
                          <span className="text-sky-600 text-sm font-medium mt-2 block">Ver turnos →</span>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-400 italic p-2">No hay profesionales registrados en esta especialidad.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profesionales;