import css from "./NavbarPro.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

function showLink(linkId: string){
    const link=document.getElementById(linkId);
    if(link!=null){
     link.classList.add("active");
    }   
}

function hideLink(linkId: string){
    const link=document.getElementById(linkId);
    if(link!=null){
     link.classList.remove("active");
    }   
}

function NavbarPro(){
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        handleNavigation('/connexion');
    };

    return (
        <>
        <nav id="navbar" className={css.nav}>
        <div id="deconnexion" className={`${css.deconnexion} text`} ><p>deconnexion</p></div>
        <div id="notification" className={`${css.notification} text`} ><p>Notifications</p></div>
        <div id="acceuil" className={`${css.acceuil} text`} ><p>Acceuil</p></div>
        <div id="profile" className={`${css.profile} text`} ><p>Profile</p></div>
        <div id="parametres" className={`${css.parametres} text`}  ><p>Aide</p></div>
        <img src="/images/logo-removebg-preview.png" alt="Logo"/>
        
        
        <div className={css.icons}>
            <div 
                className={css.icon} 
                onMouseOver={() => showLink('deconnexion')} 
                onMouseOut={() => hideLink('deconnexion')}
                onClick={() => setShowLogoutModal(true)}
            >
                <span className="material-symbols-outlined">power_settings_new</span>
            </div>
            
            <div 
                className={css.icon} 
                onMouseOver={() => showLink('notification')} 
                onMouseOut={() => hideLink('notification')}
                onClick={() => handleNavigation('/notification')}
            >
                <span className="material-symbols-outlined">notifications</span>
            </div> 
          
            <div 
                className={css.icon} 
                onMouseOver={() => showLink('acceuil')} 
                onMouseOut={() => hideLink('acceuil')}
                onClick={() => handleNavigation('/professionnel/accueil')}
            >
                <span className="material-symbols-outlined">home</span>
            </div>
               
            <div 
                className={css.icon} 
                onMouseOver={() => showLink('profile')} 
                onMouseOut={() => hideLink('profile')}
                onClick={() => handleNavigation('/Profile')}
            >
                <span className="material-symbols-outlined">account_circle</span>
            </div>
            
            <div 
                className={css.icon} 
                id="settings" 
                onMouseOver={() => showLink('parametres')} 
                onMouseOut={() => hideLink('parametres')}
                onClick={() => handleNavigation('/aide')}
            > 
                <span className="material-symbols-outlined">settings</span>
            </div>
        </div>
       
    </nav>
    
    {showLogoutModal && (
        <LogoutModal 
            onClose={() => setShowLogoutModal(false)} 
            onConfirm={handleLogout}
        />
    )}
    </>
    )
}

export default NavbarPro;