import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const API_URLS = {
    especialidades: 'https://localhost:7298/api/especialidad',
    profesionales: 'https://localhost:7298/api/profesional' 
  };

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  });
  
  const [doctors, setDoctors] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }, [token]);

  useEffect(() => {
    const cargarDatosEstructura = async () => {
      try {
        const [resEspecialidades, resProfesionales] = await Promise.all([
          axios.get(API_URLS.especialidades),
          axios.get(API_URLS.profesionales)
        ]);

        setEspecialidades(resEspecialidades.data);
        setDoctors(resProfesionales.data);
      } catch (error) {
        console.error("Error cargando diccionarios de datos estructurales:", error);
      } finally {
        setLoadingGlobal(false);
      }
    };

    cargarDatosEstructura();
  }, []);

  const obtenerNombreEspecialidad = (id) => {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : "General";
  };

  const logout = () => {
    setToken(null);
    setUsuarioLogueado(null);
  };

  const value = {
    doctors,
    setDoctors,
    especialidades,
    obtenerNombreEspecialidad,
    token,
    setToken,
    usuarioLogueado,
    setUsuarioLogueado,
    logout,
    loadingGlobal
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>  
  );
};

export default AppContextProvider;