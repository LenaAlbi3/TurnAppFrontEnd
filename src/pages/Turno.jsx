import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import api from "../services/api"; // Usamos la instancia centralizada de Axios

const Turno = () => {
  const { docId } = useParams();
  const [, setLocation] = useLocation();
  const { doctors, token, obtenerNombreEspecialidad } = useContext(AppContext);
  
  const diasDeLaSemana = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0); 
  const [slotTime, setSlotTime] = useState('');
  const [turnosOcupados, setTurnosOcupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // 1. Cargar info del profesional
  useEffect(() => {
    if (doctors.length > 0) {
      const doc = doctors.find(d => d.id === parseInt(docId));
      setDocInfo(doc);
    }
  }, [doctors, docId]);

  // 2. Traer turnos existentes del backend para calcular la disponibilidad
  useEffect(() => {
    const cargarTurnosOcupados = async () => {
      if (!docInfo) return;
      try {
        setLoading(true);
        // Llamada a tu endpoint de turnos filtrando por este profesional
        const respuesta = await api.get(`/turno?profesionalId=${docInfo.id}`);
        setTurnosOcupados(respuesta.data || []);
      } catch (error) {
        console.error("Error al traer turnos del backend:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarTurnosOcupados();
  }, [docInfo]);

  // 3. Generar la grilla de horarios aplicando las reglas de negocio
  const calcularSlotsDisponibles = () => {
    if (!docInfo) return;

    let hoy = new Date();
    let masterSlots = [];

    for (let i = 0; i < 7; i++) {
      let fechaActual = new Date(hoy);
      fechaActual.setDate(hoy.getDate() + i);
      
      const numeroDia = fechaActual.getDay();

      // Regla: Los domingos el consultorio permanece cerrado
      if (numeroDia === 0) continue; 

      // Regla: Lunes a Viernes de 8 a 18 hs. Sábados de 8 a 12 hs.
      let horaInicio = 8;
      let horaFin = (numeroDia === 6) ? 12 : 18;

      fechaActual.setHours(horaInicio, 0, 0, 0);

      // Si es el día de hoy, el primer turno disponible arranca después de la hora actual
      if (hoy.getDate() === fechaActual.getDate()) {
        if (hoy.getHours() >= horaFin) continue; // Si ya pasó la hora de cierre, saltar
        if (hoy.getHours() >= horaInicio) {
          fechaActual.setHours(hoy.getHours() + 1);
          fechaActual.setMinutes(hoy.getMinutes() > 30 ? 0 : 30);
        }
      }

      let limitesTurnosDelDia = [];

      while (fechaActual.getHours() < horaFin) {
        let tiempoFormateado = fechaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Verificamos si este turno específico ya existe en la lista del backend
        const estaOcupado = turnosOcupados.some(turno => {
          const fechaTurno = new Date(turno.fechaHora);
          return fechaTurno.getDate() === fechaActual.getDate() &&
                 fechaTurno.getMonth() === fechaActual.getMonth() &&
                 fechaTurno.getHours() === fechaActual.getHours() &&
                 fechaTurno.getMinutes() === fechaActual.getMinutes();
        });

        limitesTurnosDelDia.push({
          datetime: new Date(fechaActual),
          time: tiempoFormateado,
          disponible: !estaOcupado // Guardamos el estado de disponibilidad
        });

        // Sumamos los 30 minutos de duración por turno
        fechaActual.setMinutes(fechaActual.getMinutes() + 30);
      }

      if (limitesTurnosDelDia.length > 0) {
        masterSlots.push(limitesTurnosDelDia);
      }
    }
    setDocSlots(masterSlots);
  };

  useEffect(() => {
    if (docInfo && !loading) {
      calcularSlotsDisponibles();
    }
  }, [docInfo, turnosOcupados, loading]);

  // 4. Pasar a la página de Confirmación (Reserve Appointment en Español)
  const continuarAConfirmacion = () => {
    if (!token) {
      setMensaje({ tipo: 'error', texto: 'Debes iniciar sesión para agendar un turno.' });
      return;
    }

    if (!slotTime) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona un horario disponible.' });
      return;
    }

    // Buscamos el slot seleccionado
    const slotSeleccionado = docSlots[slotIndex].find(s => s.time === slotTime);
    
    if (!slotSeleccionado || !slotSeleccionado.disponible) {
      setMensaje({ tipo: 'error', texto: 'El horario seleccionado ya no está disponible.' });
      return;
    }

    // Guardamos la información en el SessionStorage para levantarla en la siguiente vista
    sessionStorage.setItem('reserva_pendiente', JSON.stringify({
      profesional: docInfo,
      fechaHora: slotSeleccionado.datetime.toISOString(),
      horaTexto: slotTime
    }));

    // Redirección limpia hacia la página de confirmación en español
    setLocation('/reservar-turno');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <p className="text-gray-400 mt-4 text-sm">Consultando agenda del profesional...</p>
      </div>
    );
  }

  return docInfo && (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Tarjeta del Profesional */}
      <div className='flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <div>
          <img className='bg-sky-50 w-full sm:max-w-72 rounded-lg object-cover' src={docInfo.imagen || docInfo.image || assets.doc_placeholder} alt={docInfo.nombre} />
        </div>

        <div className='flex-1 rounded-lg p-2 bg-white mt-0'>
          <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
            {docInfo.nombre} {docInfo.apellido}
            <img className='w-5' src={assets.verified_icon} alt="Verificado" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600 font-medium'>
            <p className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs">
              {docInfo.especialidadesIds && docInfo.especialidadesIds.length > 0 
                ? docInfo.especialidadesIds.map(id => obtenerNombreEspecialidad(id)).join(', ')
                : 'Profesional General'}
            </p>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-semibold text-gray-900 mt-4'>
              Sobre el profesional <img className="w-3.5" src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1 leading-relaxed'>
              {docInfo.biografia || docInfo.about || "Profesional de la salud comprometido con la atención integral de sus pacientes."}
            </p>
          </div>
        </div>
      </div>

      {/* Selector de turnos */}
      <div className='mt-8 font-medium text-gray-700 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <p className="text-lg font-semibold text-gray-800">Turnos Disponibles</p>
        
        {/* Grilla de Días */}
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 scrollbar-thin'>
          {docSlots.length > 0 && docSlots.map((item, index) => {
            if (!item[0]) return null;
            return (
              <div 
                onClick={() => { setSlotIndex(index); setSlotTime(''); }} 
                className={`text-center py-4 min-w-20 rounded-2xl cursor-pointer transition-all duration-200 ${slotIndex === index ? 'bg-sky-600 text-white shadow-md shadow-sky-200' : 'border border-gray-200 hover:bg-gray-50'}`} 
                key={index}
              >
                <p className="text-xs uppercase opacity-80">{diasDeLaSemana[item[0].datetime.getDay()]}</p>
                <p className="text-xl font-bold mt-0.5">{item[0].datetime.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* Grilla de Horarios del Día Seleccionado */}
        <div className='flex flex-wrap gap-3 w-full mt-5 pb-2'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <button 
              key={index}
              disabled={!item.disponible}
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all ${
                !item.disponible 
                  ? 'bg-gray-100 text-gray-300 border border-gray-200 line-through cursor-not-allowed'
                  : item.time === slotTime 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {item.time} hs
            </button>
          ))}
        </div>

        {mensaje.texto && (
          <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {mensaje.texto}
          </div>
        )}

        {/* Sección de acción */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {!token ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-amber-800 text-sm rounded flex-1">
              Para continuar con la reserva, debes <strong>iniciar sesión</strong>.
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {slotTime ? `Seleccionado: ${slotTime} hs.` : 'Selecciona un horario de la grilla.'}
            </p>
          )}

          <button 
            onClick={continuarAConfirmacion}
            disabled={!token || !slotTime}
            className={`text-sm font-semibold px-12 py-3.5 rounded-full transition-all tracking-wide ${
              !token || !slotTime
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-sky-600 text-white hover:bg-sky-700 shadow-md active:scale-95'
            }`}
          >
            CONTINUAR A LA RESERVA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Turno;