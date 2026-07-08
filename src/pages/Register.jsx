import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.coerce.number({
    invalid_type_error: "El DNI debe ser un número",
    required_error: "El DNI es requerido",
  })
  .int({ message: "El DNI no puede tener decimales" })
  .positive({ message: "El DNI no puede ser negativo" })
  .min(1000000, { message: "DNI inválido" })
  .max(99999999, { message: "DNI inválido" }),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Datos validados listos para enviar:", data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className={`input input-bordered w-full ${errors.nombre ? "input-error" : ""}`}
              {...register("nombre")}
            />
            {errors.nombre && (
              <span className="text-error text-xs ml-1">
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">Apellido</label>
            <input
              type="text"
              placeholder="Tu apellido"
              className={`input input-bordered w-full ${errors.apellido ? "input-error" : ""}`}
              {...register("apellido")}
            />
            {errors.apellido && (
              <span className="text-error text-xs ml-1">
                {errors.apellido.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">DNI</label>
            <input
              type="number"
              placeholder="Sin puntos ni espacios"
              className={`input input-bordered w-full ${errors.dni ? "input-error" : ""}`}
              {...register("dni", { valueAsNumber: true })} // <-- AQUÍ ESTÁ LA SOLUCIÓN
            />
            {errors.dni && (
              <span className="text-error text-xs ml-1">
                {errors.dni.message}
              </span>
            )}
</div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">Email</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-error text-xs ml-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-error text-xs ml-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full">
              Registrarse
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}