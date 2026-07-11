import { useState, useEffect } from "react"; 
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export default function Login() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginAuth = useAuthStore((state) => state.login);

  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/"); 
    }
  }, [isAuthenticated, setLocation]);

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
    console.log("Enviando credenciales al servidor...");

    const response = await axios.post("https://localhost:7298/api/auth/login", {
      dni: loginData.dni,
      password: loginData.password
    });

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    loginAuth({ token, user });
    setLocation("/profile");

  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error.message);
    
    alert("Usuario o contraseña incorrectos. Por favor, intenta de nuevo.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 p-8">
        <Link href="/" className="text-sm text-primary hover:underline mb-4 block">
          ← Volver al inicio
        </Link>

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
          <Link href="/register" className="text-primary font-bold hover:underline mt-1 inline-block">
            podés registrarte
          </Link>
        </div>
      </div>
    </div>
  );

} 