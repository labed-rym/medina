import css from "./NavbarAdmin.module.css";
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

function NavbarAdmin(){
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
                onMouseOver={() => showLink('/admin/accueil')} 
                onMouseOut={() => hideLink('/admin/accueil')}
                onClick={() => handleNavigation('/admin/accueil')}
            >
                <span className="material-symbols-outlined">home</span>
            </div>
               
            <div 
                className={css.icon} 
                onMouseOver={() => showLink('admin')} 
                onMouseOut={() => hideLink('admin')}
                onClick={() => handleNavigation('/admin')}
            >
                <span className="material-symbols-outlined">account_circle</span>
            </div>
            
            <div 
                className={css.icon} 
                id="settings" 
                onMouseOver={() => showLink('parametres')} 
                onMouseOut={() => hideLink('parametres')}
                onClick={() => handleNavigation('/aidea')}
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

export default NavbarAdmin;