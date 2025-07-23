const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Pour les cookies httpOnly

require('dotenv').config();

const app = express();

// Configuration pour récupérer la vraie IP (rate limiting)
app.set('trust proxy', 1);

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // Essentiel pour les cookies httpOnly
}));

// Middleware pour parser les cookies
app.use(cookieParser());

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
const companyRoutes = require('./routes/companyRoute')
app.use('/api/companies', companyRoutes)

const loanRoute = require('./routes/loanRoute')
app.use('/api/loans', loanRoute)

app.use('/api/risk', require('./routes/riskRoute'))

app.use('/api/simulation', require('./routes/simulationRoute'))

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
