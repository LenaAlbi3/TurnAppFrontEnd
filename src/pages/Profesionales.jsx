import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import api from "../services/api";

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [especialidadAbierta, setEspecialidadAbierta] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        const [resProfs, resEsps] = await Promise.all([
          api.get('/profesionales'),
          api.get('/especialidades')
        ]);


        const profsList = Object.values(resProfs.data);
        const espsList = Object.values(resEsps.data);

        const profsConEsp = await Promise.all(
          profsList.map(async (prof) => {
            try {
              const res = await api.get(`/profesionales/${prof.id}/especialidades`);
              const espNombres = Array.isArray(res.data) ? res.data.map(e => e.nombre) : [];
              return { ...prof, especialidadNombres: espNombres };
            } catch {
              return { ...prof, especialidadNombres: [] };
            }
          })
        );

        setProfesionales(profsConEsp);
        setEspecialidades(espsList);
      } catch (err) {
        console.error("Error al cargar:", err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const doctoresPorEspecialidad = useMemo(() => {
    const mapa = {};
    profesionales.forEach(prof => {
      prof.especialidadNombres?.forEach(nombreEsp => {
        const key = nombreEsp.toLowerCase().trim();
        if (!mapa[key]) mapa[key] = [];
        mapa[key].push(prof);
      });
    });
    return mapa;
  }, [profesionales]);

  if (loading) return <div className="text-center py-20">Cargando profesionales...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-300">Nuestros Profesionales</h1>
      <div className="space-y-4">
        {especialidades.map((esp) => {
          const key = esp.nombre.toLowerCase().trim();
          const doctores = doctoresPorEspecialidad[key] || [];
          const isOpen = especialidadAbierta === esp.nombre;

          return (
            <div key={esp.nombre} className="text-gray-600 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              <button 
                onClick={() => setEspecialidadAbierta(isOpen ? null : esp.nombre)}
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
                      <Link key={doc.id} href={`/turno/${doc.id}`} className="block p-4 border border-gray-300 rounded-lg hover:border-sky-500 transition-all">
                          <p className="font-bold text-gray-900">{doc.nombreCompleto}</p>
                          <p className="text-xs text-gray-500 mt-1">Matrícula: {doc.matricula}</p>
                          <span className="text-sky-600 text-sm font-medium mt-2 block">Ver turnos →</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-400 italic p-2">No hay profesionales en esta área.</p>
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