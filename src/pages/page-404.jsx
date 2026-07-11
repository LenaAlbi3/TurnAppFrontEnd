import { Link } from "wouter";

export default function Page404() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Icono decorativo usando los colores de tu tema */}
      <div className="text-primary mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 opacity-80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-4 tracking-tight">
        Página no encontrada
      </h1>
      
      <p className="text-lg text-base-content/60 mb-8 max-w-sm">
        Lo sentimos, no pudimos encontrar la página que estás buscando. Por favor, volvé al inicio.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/" 
          className="btn btn-primary rounded-full px-8 shadow-lg hover:scale-105 transition-transform"
        >
          Volver a Inicio
        </Link>
      </div>
    </div>
  );
}