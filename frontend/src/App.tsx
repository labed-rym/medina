/*import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Connexion from "./modules/connexion/connexion"
import HomeVisiteur from "./modules/visiteur/accueil/accueil";
import HomeProfessionnel from "./modules/professionnel/accueil/accueil";
import Profile from "./modules/profile/profile";
import Navbar from "./components/Navbar";

import InscriptionProfessionnel from "./modules/professionnel/inscreption/Form";
import Search from "./modules/recherche/recherche";
import './App.css';

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userType: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token && userType) {
      setAuthState({ isAuthenticated: true, userType });
    }
  }, []);

  const handleLoginSuccess = (userType: string) => {
    localStorage.setItem('userType', userType);
    setAuthState({ isAuthenticated: true, userType });
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            authState.userType === 'professionnel' ? 
              <HomeProfessionnel /> : 
              <HomeVisiteur />
          } />
          
          <Route
  path={connexionRoute.path}
  element={<Connexion handleLoginSuccess={handleLoginSuccess} />}
/>

              <Route path="/inscription" element={
              
                <InscriptionVisiteur />
              } />


              <Route path="/inscription-professionnel" element={
              
                <InscriptionProfessionnel />
                
              } />

              <Route path="/recherche" element={<Search />} />

              <Route path="/profile" element={
              authState.isAuthenticated ? 
                <Profile /> : 
                <Navigate to="/connexion" replace />
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
      </main>
    </div>
  );
};
export default App;*/
import React, { Suspense } from 'react';
import NavbarVisiteur from "./components/NavbarVisiteur";
import NavbarPro from "./components/NavbarPro";
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import './App.css';
const ProfessionnelForm = React.lazy(() => import('./modules/professionnel/inscreption/Form'));
const InscriptionVisiteur = React.lazy(()=>import('./modules/visiteur/inscreption/Form'));
const Connexion = React.lazy(() => import('./modules/connexion/Form'));
const ProfileApp = React.lazy(() => import('./modules/profile/Profile'));
import ResetPasswordForm from './modules/connexion/ResetPasswordForm';
import ValidationForm from './modules/connexion/validation';
import VerificationForm from './modules/connexion/verification';
import Home from './modules/professionnel/accueil/Home';
import Homee from './modules/visiteur/accueil/Home';
import { BrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './modules/page/LandingPage';
import Notif from './modules/Notification/Notification';
import VoirPlusPage from './modules/Notification/VoirPlus';
import RechercheTout from './modules/recherche/RechercheTout';
import Editeur from './modules/Editor/Editor (5)';
import Admin from './modules/admin/AdminDashboard';
import Help from './modules/Help/Help';
import NavbarAdmin from './components/NavbarAdmin';
import RecherchePeriode from './modules/rechercheparPeriode/rechperiode'
import RechercheWilaya from './modules/RechercheWilaya/RechercheWilaya'
import RechercheCategorie from './modules/RechercheCategorie/Recherchecategorie';
import Hoome from './modules/admin/accueil/Home'
import Projet from './modules/projet/Projet'
function App() {
  return (
    <div className='body'>

      <main  id="mainc" className="main-content">
        
          <Routes>
            <Route path="/projet/:documentId" element={<Projet/>}/>
            <Route path="/" element={<Navigate to="/accueil" />} />
            <Route path="notification" element={<Notif/>}/>
            <Route path="/professionnel/accueil" element={ <><NavbarPro/><Home/></>} />
            <Route path="/admin/accueil" element={ <><NavbarAdmin/><Hoome/></>} />
            <Route path="/visiteur/accueil" element={ <><NavbarVisiteur/><Homee/></>} />
            <Route 
              path="/inscription-professionnelle" 
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <Navbar/><ProfessionnelForm />
                </Suspense>
              } 
            />
            <Route 
              path="/inscription-visiteur" 
              element={
                <Suspense fallback={<div>Chargement...</div>}>
                  <Navbar/><InscriptionVisiteur />
                </Suspense>
              } 
            />
            <Route path="/verification" element={<><Navbar/><VerificationForm /></>} />
            <Route path="/validation/:token" element={<><Navbar/><ValidationForm /></>} />
            <Route path="/reset-password" element={<><Navbar/><ResetPasswordForm /></>} />
            <Route path="/connexion" element={<><Navbar/>< Connexion/></>} />
            <Route path="/page" element={<><Navbar/><LandingPage/></>} />
           
            <Route path="/recherche1" element={<><NavbarPro/><RechercheTout/></>} />
            <Route path="/recherche" element={<><NavbarVisiteur/><RechercheTout/></>} />
            <Route path="/recherchea" element={<><NavbarAdmin/><RechercheTout/></>} />
            <Route path="/recherche/periode1" element={<><NavbarPro/><RecherchePeriode/></>} />
            <Route path="/recherche/periodea" element={<><NavbarAdmin/><RecherchePeriode/></>} />
            <Route path="/recherche/periode" element={<><NavbarVisiteur/><RecherchePeriode/></>} />
            <Route path="/recherche/Wilaya1" element={<><NavbarPro/><RechercheWilaya/></>} />
            <Route path="/recherche/Wilayaa" element={<><NavbarAdmin/><RechercheWilaya/></>} />
            <Route path="/recherche/Wilaya" element={<><NavbarVisiteur/><RechercheWilaya/></>} />
            <Route path="/recherche/Categorie" element={<><NavbarVisiteur/><RechercheCategorie/></>} />
            <Route path="/recherche/Categorie1" element={<><NavbarPro/><RechercheCategorie/></>} />
            <Route path="/recherche/Categoriea" element={<><NavbarAdmin/><RechercheCategorie/></>} />
            <Route path="/profile" element={<><NavbarPro/><ProfileApp /></>} />
            <Route path="/editeur/:documentId" element={<><NavbarPro/><Editeur documentId=""/></>} />
            <Route path="/admin" element={<><NavbarAdmin/><Admin/></>} />
            <Route path="/aide" element={<><NavbarPro/><Help/></>} />
            <Route path="/aidee" element={<><NavbarVisiteur/><Help/></>} />
            <Route path="/aidea" element={<><NavbarAdmin/><Help/></>} />      

          </Routes>
        
      </main>
    
    
    </div>
  );
}

export default App;



