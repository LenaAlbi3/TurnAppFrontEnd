import Header from "../components/Header";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">  
      <main className="container mx-auto px-4 py-8 space-y-16">
        <Header />
        <section className="py-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">¿Por qué elegir TurnApp?</h2>
            <p className="text-base-content/60 mt-2">La forma más inteligente de gestionar tu salud.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-200 p-8 rounded-2xl border border-base-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Disponibilidad 24/7</h3>
              <p className="text-sm text-base-content/70">
                Reservá, modificá o cancelá tus turnos desde cualquier dispositivo y en cualquier momento del día.
              </p>
            </div>
            <div className="bg-base-200 p-8 rounded-2xl border border-base-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 3v1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Seguridad Absoluta</h3>
              <p className="text-sm text-base-content/70">
                Tus datos personales y registros médicos viajan encriptados hacia nuestra base de datos segura.
              </p>
            </div>
            <div className="bg-base-200 p-8 rounded-2xl border border-base-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiperfiles</h3>
              <p className="text-sm text-base-content/70">
                Paneles independientes diseñados específicamente para pacientes y especialistas de la salud.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}