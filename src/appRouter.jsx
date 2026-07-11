import { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "wouter";
import { useAuthStore } from "./store/authStore"; // Asegura que este import exista

// Importaciones estáticas para carga inmediata
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profesionales from './pages/Profesionales';
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import Register from './pages/Register';
import RegistroPaciente from "./pages/registerPatient";
import Login from './pages/Login';
import MyProfile from "./pages/MyProfile";
import Turno from './pages/Turno'; 
import ReservarTurno from "./pages/ReservaTurno";
import TurnosDoctor from './pages/TurnosDoctor';     
import TurnosPaciente from './pages/TurnosPaciente'; 
import Page404 from "./pages/page-404";

// Carga diferida de páginas pesadas o administrativas
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

// --- WRAPPERS DE SEGURIDAD (Optimizados) ---
const RutaProtegida = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Redirect to="/login" replace />;
};

const RutaAdmin = ({ children }) => {
  const { isAuthenticated, hasRole } = useAuthStore();
  if (!isAuthenticated) return <Redirect to="/login" replace />;
  return hasRole("Admin") ? children : <Redirect to="/" replace />;
};

// --- COMPONENTE LOADING PARA SUSPENSE ---
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>
);

export default function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mx-4 sm:mx-[10%]">
        <Switch>
          {/* Rutas Públicas */}
          <Route path="/" component={Home} />
          <Route path="/profesionales" component={Profesionales} />
          <Route path="/sobre-nosotros" component={SobreNosotros} />
          <Route path="/contacto" component={Contacto} />
          <Route path="/register" component={Register} />
          <Route path="/register-patient" component={RegistroPaciente} />
          <Route path="/login" component={Login} />
          <Route path="/turno/:docId" component={Turno} />

          {/* Rutas Privadas (Protegidas) */}
          <Route path="/reservar-turno">
            <RutaProtegida><ReservarTurno /></RutaProtegida>
          </Route>
          <Route path="/profile">
            <RutaProtegida><MyProfile /></RutaProtegida>
          </Route>
          <Route path="/agenda-doctor">
            <RutaProtegida><TurnosDoctor /></RutaProtegida>
          </Route>
          <Route path="/mis-turnos-paciente">
            <RutaProtegida><TurnosPaciente /></RutaProtegida>
          </Route>

          {/* Ruta Administrativa (Lazy) */}
          <Route path="/admin">
            <RutaAdmin>
              <Suspense fallback={<LoadingFallback />}>
                <AdminPanel />
              </Suspense>
            </RutaAdmin>
          </Route>
            
          {/* Ruta 404 (Wildcard) */}
          <Route component={Page404} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}