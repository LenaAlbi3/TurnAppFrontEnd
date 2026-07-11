import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function ReservarTurno() {
  const [datosReserva, setDatosReserva] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReprogramando, setIsReprogramando] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const { isAuthenticated, token } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    // 1. Verificar si estamos reprogramando
    const turnoIdAReemplazar = sessionStorage.getItem("turnoAReprogramar");
    if (turnoIdAReemplazar) setIsReprogramando(true);

    // 2. Cargar datos de la reserva pendiente
    const reservaGuardada = sessionStorage.getItem("reserva_pendiente");
    if (!reservaGuardada) {
      setLocation("/");
      return;
    }
    setDatosReserva(JSON.parse(reservaGuardada));
  }, [isAuthenticated, setLocation]);

  const handleConfirmarReserva = async () => {
    if (!datosReserva) return;

    setIsLoading(true);
    setFeedback({ message: "", type: "" });

    try {
      // Si estamos reprogramando, incluimos el ID del anterior
      const payload = {
        profesionalId: datosReserva.profesional.id,
        fechaHora: datosReserva.fechaHora,
        estadoTurno: "Asignado",
        turnoACancelarId: sessionStorage.getItem("turnoAReprogramar") || null
      };

      await axios.post("https://localhost:7298/api/turno", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedback({ message: "¡Turno procesado con éxito!", type: "success" });
      
      // Limpieza de estados
      sessionStorage.removeItem("reserva_pendiente");
      sessionStorage.removeItem("turnoAReprogramar");
      
      setTimeout(() => setLocation("/mis-turnos-paciente"), 2000);
    } catch (error) {
      console.error("Error al consolidar:", error);
      const msg = error.response?.data?.message || "Hubo un error al guardar el turno.";
      setFeedback({ message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !datosReserva) return null;

  const fechaFormateada = new Date(datosReserva.fechaHora).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long"
  });

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar que ya tenías */}
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

            {/* Ficha Resumen (Tu diseño original) */}
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

            {/* Feedback */}
            {feedback.message && (
              <div className={`p-3 rounded-lg text-center font-semibold text-sm mb-4 ${feedback.type === "success" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                {feedback.message}
              </div>
            )}

            {/* Acciones */}
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