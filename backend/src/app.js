const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging pour développement
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    next();
  });
}

// Routes d'authentification
const authRoutes = require('./routes/authRoute');
app.use('/api/auth', authRoutes);

// Routes de gestion des agences
const bankRoutes = require('./routes/bankRoute');
app.use('/api/banks', bankRoutes);

// Route de test pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API LoanGuard fonctionnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée' 
  });
});

// Middleware de gestion d'erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    message: 'Erreur interne du serveur' 
  });
});

module.exports = app;
