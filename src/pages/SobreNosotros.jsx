import { Link } from "wouter";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      <main className="grow flex flex-col items-center pt-12 pb-20 px-4 sm:px-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Qué es <span className="text-primary">TurnApp?</span>
            </h1>
            <p className="text-lg text-white/70 font-medium">
              Llevando calidad, organización e innovación a la gestión médica.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Quiénes somos?
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed text-lg">
                <p>
                  Simple: un equipo de desarrolladores y analistas de sistemas
                  con el objetivo de llevar lo mejor de la tecnología a la
                  administración de consultorios y clínicas.
                </p>
                <p>
                  ¿Nuestro objetivo? Seguir creciendo, mejorando y expandiendo
                  la plataforma para proveerte con una herramienta ágil, robusta
                  y segura... sin olvidarnos de la experiencia del paciente.
                </p>
                <p>
                  Nuestro compromiso sobrepasa el de simplemente &quot;entregar
                  un software&quot;. Queremos construir una solución integral
                  que optimice el tiempo de los profesionales y facilite el
                  acceso a la salud.
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                <Link
                  href="/register"
                  className="btn bg-primary hover:bg-orange-600 text-white border-none text-base px-8"
                >
                  Registrarse
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="bg-[#151226] rounded-2xl p-8 sm:p-10 shadow-2xl border border-purple-500/10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-500 to-yellow-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10 text-[#151226]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-wide">
                  TurnApp
                </h3>
                <p className="text-white/50 text-sm mt-1">Desde 2026</p>

                <div className="flex flex-row w-full justify-around mt-10 pt-8 border-t border-white/5">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold bg-linear-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                      +10k
                    </span>
                    <span className="text-sm text-white/60 mt-2 font-medium text-center">
                      turnos gestionados
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold bg-linear-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                      24/7
                    </span>
                    <span className="text-sm text-white/60 mt-2 font-medium text-center">
                      soporte completo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
