import { Route, Switch, Redirect } from "wouter";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import Page404 from "./pages/page-404";
import Footer from "./components/Footer";

import { useAuthStore } from "./store/authStore"; 
// import { evaluateRoles } from "./utils/evaluate-roles"; // Descomenta si usas roles

const RutaProtegida = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    // Si no está logueado, lo mandamos a la página de login
    return <Redirect to="/login" replace />;
  }
  
  return children;
};

export default function AppRouter() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
        <Navbar />
        
        <Switch>
            <Route path="/">
                <main className="container-fluid">
                    <Home />
                </main>
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            
            <Route path="/doctors" component={Doctors} />
            <Route path="/doctors/:speciality" component={Doctors} />
            <Route path="/contact" component={Contact} />

            
            {/* --- RUTAS PRIVADAS --- */}
            {/* Solo usuarios autenticados pueden entrar aquí */}
            <Route path="/profile">
              <RutaProtegida>
                <MyProfile />
              </RutaProtegida>
            </Route>


            {/* Ejemplo si quisieras una ruta solo para Administradores: */}
            {/* 
            <PrivateRoute path="/dashboard" allowedRoles={["Admin", "Mod"]}>
                <Dashboard />
            </PrivateRoute> 
            */}
            
            {/* --- RUTA 404 (Siempre al final) --- */}
            <Route>
                <Page404 />
            </Route>
      </Switch>
      
      <Footer />
    </div>
  );
}