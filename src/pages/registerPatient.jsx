import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useState } from "react";
import { createPaciente } from "../services/pacientes";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
  apellido: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
  fechaNacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ingresá una fecha válida",
  }),
});

export default function RegistroPaciente() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore(); 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await createPaciente({
        Nombre: data.nombre,
        Apellido: data.apellido,
        FechaNacimiento: data.fechaNacimiento,
      });

      setLocation("/"); 
    } catch (error) {
      console.error("Error al completar el registro:", error);
      alert(error.response?.data?.message || "Hubo un error al guardar tu perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-4">Completá tu perfil</h2>
        <p className="text-center text-sm text-base-content/70 mb-6">
          Necesitamos tus datos para habilitar el sistema de turnos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Nombre */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Nombre</span></label>
            <input type="text" className={`input input-bordered w-full ${errors.nombre ? "input-error" : ""}`} {...register("nombre")} disabled={isLoading} />
            {errors.nombre && <span className="text-error text-xs mt-1">{errors.nombre.message}</span>}
          </div>

          {/* Campo Apellido */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Apellido</span></label>
            <input type="text" className={`input input-bordered w-full ${errors.apellido ? "input-error" : ""}`} {...register("apellido")} disabled={isLoading} />
            {errors.apellido && <span className="text-error text-xs mt-1">{errors.apellido.message}</span>}
          </div>

          {/* Campo Fecha */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Fecha de nacimiento</span></label>
            <input type="date" className={`input input-bordered w-full ${errors.fechaNacimiento ? "input-error" : ""}`} {...register("fechaNacimiento")} disabled={isLoading} />
            {errors.fechaNacimiento && <span className="text-error text-xs mt-1">{errors.fechaNacimiento.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : "Finalizar registro"}
          </button>
        </form>
      </div>
    </div>
  );
}