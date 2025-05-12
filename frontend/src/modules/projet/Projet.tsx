"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import styles from "./Projet.module.css"
import "./Projet.module.css"
import { MediaService } from "../../services/media.services"
import { AnnotationService } from "../../services/annotations.services"

// Définir l'URL de base de l'API
const API_BASE_URL = "http://localhost:5000/api"
const mediaService = new MediaService(API_BASE_URL)
const annotationService = new AnnotationService(API_BASE_URL)

// Define the annotation type with section
type Annotation = {
  id: number
  text: string
  section: string
  timestamp: string
}

// Type pour les sections
type Section = {
  id: string
  titre: string
  contenu_html: string
  contenu_text: string
  date_creation: string
  date_modification: string
}

// Type pour les médias
type Media = {
  id: string
  nom: string
  url: string
  id_section: string
  date_creation: string
}

// Type pour les détails du projet
type ProjectDetails = {
  id: string
  titre: string
  periode: string
  wilaya: string
  description: string
  image_couverture: string
}

function editRequest() {
  alert("Votre demande de collaboration a été bien envoyée")
}

function Projet() {
  // Récupérer l'ID du projet depuis les paramètres d'URL
  const { documentId } = useParams<{ documentId: string }>()
  const userId = localStorage.getItem("userId")

  // State variables
  const [showAnnotationPopup, setShowAnnotationPopup] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [selectedSection, setSelectedSection] = useState("architecture")
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [sections, setSections] = useState<{ [key: string]: Section }>({
    architecture: { contenu_html: "" } as Section,
    histoire: { contenu_html: "" } as Section,
    archeologie: { contenu_html: "" } as Section,
    ressources: { contenu_html: "" } as Section,
  })
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    id: "",
    titre: "",
    periode: "",
    wilaya: "",
    description: "",
    image_couverture: "",
  })
  const [mediaList, setMediaList] = useState<{ [key: string]: Media[] }>({
    architecture: [],
    histoire: [],
    archeologie: [],
    ressources: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fonction pour restaurer les URLs des médias dans le contenu HTML
  const restoreMediaUrls = (html: string) => {
    if (!html) return ""

    // Créer un élément DOM temporaire pour analyser le HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Trouver tous les placeholders et les remplacer par les URLs réelles
    const mediaElements = doc.querySelectorAll('img[src^="[MEDIA:"], video[src^="[MEDIA:"]')

    mediaElements.forEach((element) => {
      const src = element.getAttribute("src")
      if (src) {
        // Extraire l'ID du média du placeholder
        const mediaIdMatch = src.match(/\[MEDIA:([^\]]+)\]/)
        if (mediaIdMatch && mediaIdMatch[1]) {
          const mediaId = mediaIdMatch[1]

          // Stocker l'ID du média comme attribut de données pour référence future
          element.setAttribute("data-media-id", mediaId)

          // Remplacer par l'URL réelle
          element.setAttribute("src", `${API_BASE_URL}/medias/${mediaId}`)
        }
      }
    })

    return doc.body.innerHTML
  }

  // Fonction pour récupérer les détails du projet
  const fetchProjectDetails = async () => {
    if (!documentId) return

    try {
      const response = await fetch(`${API_BASE_URL}/oeuvre/donnee/${documentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch project details")
      }

      const projectData = await response.json()
      setProjectDetails({
        id: projectData.data.id || "",
        titre: projectData.data.titre || "",
        periode: projectData.data.periode || "",
        wilaya: projectData.data.wilaya || "",
        description: projectData.data.description || "",
        image_couverture: `${projectData.data.photo}` || "",
      })
    } catch (error) {
      console.error("Error fetching project details:", error)
      setError("Erreur lors du chargement des détails du projet")
    }
  }

  // Fonction pour récupérer les sections du projet
  const fetchSections = async () => {
    if (!documentId) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("Token d'authentification non trouvé")
        return
      }

      const response = await fetch(`${API_BASE_URL}/sections/${documentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des sections: ${response.status}`)
      }

      const sectionsData = await response.json()

      // Organiser les sections par titre
      const organizedSections: { [key: string]: Section } = {
        architecture: { contenu_html: "" } as Section,
        histoire: { contenu_html: "" } as Section,
        archeologie: { contenu_html: "" } as Section,
        ressources: { contenu_html: "" } as Section,
      }

      sectionsData.forEach((section: Section) => {
        if (section.titre && organizedSections.hasOwnProperty(section.titre)) {
          // Restaurer les URLs des médias dans le contenu HTML
          const processedContent = restoreMediaUrls(section.contenu_html)
          organizedSections[section.titre] = {
            ...section,
            contenu_html: processedContent,
          }
        }
      })

      setSections(organizedSections)
    } catch (error) {
      console.error("Erreur lors du chargement des sections:", error)
      setError("Erreur lors du chargement des sections")
    }
  }

  // Fonction pour récupérer les médias du projet
  const fetchMedia = async () => {
    if (!documentId) return

    try {
      const mediaData = await mediaService.getMediasByOeuvre(documentId)

      // Organiser les médias par section
      const organizedMedia: { [key: string]: Media[] } = {
        architecture: [],
        histoire: [],
        archeologie: [],
        ressources: [],
      }

      mediaData.data.forEach((media: Media) => {
        if (organizedMedia.hasOwnProperty(media.id_section)) {
          organizedMedia[media.id_section].push(media)
        }
      })

      setMediaList(organizedMedia)
    } catch (error) {
      console.error("Error fetching media:", error)
      setError("Erreur lors du chargement des médias")
    }
  }

  // Fonction pour récupérer les annotations du projet
  const fetchAnnotations = async () => {
    if (!documentId) return

    try {
      const annotationsData = await annotationService.getAnnotationsByOeuvre(documentId)

      // Transformer les données du backend au format attendu par le composant
      const formattedAnnotations = annotationsData.map((item: any) => ({
        id: item.id,
        text: item.texte || item.text,
        section: item.section,
        timestamp: new Date(item.date_creation || item.timestamp).toLocaleString(),
      }))

      setAnnotations(formattedAnnotations)
    } catch (error) {
      console.error("Error fetching annotations:", error)
      setError("Erreur lors du chargement des annotations")
    }
  }

  // Charger toutes les données au chargement du composant
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([fetchProjectDetails(), fetchSections(), fetchMedia(), fetchAnnotations()])
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Erreur lors du chargement des données")
      } finally {
        setIsLoading(false)
      }
    }

    if (documentId) {
      loadAllData()
    } else {
      // Si pas d'ID dans l'URL, essayer de le récupérer d'une autre source
      const urlParams = new URLSearchParams(window.location.search)
      const docId = urlParams.get("id")
      if (docId) {
        // Simuler un documentId pour les fonctions de chargement
        const tempDocumentId = docId
        const loadAllDataWithTempId = async () => {
          setIsLoading(true)
          try {
            const response = await fetch(`${API_BASE_URL}/oeuvre/donnee/${tempDocumentId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              credentials: "include",
            })

            if (!response.ok) {
              throw new Error("Failed to fetch project details")
            }

            const projectData = await response.json()
            setProjectDetails({
              id: projectData.data.id || "",
              titre: projectData.data.titre || "",
              periode: projectData.data.periode || "",
              wilaya: projectData.data.wilaya || "",
              description: projectData.data.description || "",
              image_couverture: projectData.data.photo || "",
            })

            // Charger les sections
            const token = localStorage.getItem("token")
            if (token) {
              const sectionsResponse = await fetch(`${API_BASE_URL}/sections/${tempDocumentId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })

              if (sectionsResponse.ok) {
                const sectionsData = await sectionsResponse.json()

                // Organiser les sections par titre
                const organizedSections: { [key: string]: Section } = {
                  architecture: { contenu_html: "" } as Section,
                  histoire: { contenu_html: "" } as Section,
                  archeologie: { contenu_html: "" } as Section,
                  ressources: { contenu_html: "" } as Section,
                }

                sectionsData.forEach((section: Section) => {
                  if (section.titre && organizedSections.hasOwnProperty(section.titre)) {
                    // Restaurer les URLs des médias dans le contenu HTML
                    const processedContent = restoreMediaUrls(section.contenu_html)
                    organizedSections[section.titre] = {
                      ...section,
                      contenu_html: processedContent,
                    }
                  }
                })

                setSections(organizedSections)
              }
            }

            // Charger les médias
            const mediaData = await mediaService.getMediasByOeuvre(tempDocumentId)

            // Organiser les médias par section
            const organizedMedia: { [key: string]: Media[] } = {
              architecture: [],
              histoire: [],
              archeologie: [],
              ressources: [],
            }

            mediaData.data.forEach((media: Media) => {
              if (organizedMedia.hasOwnProperty(media.id_section)) {
                organizedMedia[media.id_section].push(media)
              }
            })

            setMediaList(organizedMedia)

            // Charger les annotations
            const annotationsData = await annotationService.getAnnotationsByOeuvre(tempDocumentId)

            // Transformer les données du backend au format attendu par le composant
            const formattedAnnotations = annotationsData.map((item: any) => ({
              id: item.id,
              text: item.texte || item.text,
              section: item.section,
              timestamp: new Date(item.date_creation || item.timestamp).toLocaleString(),
            }))

            setAnnotations(formattedAnnotations)
          } catch (error) {
            console.error("Error loading data:", error)
            setError("Erreur lors du chargement des données")
          } finally {
            setIsLoading(false)
          }
        }

        loadAllDataWithTempId()
      }
    }
  }, [documentId])

  // Handle popup open/close
  const handleAnnotateClick = () => {
    setShowAnnotationPopup(true)
  }

  const closePopup = () => {
    setShowAnnotationPopup(false)
    setCommentText("")
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (commentText.trim() === "") return

    try {
      // Déterminer l'ID du document
      let docId = documentId
      if (!docId) {
        const urlParams = new URLSearchParams(window.location.search)
        docId = urlParams.get("documentId") || projectDetails.id
      }

      // Déterminer l'ID de l'utilisateur
      const user = userId || "default-user-id"

      // Envoyer l'annotation au backend
      if (docId) {
        const response = await annotationService.addAnnotation(docId, user, commentText, selectedSection)

        // Créer une nouvelle annotation avec les données de la réponse
        const newAnnotation: Annotation = {
          id: response.id || Date.now(),
          text: commentText,
          section: selectedSection,
          timestamp: new Date().toLocaleString(),
        }

        // Update annotations
        setAnnotations((prev) => {
          return [...prev, newAnnotation]
        })
      } else {
        // Fallback si pas d'ID de document (mode local)
        const newAnnotation: Annotation = {
          id: Date.now(),
          text: commentText,
          section: selectedSection,
          timestamp: new Date().toLocaleString(),
        }

        setAnnotations((prev) => {
          return [...prev, newAnnotation]
        })
      }

      // Reset and close popup
      setCommentText("")
      setShowAnnotationPopup(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'annotation:", error)
      alert("Erreur lors de l'ajout de l'annotation")
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Chargement...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <>
      <div className={styles.descriptionContainer}>
        <div className={styles.buttons}>
          <button onClick={editRequest}>Editer</button>
          <button onClick={handleAnnotateClick}>Annoter</button>
        </div>

        <h5>Description</h5>
        <div className={styles.description}>
          <div className={styles.text}>
            <h6>Titre</h6>
            <p className={styles.pElement}>{projectDetails.titre}</p>
            <h6>Periode</h6>
            <p className={styles.pElement}>{projectDetails.periode}</p>
            <h6>Wilaya</h6>
            <p className={styles.pElement}>{projectDetails.wilaya}</p>
            <h6>Description</h6>
            <p className={styles.pElement}>{projectDetails.description}</p>
          </div>
          <div className={styles.imgContainer}>
            <img
              src={
                projectDetails.image_couverture
                  ? `http://localhost:5000/uploads/${projectDetails.image_couverture}`
                  : "/placeholder.svg"
              }
              alt="image de couverture"
            />
          </div>
        </div>
      </div>

      <div className={styles.page}>
        <h5>Article</h5>

        <h6>Architecture</h6>
        <div
          id="architecture"
          className={styles.architecture}
          dangerouslySetInnerHTML={{ __html: sections.architecture.contenu_html }}
        ></div>
        {annotations
          .filter((annotation) => annotation.section === "architecture")
          .map((annotation) => (
            <div key={annotation.id} className={styles.annotation}>
              <p>{annotation.text}</p>
              <small>{annotation.timestamp}</small>
            </div>
          ))}

        <h6>Histoire</h6>
        <div
          id="histoire"
          className={styles.histoire}
          dangerouslySetInnerHTML={{ __html: sections.histoire.contenu_html }}
        ></div>
        {annotations
          .filter((annotation) => annotation.section === "histoire")
          .map((annotation) => (
            <div key={annotation.id} className={styles.annotation}>
              <p>{annotation.text}</p>
              <small>{annotation.timestamp}</small>
            </div>
          ))}

        <h6>Archéologie</h6>
        <div
          id="archeologie"
          className={styles.archeologie}
          dangerouslySetInnerHTML={{ __html: sections.archeologie.contenu_html }}
        ></div>
        {annotations
          .filter((annotation) => annotation.section === "archeologie")
          .map((annotation) => (
            <div key={annotation.id} className={styles.annotation}>
              <p>{annotation.text}</p>
              <small>{annotation.timestamp}</small>
            </div>
          ))}

        <h6>Ressources</h6>
        <div
          id="ressources"
          className={styles.ressources}
          dangerouslySetInnerHTML={{ __html: sections.ressources.contenu_html }}
        ></div>
        {annotations
          .filter((annotation) => annotation.section === "ressources")
          .map((annotation) => (
            <div key={annotation.id} className={styles.annotation}>
              <p>{annotation.text}</p>
              <small>{annotation.timestamp}</small>
            </div>
          ))}
      </div>

      {/* Annotation Popup with Section Selection */}
      {showAnnotationPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Ajouter une annotation</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="section-select">Section à annoter:</label>
                <select
                  id="section-select"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className={styles.selectField}
                >
                  <option value="architecture">Architecture</option>
                  <option value="histoire">Histoire</option>
                  <option value="archeologie">Archéologie</option>
                  <option value="ressources">Ressources</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="comment-text">Votre commentaire:</label>
                <textarea
                  id="comment-text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={styles.textareaField}
                  rows={5}
                  placeholder="Écrivez votre commentaire ici..."
                />
              </div>

              <div className={styles.popupButtons}>
                <button type="button" onClick={closePopup} className={styles.cancelButton}>
                  Annuler
                </button>
                <button type="submit" className={styles.submitButton}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Projet
