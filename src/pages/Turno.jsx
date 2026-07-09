import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';

const Turno = () => {
  const { docId } = useParams();
  const [, setLocation] = useLocation();
  const { doctors, token, obtenerNombreEspecialidad } = useContext(AppContext);
  
  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0); 
  const [slotTime, setSlotTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const fetchDocInfo = async () => {
    const doc = doctors.find(doc => doc.id === parseInt(docId));
    setDocInfo(doc);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();
    let masterSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      masterSlots.push(timeSlots);
    }
    setDocSlots(masterSlots);
  };

  useEffect(() => {
    if (doctors.length > 0) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  const reservarTurno = async () => {
    if (!token) {
      setMensaje({ tipo: 'error', texto: 'Debes iniciar sesión para agendar un turno.' });
      return;
    }

    if (!slotTime) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona un horario disponible.' });
      return;
    }

    try {
      setBookingLoading(true);
      setMensaje({ tipo: '', texto: '' });

      const fechaSeleccionada = new Date(docSlots[slotIndex][0].datetime);
      const [horas, minutos] = slotTime.split(':');
      fechaSeleccionada.setHours(parseInt(horas), parseInt(minutos), 0, 0);

      const payload = {
        profesionalId: docInfo.id,
        fechaHora: fechaSeleccionada.toISOString(), 
        estadoTurno: "Asignado" 
      };

      await axios.post('https://localhost:7298/api/turno', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMensaje({ tipo: 'success', texto: '¡Turno reservado con éxito! Redirigiendo...' });
      
      setTimeout(() => {
        setLocation('/mis-turnos');
      }, 2500);

    } catch (error) {
      console.error("Error al reservar el turno:", error);
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.message || 'Error en el servidor al procesar la reserva.' 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return docInfo && (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className='flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <div>
          <img className='bg-sky-50 w-full sm:max-w-72 rounded-lg object-cover' src={docInfo.image || assets.doc_placeholder} alt={docInfo.nombre} />
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
                : 'Médico General'}
            </p>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-semibold text-gray-900 mt-4'>
              Sobre el profesional <img className="w-3.5" src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1 leading-relaxed'>
              {docInfo.biografia || docInfo.about || "Profesional de la salud comprometido con la atención integral."}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-8 font-medium text-gray-700 bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <p className="text-lg font-semibold text-gray-800">Turnos disponibles</p>
        
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 scrollbar-thin'>
          {docSlots.length > 0 && docSlots.map((item, index) => {
            if (!item[0]) return null;
            return (
              <div 
                onClick={() => { setSlotIndex(index); setSlotTime(''); }} 
                className={`text-center py-4 min-w-20 rounded-2xl cursor-pointer transition-all duration-200 ${slotIndex === index ? 'bg-sky-600 text-white shadow-md shadow-sky-200' : 'border border-gray-200 hover:bg-gray-50'}`} 
                key={index}
              >
                <p className="text-xs uppercase opacity-80">{daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className="text-xl font-bold mt-0.5">{item[0].datetime.getDate()}</p>
              </div>
            );
          })}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-auto mt-5 pb-2'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-medium flex-shrink-0 px-5 py-2.5 rounded-full cursor-pointer transition-colors ${item.time === slotTime ? 'bg-sky-600 text-white' : 'text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100'}`} 
              key={index}
            >
              {item.time.toLowerCase()} hs
            </p>
          ))}
        </div>

        {mensaje.texto && (
          <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${mensaje.tipo === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {!token ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-amber-800 text-sm rounded flex-1">
              Para reservar un turno, debes <strong>iniciar sesión</strong>.
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {slotTime ? `Horario seleccionado: ${slotTime} hs.` : 'Selecciona un horario arriba.'}
            </p>
          )}

          <button 
            onClick={reservarTurno}
            disabled={!token || !slotTime || bookingLoading}
            className={`text-sm font-semibold px-14 py-3.5 rounded-full transition-all tracking-wide ${
              !token || !slotTime || bookingLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-100 active:scale-95'
            }`}
          >
            {bookingLoading ? 'PROCESANDO...' : 'RESERVAR TURNO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Turno;