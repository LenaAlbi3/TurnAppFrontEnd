import { useState } from "react";
import { Link } from "wouter";

export default function Login() {
  const [loginData, setLoginData] = useState({
    dni: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Intentando iniciar sesión con:", loginData);
      const response = await axios.post("http://link/api/login", loginData);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <h2 className="text-3xl font-bold text-center mb-8">TurnApp</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">DNI</label>
            <input
              type="text"
              name="dni"
              placeholder="Tu número de DNI"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full">
              Ingresar
            </button>
          </div>
        </form>


        <div className="mt-6 text-center text-sm">
          <p className="text-base-content/70">
            ¿No tenés una cuenta? No te preocupes,
          </p>
          <Link
            href="/register"
            className="text-primary font-bold hover:underline mt-1 inline-block"
          >
            podés registrarte
          </Link>
        </div>
      </div>
    </div>
  );
}