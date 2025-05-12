require('dotenv').config();
const mysql = require('mysql2/promise'); // Utilisation de `promise`
//const { Sequelize } = require('sequelize');

const db = mysql.createPool({  // `createPool()` pour support async/await
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "medina",
    charset: 'utf8mb4',// Pour supporter les emojis et autres caractères spéciaux 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;