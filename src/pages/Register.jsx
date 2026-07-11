import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { ROLES } from "../constants/roles";

const schema = z.object({
  dni: z.string().min(7, "El DNI debe tener al menos 7 números"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(8, "La confirmación debe tener al menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function Registro() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [, setLocation] = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://localhost:7298/api/auth/register", {
        Dni: data.dni,
        Email: data.email,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
        Rol: ROLES.PACIENTE,
      });

      // Si el backend devuelve un token al registrar, lo guardamos en el store global
      if (response.data.token) {
        setAuth(response.data.token);
      }

      setLocation("/register-patient");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.response?.data?.message || "Ocurrió un error al registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo DNI */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">DNI</span></label>
            <input type="text" className={`input input-bordered w-full ${errors.dni ? "input-error" : ""}`} {...register("dni")} />
            {errors.dni && <span className="text-error text-xs mt-1">{errors.dni.message}</span>}
          </div>

          {/* Campo Email */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Email</span></label>
            <input type="email" className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`} {...register("email")} />
            {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
          </div>

          {/* Campo Password (Reutilizando la lógica de visibilidad) */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Contraseña</span></label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="input input-bordered w-full pr-10" {...register("password")} />
              <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
          </div>

          {/* Campo Confirmar */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Confirmar Contraseña</span></label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} className="input input-bordered w-full pr-10" {...register("confirmPassword")} />
              <button type="button" className="absolute right-3 top-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-error text-xs mt-1">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-primary hover:underline font-semibold">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}