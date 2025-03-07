//activityController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Activity {
  constructor(title, description, date, location, maxParticipants) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.maxParticipants = maxParticipants;
    this.participants = [];
  }
}

// Listar todas as atividades
exports.listActivities = async (req, res) => {
  const activities = [];

  // Usando createReadStream para buscar todas as atividades
  db.createReadStream()
    .on('data', (data) => {
      if (data.key.startsWith('activity:')) {
        activities.push(JSON.parse(data.value));
      }
    })
    .on('end', () => {
      res.json(activities);
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'Erro ao buscar atividades', error: err });
    });
};

// Criar uma nova atividade (apenas admin)
exports.createActivity = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { title, description, date, location, maxParticipants } = req.body;

  if (!title || !description || !date || !location || !maxParticipants) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const activity = new Activity(title, description, date, location, maxParticipants);

  db.put(`activity:${activity.id}`, JSON.stringify(activity), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar atividade', error: err });
    }
    res.status(201).json({ message: 'Atividade criada com sucesso', activity });
  });
};

// Editar uma atividade (apenas admin)
exports.updateActivity = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { id } = req.params;
  const { title, description, date, location, maxParticipants } = req.body;

  db.get(`activity:${id}`, (err, value) => {
    if (err) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const activity = JSON.parse(value);
    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.location = location || activity.location;
    activity.maxParticipants = maxParticipants || activity.maxParticipants;

    db.put(`activity:${id}`, JSON.stringify(activity), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar atividade', error: err });
      }
      res.json({ message: 'Atividade atualizada com sucesso', activity });
    });
  });
};

// Excluir uma atividade (apenas admin)
exports.deleteActivity = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { id } = req.params;

  db.del(`activity:${id}`, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao excluir atividade', error: err });
    }
    res.json({ message: 'Atividade excluída com sucesso' });
  });
};

// Inscrever-se em uma atividade (usuário comum)
exports.joinActivity = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(`activity:${id}`, (err, value) => {
    if (err) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const activity = JSON.parse(value);

    if (activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: 'Não há vagas disponíveis' });
    }

    if (activity.participants.includes(userId)) {
      return res.status(400).json({ message: 'Você já está inscrito nesta atividade' });
    }

    activity.participants.push(userId);
    db.put(`activity:${id}`, JSON.stringify(activity), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao inscrever-se', error: err });
      }
      res.json({ message: 'Inscrição realizada com sucesso', activity });
    });
  });
};

// Cancelar inscrição em uma atividade (usuário comum)
exports.cancelActivity = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(`activity:${id}`, (err, value) => {
    if (err) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const activity = JSON.parse(value);

    const participantIndex = activity.participants.indexOf(userId);
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'Você não está inscrito nesta atividade' });
    }

    activity.participants.splice(participantIndex, 1);
    db.put(`activity:${id}`, JSON.stringify(activity), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao cancelar inscrição', error: err });
      }
      res.json({ message: 'Inscrição cancelada com sucesso', activity });
    });
  });
};

// Visualizar atividades inscritas (usuário comum)
exports.getMyActivities = async (req, res) => {
  const userId = req.user.id;
  const myActivities = [];

  db.createReadStream()
    .on('data', (data) => {
      if (data.key.startsWith('activity:')) {
        const activity = JSON.parse(data.value);
        if (activity.participants.includes(userId)) {
          myActivities.push(activity);
        }
      }
    })
    .on('end', () => {
      res.json(myActivities);
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'Erro ao buscar atividades', error: err });
    });
};

// Visualizar participantes de uma atividade (apenas admin)
exports.getParticipants = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { id } = req.params;

  db.get(`activity:${id}`, (err, value) => {
    if (err) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const activity = JSON.parse(value);
    res.json({ participants: activity.participants });
  });
};