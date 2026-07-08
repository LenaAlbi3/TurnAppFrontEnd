import { useState } from 'react';
import { Link } from 'wouter'; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="navbar flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 bg-base-100 px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-gray-100">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/doctors">Doctores</Link></li>
            <li><Link href="/about">Sobre Nosotros</Link></li>
          <li><Link href="/contact">Contactanos</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold">Turn App</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/doctors">Doctores</Link></li>
          <li><Link href="/about">Sobre Nosotros</Link></li>
          <li><Link href="/contact">Contactanos</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {isLoggedIn ? (
          <Link href="/profile" className="btn btn-primary rounded-full px-5">Perfil</Link>
        ) : (
          <Link href="/login" className="btn btn-outline rounded-full px-5">Inicia Sesion</Link>
        )}
      </div>

    </div>
  )
}

export default Navbar