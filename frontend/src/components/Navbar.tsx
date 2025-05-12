import css from "./Navbar.module.css";
function openPopup() {
   const popup= document.getElementById("popup");
   const popupOverlay= document.getElementById("popupOverlay");
    if(popup!=null){
        popup.style.display = "block";
    }
    if(popupOverlay!=null){
        popupOverlay.style.display = "block";
    }
}

function closePopup() {
    const popup= document.getElementById("popup");
   const popupOverlay= document.getElementById("popupOverlay");
    if(popup!=null){
        popup.style.display = "none";
    }
    if(popupOverlay!=null){
        popupOverlay.style.display = "none";
    }
}



function Navbar(){
   /* ()=>{
        const btn=document.getElementById("contactUs");
    if (btn!=null){
        btn.addEventListener("click", function(event) {
            event.preventDefault();
            openPopup();
        });
    }}*/
    return (

        <>
        
        <nav id="navbar" className={css.nav}>
        <img src="../public/images/logo-removebg-preview.png" alt="Logo"/>
        <div id="contactUs" className={css.contactUs} onClick={openPopup}>
           <a >Contactez Nous</a>
        </div>
    </nav>
    
<div className="popupOverlay" id="popupOverlay"></div>


<div className="popup" id="popup">
    <span className="closeBtn" onClick={closePopup}>&times;</span>
    <h2>Contactez Nous</h2>
    <p className="contactInfo">📧 E-mail : support@medina.com<br/>📞 Téléphone : +213 5 14 55 34 59</p>
    <p className="assistance">Nous restons à votre disposition pour toute assistance !</p>
</div>
        </>
    )
}
export default Navbar;