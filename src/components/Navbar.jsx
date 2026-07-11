import { Link, useRoute } from "wouter";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { isAuthenticated, logout, user, hasRole } = useAuthStore();

  const [isInicio] = useRoute("/");
  const [isProfesionales] = useRoute("/profesionales");
  const [isAbout] = useRoute("/sobre-nosotros");
  const [isContacto] = useRoute("/contacto");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 sm:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/profesionales">Profesionales</Link></li>
            <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <div className="divider my-1"></div>
            {isAuthenticated ? (
              <>
                <li><Link href="/profile">Mi Perfil</Link></li>
                <li><button onClick={handleLogout} className="text-error">Cerrar Sesión</button></li>
              </>
            ) : (
              <>
                <li><Link href="/login">Iniciar Sesión</Link></li>
                <li><Link href="/register">Registrarse</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="text-xl font-bold">TurnApp</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          <li><Link href="/" className={isInicio ? "text-primary" : ""}>Inicio</Link></li>
          <li><Link href="/profesionales" className={isProfesionales ? "text-primary" : ""}>Profesionales</Link></li>
          <li><Link href="/sobre-nosotros" className={isAbout ? "text-primary" : ""}>Sobre Nosotros</Link></li>
          <li><Link href="/contacto" className={isContacto ? "text-primary" : ""}>Contacto</Link></li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {user?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-lg border border-base-200">
              <li className="menu-title px-4 py-2">Hola, {user?.nombre || "Usuario"}</li>
              <li><Link href="/profile">Mi Perfil</Link></li>
              <li><Link href="/mis-turnos-paciente">Mis Turnos</Link></li>
              {(hasRole("Prof") || hasRole("Admin")) && <div className="divider my-1"></div>}
              {hasRole("Prof") && <li><Link href="/agenda-doctor">Agenda Profesional</Link></li>}
              {hasRole("Admin") && <li><Link href="/admin" className="text-error">Panel Admin</Link></li>}
              <li><button onClick={handleLogout} className="text-error mt-2">Cerrar Sesión</button></li>
            </ul>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-md rounded-full">Ingresar</Link>
            <Link href="/register" className="btn btn-primary btn-md rounded-full px-6">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
}