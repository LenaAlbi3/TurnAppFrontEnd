import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function ReservarTurno() {
  const [datosReserva, setDatosReserva] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReprogramando, setIsReprogramando] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const { token, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) {
      setLocation("/login");
      return;
    }

    const turnoIdAReemplazar = sessionStorage.getItem("turnoAReprogramar");
    if (turnoIdAReemplazar) setIsReprogramando(true);

    const reservaGuardada = sessionStorage.getItem("reserva_pendiente");
    if (!reservaGuardada) {
      setLocation("/");
      return;
    }
    
    setDatosReserva(JSON.parse(reservaGuardada));
  }, [token, setLocation]);

  const handleConfirmarReserva = async () => {
    if (!datosReserva || !user) return;

    if (datosReserva.estado && datosReserva.estado !== "D") {
      setFeedback({ message: "Este turno ya no se encuentra disponible.", type: "error" });
      return;
    }

    setIsLoading(true);
    setFeedback({ message: "", type: "" });

    try {
      const turnoId = datosReserva.id;
      const pacienteId = user.id;

      if (!turnoId) {
        throw new Error("ID de turno no encontrado.");
      }

      await api.put(`/turnos/${turnoId}/paciente/${pacienteId}`);

      setFeedback({ message: "¡Turno reservado con éxito!", type: "success" });
      
      sessionStorage.removeItem("reserva_pendiente");
      sessionStorage.removeItem("turnoAReprogramar");
      
      setTimeout(() => setLocation("/mis-turnos-paciente"), 2000);
    } catch (error) {
      console.error("Error al asignar el turno:", error.response?.data || error);

      const errorMsg = error.response?.data?.message || 
                       error.response?.data || 
                       "Error al asignar el turno. Asegúrate de tener permisos.";
      setFeedback({ message: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !datosReserva) return null;

  const fechaFormateada = new Date(datosReserva.fechaHora).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long"
  });

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="grow flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-2 border-b pb-2 text-primary">
              {isReprogramando ? "Confirmar Reprogramación" : "Confirmar Reserva"}
            </h2>
            
            <p className="text-sm text-base-content/70 mb-4">
              {isReprogramando 
                ? "Estás cambiando tu turno. Esta acción cancelará el anterior automáticamente." 
                : "Por favor, revisá los detalles de tu cita."}
            </p>

            <div className="bg-base-200 p-4 rounded-xl space-y-3 mb-6">
              <div>
                <span className="text-xs font-bold uppercase text-base-content/50">Profesional</span>
                <p className="text-lg font-semibold">{datosReserva.profesional.nombre} {datosReserva.profesional.apellido}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-base-300">
                <div>
                  <span className="text-xs font-bold uppercase text-base-content/50">Fecha</span>
                  <p className="font-medium capitalize">{fechaFormateada}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-base-content/50">Horario</span>
                  <p className="font-medium">{datosReserva.horaTexto} hs</p>
                </div>
              </div>
            </div>

            {feedback.message && (
              <div className={`p-3 rounded-lg text-center font-semibold text-sm mb-4 ${feedback.type === "success" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                {feedback.message}
              </div>
            )}

            <div className="card-actions flex flex-col gap-2">
              <button onClick={handleConfirmarReserva} className="btn btn-primary w-full text-lg" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner"></span> : "Confirmar Turno"}
              </button>
              <button 
                onClick={() => setLocation(`/turno/${datosReserva.profesional.id}`)} 
                className="btn btn-ghost btn-sm w-full"
                disabled={isLoading}
              >
                Cambiar fecha u horario
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}