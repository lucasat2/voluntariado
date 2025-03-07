const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/db'); // Importe o banco de dados
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Caminho para o arquivo JSON
const activitiesFilePath = path.join(__dirname, '../data/activities.json');

// Inicializa o banco de dados com atividades do arquivo JSON
function initializeDatabase() {
  fs.readFile(activitiesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo JSON:', err);
      return;
    }

    const activities = JSON.parse(data);

    // Adiciona as atividades ao banco de dados
    activities.forEach(activity => {
      db.put(`activity:${activity.id}`, JSON.stringify(activity), (err) => {
        if (err) console.error('Erro ao salvar atividade:', err);
        else console.log('Atividade salva com sucesso:', activity.title);
      });
    });
  });
}

// Chama a função para inicializar o banco de dados
initializeDatabase();

// Rotas
const activitiesRoutes = require('../routes/activities');
app.use('/activities', activitiesRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});