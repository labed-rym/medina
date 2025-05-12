"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styles from "./Notification.module.css"
import { FaTrashAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

interface Emetteur {
  email: string;
  nom: string;
  prenom: string;
  profession: string | null;
}


interface NotificationProps {
  id: string
  emetteur:Emetteur
  profession: string
  message: string
  type: "partage" | "modif" | "nouveau utilisateur"|"invitation"
  modification?: string
  nouveau?: string
  email?: string
  reference_id?: number // Ajouté pour les invitations
  reference_type?: string // Ajouté pour les invitations
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<
    (NotificationProps & { status?: "accepte" | "refuse" | "en attente" })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fonction pour charger les notifications
    const loadNotifications = () => {
      // 🔁 Récupère l'ID de l'utilisateur connecté
      const userId = localStorage.getItem("userId")
      console.log("ID utilisateur récupéré :", userId)

      // Vérifier également les autres possibilités
      const userObj = localStorage.getItem("user")
      console.log("Objet utilisateur dans localStorage:", userObj)

      if (userObj) {
        try {
          const parsedUser = JSON.parse(userObj)
          console.log("Utilisateur parsé:", parsedUser)
          if (parsedUser.id && !userId) {
            localStorage.setItem("userId", parsedUser.id.toString())
            console.log("ID utilisateur extrait de l'objet user:", parsedUser.id)
          } else if (parsedUser.utilisateur_id && !userId) {
            localStorage.setItem("userId", parsedUser.utilisateur_id.toString())
            console.log("ID utilisateur extrait de l'objet user (utilisateur_id):", parsedUser.utilisateur_id)
          }
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur:", e)
        }
      }

      // Récupérer à nouveau l'ID après les vérifications
      const finalUserId = localStorage.getItem("userId")

      if (!finalUserId) {
        console.warn("Aucun ID utilisateur trouvé dans le localStorage !")
        setError("Vous devez être connecté pour voir vos notifications")
        setLoading(false)
        return
      }

      // 📡 Appel backend pour les notifications de cet utilisateur
      setLoading(true)
      fetch(`http://localhost:5000/api/notifications/tous/${finalUserId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erreur serveur")
          return res.json()
        })
        .then((data) => {
          console.log("Données de notifications reçues:", data)

          // Si data est un objet avec une propriété notifications
          const notificationsArray = Array.isArray(data) ? data : data.notifications ? data.notifications : []
          console.log("Notifications après vérification:", notificationsArray);
          const notificationsWithStatus = notificationsArray.map((notification: NotificationProps) => {
            const savedStatus = localStorage.getItem(`notification_${notification.id}_status`)
            if (savedStatus === "accepte" || savedStatus === "refuse" || savedStatus === "en attente") {
              return {
                ...notification,
                status: savedStatus as "accepte" | "refuse" | "en attente",
              }
            }
            return notification
          })

          setNotifications(notificationsWithStatus)
          setError(null)
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des notifications :", err)
          setError("Impossible de charger les notifications")
        })
        .finally(() => {
          setLoading(false)
        })
    }

    // Charger les notifications immédiatement
    loadNotifications()

    // Configurer un intervalle pour vérifier périodiquement les nouvelles notifications
    const intervalId = setInterval(loadNotifications, 30000) // toutes les 30 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId)
  }, [])

  const clearAllNotifications = () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      console.warn("Impossible de supprimer les notifications: ID utilisateur non trouvé")
      return
    }

    // Appel API pour supprimer les notifications
    fetch(`http://localhost:5000/api/notifications/supprimer/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression")
        return res.json()
      })
      .then(() => {
        setNotifications([])
        // Supprimer les statuts du localStorage
        notifications.forEach((notification) => {
          localStorage.removeItem(`notification_${notification.id}_status`)
        })
      })
      .catch((err) => {
        console.error("Erreur:", err)
        alert("Impossible de supprimer les notifications")
      })
  }

  const handleAccept = async (index: number) => {
    const notification = notifications[index];
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId || !token) {
        alert("Vous devez être connecté");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/notifications/accepter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                notificationId: notification.id,
                idOeuvre: notification.reference_id
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'acceptation");
        }

        const data = await response.json();
        
        if (data.success) {
            setNotifications(prev => {
                const newNotifications = [...prev];
                newNotifications[index] = { ...newNotifications[index], status: "accepte" };
                return newNotifications;
            });
            localStorage.setItem(`notification_${notification.id}_status`, "accepte");
        } else {
            alert(data.message || "Erreur lors de l'acceptation");
        }
    } catch (err) {
        console.error("Erreur:", err);
        alert("Impossible d'accepter la notification");
    }
};

const handleRefuse = async (index: number) => {
  const notification = notifications[index];
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
      alert("Vous devez être connecté");
      return;
  }

  try {
      const response = await fetch(`http://localhost:5000/api/notifications/refuser`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              notificationId: notification.id
          })
      });

      if (!response.ok) {
          throw new Error("Erreur lors du refus");
      }

      const data = await response.json();
      
      if (data.success) {
          setNotifications(prev => {
              const newNotifications = [...prev];
              newNotifications[index] = { ...newNotifications[index], status: "refuse" };
              return newNotifications;
          });
          localStorage.setItem(`notification_${notification.id}_status`, "refuse");
      } else {
          alert(data.message || "Erreur lors du refus");
      }
  } catch (err) {
      console.error("Erreur:", err);
      alert("Impossible de refuser la notification");
  }
};

  const handleVoirPlus = (id: string) => {
    navigate(`/notification/${id}`)
  }

  if (loading) return <div className={styles.loading}>Chargement des notifications...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.drap}>
        <button onClick={clearAllNotifications} className={styles.trash_button}>
          <FaTrashAlt />
        </button>
      </div>

      <div className={styles.notifications}>
        {notifications.length === 0 ? (
          <div className={styles.emptyNotifications}>Aucune notification</div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`${styles.notification} ${notification.status ? styles[notification.status] : ""}`}
            >
              <div className={styles.notificationLeft}>
                <div className={styles.userIcon}></div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <span className={styles.userName}>{`${notification.emetteur.nom} ${notification.emetteur.prenom}`}</span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.userProfession}>{notification.emetteur.profession}</span>
                  </div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                </div>
              </div>

              {notification.status ? (
                <div className={styles.notificationStatus}>
                  {notification.status === "accepte" ? "Invitation acceptée" : "Invitation refusée"}
                </div>
              ) : (
                <div className={styles.notificationActions}>
                  <button className={styles.voirPlus} onClick={() => handleVoirPlus(notification.id)}>
                    voir plus
                  </button>
                  <button className={styles.accept} onClick={() => handleAccept(index)}>
                    Accepter
                  </button>
                  <button className={styles.refuse} onClick={() => handleRefuse(index)}>
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationSystem
