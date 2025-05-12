require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');
const commentaireRoutes = require("./src/routes/commentaire.routes");
const authRoutes = require("./src/routes/auth.routes");
const inscriptionRoutes = require("./src/routes/inscreption.routes");
const rechRoutes = require("./src/routes/rech.routes");
const oeuvreRoutes = require("./src/routes/oeuvre.routes");
const logoutRoutes = require("./src/routes/dec.routes");
const adminRoutes = require("./src/routes/admin.routes");
const profileRoutes = require("./src/routes/profile.routes");
const notifRoutes = require("./src/routes/notification.routes");
const mediaRoutes = require("./src/routes/medias.routes");
const sectionRoutes = require("./src/routes/section.routes");
const enLigneRoutes = require("./src/routes/utilisateursEnLigne.routes");
const initialiserSocket = require('./socket');
const modifierCompteRoutes = require("./src/routes/modifyaccount.routes");
const annotationRoutes = require('./src/routes/annotations.routes');

const app = express(); 
const serveur = http.createServer(app); 

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/mediasFile', express.static(path.join(__dirname, 'src/medias')));
//app.use('/backend/src/profile_photos', express.static(path.join(__dirname, 'profile_photos')));
const profilePhotosPath = path.join(__dirname, 'src', 'profile_photos');
console.log('Chemin des photos de profil :', profilePhotosPath);
app.use('/backend/src/profile_photos', (req, res, next) => {
    console.log('Tentative d\'accès à:', req.path);
    next();
  });

  app.use('/backend/src/profile_photos', express.static(
    path.join(__dirname, 'src','profile_photos'),
    { dotfiles: 'allow' }), (err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(404).send('Fichier non trouvé');
  });
app.use((req, res, next) => {
    console.log(`📩 Requête reçue : [${req.method}] ${req.url}`);
    next();
});
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
// Update your CORS middleware in server.js
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar','Content-Type', 'Authorization'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());
// Add this before your routes in server.js
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Socket.io
const io = new Server(serveur, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST","PUT","PATCH"],
      credentials: true
    }
  });
initialiserSocket(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inscreption", inscriptionRoutes);
app.use("/api/recherche", rechRoutes);
app.use("/api/oeuvre", oeuvreRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notifRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/utilisateurs-en-ligne", enLigneRoutes);
app.use("/logout", logoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/modifyaccount", modifierCompteRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use('/api/annotations', annotationRoutes);
// Test route
app.get("/", (req, res) => {
    res.json({ message: "🚀 Serveur fonctionne !" });
});

// Lancer serveur
const PORT = process.env.PORT || 5000;
serveur.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
