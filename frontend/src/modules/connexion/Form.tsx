"use client"

import type React from "react"

import style from "./Form.module.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Form() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/auth/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe: motDePasse,
        }),
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Connexion réussie :", data)

        // Vérifier la structure exacte de la réponse
        console.log("Structure de la réponse:", JSON.stringify(data, null, 2))

        // Stocker les données importantes dans le localStorage
        if (data.token) {
          localStorage.setItem("token", data.token)
        }

        // Vérifier si data.user existe et sa structure
        let userRole = "";
        
        if (data.user) {
          // Stocker l'ID de l'utilisateur - vérifier la clé exacte
          if (data.user.id) {
            localStorage.setItem("userId", data.user.id.toString())
          } else if (data.user.utilisateur_id) {
            // Alternative si l'ID est sous un nom différent
            localStorage.setItem("userId", data.user.utilisateur_id.toString())
          }

          // Stocker l'email de l'utilisateur
          if (data.user.email) {
            localStorage.setItem("userEmail", data.user.email)
          }

          // Stocker le rôle de l'utilisateur si disponible
          if (data.user.type) {
            localStorage.setItem("userRole", data.user.type)
            userRole = data.user.type;
            console.log("Rôle utilisateur stocké:", data.user.type)
          }

          // Stocker le nom et prénom si disponibles
          if (data.user.nom) {
            localStorage.setItem("userNom", data.user.nom)
          }

          if (data.user.prenom) {
            localStorage.setItem("userPrenom", data.user.prenom)
          }

          // Stocker d'autres informations utiles
          if (data.user.specialite) {
            localStorage.setItem("userSpecialite", data.user.specialite)
          }

          if(data.user.photo){
            localStorage.setItem("userPhoto", data.user.photo)
          }

          // Stocker l'utilisateur complet pour un accès facile
          localStorage.setItem("user", JSON.stringify(data.user))

          // Vérifier que les données ont bien été stockées
          console.log("Contenu du localStorage après stockage:")
          console.log("userId:", localStorage.getItem("userId"))
          console.log("user:", localStorage.getItem("user"))
        } else if (data.user) {
          // Alternative si l'utilisateur est sous la clé "user" au lieu de "utilisateur"
          console.log("Structure de l'utilisateur (sous clé 'user'):", JSON.stringify(data.user, null, 2))

          // Stocker l'ID de l'utilisateur
          if (data.user.id) {
            localStorage.setItem("userId", data.user.id.toString())
            console.log("ID utilisateur stocké:", data.user.id.toString())
          } else if (data.user.utilisateur_id) {
            localStorage.setItem("userId", data.user.utilisateur_id.toString())
            console.log("ID utilisateur stocké (utilisateur_id):", data.user.utilisateur_id.toString())
          }

          // Stocker l'utilisateur complet
          localStorage.setItem("user", JSON.stringify(data.user))
          console.log("Utilisateur stocké sous 'user'")
          
          if (data.user.type) {
            userRole = data.user.type;
          }
        } else {
          // Si l'utilisateur est directement dans data
          if (data.id) {
            localStorage.setItem("userId", data.id.toString())
            console.log("ID utilisateur stocké directement:", data.id.toString())
            localStorage.setItem("user", JSON.stringify(data))
          }
          
          if (data.type) {
            userRole = data.type;
          }
        }

        // Attendre un peu avant de rediriger pour s'assurer que le localStorage est mis à jour
        setTimeout(() => {
          console.log("Redirection après délai, vérification finale du localStorage:")
          console.log("userId:", localStorage.getItem("userId"))
          console.log("user:", localStorage.getItem("user"))
          
          // Redirection selon le rôle de l'utilisateur
          if (userRole === "admin") {
            navigate("/admin/accueil");
          } else if (userRole === "visiteur") {
            navigate("/visiteur/accueil");
          } else if (userRole === "professionnel") {
            navigate("/professionnel/accueil");
          } else {
            // Redirection par défaut si le rôle n'est pas identifié
            navigate("/page");
          }
        }, 500)
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Identifiants incorrects")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      alert("Erreur de connexion au serveur")
    }
  }

  const goToResetPassword = () => {
    navigate("/reset-password")
  }

  return (
    <div className={style.container}>
      <h1>CONTENT DE VOUS REVOIR !</h1>
      <form onSubmit={handleSubmit}>
        <div className={style.inputs}>
          <div className={style.nom}>
            <label htmlFor="nom">Adresse email</label>
            <input
              type="email"
              id="nom"
              name="nom"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={style.motdepasse}>
            <label htmlFor="motdepasse">Mot de passe</label>
            <div className={style.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="motdepasse"
                name="motdepasse"
                placeholder="*************"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
              <span className={style.togglePassword} onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </span>
            </div>
          </div>
        </div>
        <div id="forgot-password">
          <a className={style.forget} onClick={goToResetPassword} style={{ cursor: "pointer" }}>
            Mot de passe oublie ?
          </a>
        </div>
        <button className={style.connexion} type="submit">
          Connexion
        </button>
      </form>
    </div>
  )
}

export default Form;