import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  useEffect(() => {
    const cargarDatosEstructura = async () => {
      try {
        const [resEsp, resProf] = await Promise.all([
          axios.get('https://localhost:7298/api/especialidades'),
          axios.get('https://localhost:7298/api/profesionales')
        ]);
        setEspecialidades(resEsp.data);
        setProfesionales(resProf.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
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

  const value = {
    profesionales,
    setProfesionales,
    especialidades,
    obtenerNombreEspecialidad,
    loadingGlobal
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;