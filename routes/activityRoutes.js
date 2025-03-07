// routes/activityRoutes.js
const express = require('express');
const activityController = require('../controllers/activityController'); // Importação do controlador
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Listar todas as atividades (disponível para todos os usuários)
router.get('/', activityController.listActivities);

// Criar uma nova atividade (apenas admin)
router.post('/', authenticateToken, activityController.createActivity);

// Editar uma atividade (apenas admin)
router.put('/:id', authenticateToken, activityController.updateActivity);

// Excluir uma atividade (apenas admin)
router.delete('/:id', authenticateToken, activityController.deleteActivity);

// Inscrever-se em uma atividade (usuário comum)
router.post('/:id/join', authenticateToken, activityController.joinActivity);

// Cancelar inscrição em uma atividade (usuário comum)
router.post('/:id/cancel', authenticateToken, activityController.cancelActivity);

// Visualizar atividades inscritas (usuário comum)
router.get('/my-activities', authenticateToken, activityController.getMyActivities);

// Visualizar participantes de uma atividade (apenas admin)
router.get('/:id/participants', authenticateToken, activityController.getParticipants);

module.exports = router;