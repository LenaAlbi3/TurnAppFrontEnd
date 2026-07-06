import React from  'react' 
import { Route, Link, Switch } from "wouter";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';

function App() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
        <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/doctors" component={Doctors} />
        <Route path="/doctors/:speciality" component={Doctors} />
        <Route path="/login" component={Login} />
        <Route path="/my-profile" component={MyProfile} />
        <Route path="/my-appointments" component={MyAppointments} />
      </Switch>
    </div>
  );
}

export default App;

