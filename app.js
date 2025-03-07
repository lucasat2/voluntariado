// app.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes'); // Importação correta
const userRoutes = require('./routes/userRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const path = require('path');

const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Rotas públicas
app.use('/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
app.use(authenticateToken);

// Rotas protegidas
app.use('/activities', activityRoutes);
app.use('/users', userRoutes);

module.exports = app;