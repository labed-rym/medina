import css from "./NavbarVisiteur.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function NavbarVisiteur(){
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
        <div id="deconnexion" className={`${css.deconnexion} text`} ><p>Déconnexion</p></div>
        
        <div id="notification" className={`${css.notification} text`} ><p>Notifications</p></div>
        <div id="acceuil" className={`${css.acceuil} text`} ><p>Acceuil</p></div>
        <div id="profile" className={`${css.profile} text`} ><p>Profile</p></div>
        <div id="parametres" className={`${css.parametres} text`}  ><p>Aide</p></div>
        <img src="/images/logo-removebg-preview.png" alt="Logo"/>
        <div className={css.visiteur}>
            <div className={css.pdp}>
                <img src="/images/man-and-woman-empty-avatars-set-default-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-illustration-vector.jpg" alt="profile-picture" />
            </div>
            <p className={css.userName}>@userName</p>
        </div>
        
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
                onMouseOver={() => showLink('acceuil')} 
                onMouseOut={() => hideLink('acceuil')}
                onClick={() => handleNavigation('/visiteur/accueil')}
            >
                <span className="material-symbols-outlined">home</span>
            </div>
                
            <div 
                className={css.icon} 
                id="settings" 
                onMouseOver={() => showLink('parametres')} 
                onMouseOut={() => hideLink('parametres')}
                onClick={() => handleNavigation('/aidee')}
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

export default NavbarVisiteur;