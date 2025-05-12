import css from "./navbar.module.css";


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

function NavBar(){
    return (
        <>
        <nav id="navbar" className={css.nav}>
        <div id="deconnexion" className={`${css.deconnexion} text`} ><p>Déconnexion</p></div>
        
        <div  id="notification"className={`${css.notification} text`} ><p>Notifications</p></div>
        <div  id="acceuil" className={`${css.acceuil} text`} ><p>Acceuil</p></div>
        <div  id="profile" className={`${css.profile} text`} ><p>Profile</p></div>
        <div  id="parametres" className={`${css.parametres} text`}  ><p>Paramètres</p></div>
        <img src="/images/logo-removebg-preview.png" alt="Logo"/>
        <div className={css.icons}>
            <div className={css.icon} onMouseOver={() => showLink('deconnexion')} onMouseOut={() => hideLink('deconnexion')}><a><span className="material-symbols-outlined">
power_settings_new
</span></a></div>
           <div className
={css.icon} onMouseOver={()=>showLink('notification')} onMouseOut={()=>hideLink('notification')}><a><span className="material-symbols-outlined">
notifications
</span></a></div> 
          
           <div className
={css.icon} onMouseOver={()=>showLink('acceuil')} onMouseOut={()=>hideLink('acceuil')}><a><span className
="material-symbols-outlined" >
            home
            </span></a></div>
               
                <div className
    ={css.icon} onMouseOver={()=>showLink('profile')} onMouseOut={()=>hideLink('profile')}><a><span className="material-symbols-outlined">
    account_circle
    </span></a></div>
                <div className
    ={css.icon} id="settings" onMouseOver={()=>showLink('parametres')} onMouseOut={()=>hideLink('parametres')}> <a><span className
    ="material-symbols-outlined" >settings</span></a></div>
        </div>
       
    </nav>
        </>
    )
}
export default NavBar;