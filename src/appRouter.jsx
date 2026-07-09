import { Route, Switch, Redirect } from "wouter";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctores from './pages/Doctores';
import Turno from './pages/Turno'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import TurnosDoctor from './pages/TurnosDoctor';     
import TurnosPaciente from './pages/TurnosPaciente'; 
import Page404 from "./pages/page-404";
import Footer from "./components/Footer";

const AdminPanel = lazy(() => import("./pages/AdminPanel"));
// Wrapper para proteger rutas privadas
const RutaProtegida = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Redirect to="/login" replace />;
};

const RutaAdmin = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!isAuthenticated) {
    return <Redirect to="/login" replace />;
  }

  if (!hasRole("Admin")) {
    return <Redirect to="/" replace />;
  }

  return children;
};

export default function AppRouter() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
        <Navbar />
        
        <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/doctores" component={Doctores} />
            <Route path="/turno/:docId" component={Turno} />
            <Route path="/contact" component={Contact} />

            {/* --- RUTAS PRIVADAS --- */}
            <Route path="/profile">
              <RutaProtegida>
                <MyProfile />
              </RutaProtegida>
            </Route>

            <Route path="/admin">
              <RutaAdmin>
                <Suspense fallback={<div>Cargando panel de administración...</div>}>
                  <AdminPanel />
                </Suspense>
              </RutaAdmin>
            </Route>

            <Route path="/agenda-doctor">
              <RutaProtegida>
                <TurnosDoctor />
              </RutaProtegida>
            </Route>

            <Route path="/mis-turnos-paciente">
              <RutaProtegida>
                <TurnosPaciente />
              </RutaProtegida>
            </Route>
            
            {/* --- RUTA 404 (Siempre al final) --- */}
            <Route component={Page404} />
        </Switch>
        
        <Footer />
    </div>
  );
}