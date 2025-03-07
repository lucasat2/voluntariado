const API_BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html'; // Redireciona para o login se não houver token
}

console.log('Token:', token); // Verifique no console

// Função para verificar se o usuário é admin
async function checkIfAdmin() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const user = await response.json();
    return user.role === 'admin'; // Supondo que a API retorne o campo 'role'
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return false;
  }
}

// Função para exibir ações de admin
async function displayAdminActions() {
  const isAdmin = await checkIfAdmin();
  if (isAdmin) {
    document.getElementById('admin-actions').style.display = 'block';
  }
}

// Função para buscar e exibir atividades
async function fetchActivities() {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Resposta da API (Atividades):', response); // Verifique no console

    if (!response.ok) {
      throw new Error('Erro ao buscar atividades');
    }

    const activities = await response.json();
    console.log('Atividades:', activities); // Verifique no console

    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '';

    activities.forEach(activity => {
      const activityCard = document.createElement('div');
      activityCard.className = 'activity-card';
      activityCard.innerHTML = `
        <h3>${activity.title}</h3>
        <p>${activity.description}</p>
        <p><strong>Data:</strong> ${activity.date}</p>
        <p><strong>Local:</strong> ${activity.location}</p>
        <p><strong>Vagas:</strong> ${activity.maxParticipants - activity.participants.length}</p>
        <button onclick="subscribeToActivity('${activity.id}')">Inscrever-se</button>
      `;

      // Adiciona botão de exclusão para admin
      if (isAdmin) {
        activityCard.innerHTML += `<button onclick="deleteActivity('${activity.id}')">Excluir</button>`;
      }

      activitiesList.appendChild(activityCard);
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
  }
}

// Função para buscar e exibir minhas inscrições
async function fetchMyActivities() {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/my-activities`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Resposta da API (Minhas Inscrições):', response); // Verifique no console

    if (!response.ok) {
      throw new Error('Erro ao buscar minhas inscrições');
    }

    const myActivities = await response.json();
    console.log('Minhas Inscrições:', myActivities); // Verifique no console

    const myActivitiesList = document.getElementById('my-activities-list');
    myActivitiesList.innerHTML = '';

    myActivities.forEach(activity => {
      const activityCard = document.createElement('div');
      activityCard.className = 'activity-card';
      activityCard.innerHTML = `
        <h3>${activity.title}</h3>
        <p>${activity.description}</p>
        <p><strong>Data:</strong> ${activity.date}</p>
        <p><strong>Local:</strong> ${activity.location}</p>
        <button onclick="cancelSubscription('${activity.id}')">Cancelar Inscrição</button>
      `;
      myActivitiesList.appendChild(activityCard);
    });
  } catch (error) {
    console.error('Erro ao buscar minhas inscrições:', error);
  }
}

// Função para inscrever-se em uma atividade
async function subscribeToActivity(activityId) {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Inscrição realizada com sucesso!');
      fetchActivities(); // Atualiza a lista de atividades
      fetchMyActivities(); // Atualiza a lista de minhas inscrições
    } else {
      alert('Erro ao se inscrever na atividade.');
    }
  } catch (error) {
    console.error('Erro ao inscrever-se:', error);
  }
}

// Função para cancelar inscrição em uma atividade
async function cancelSubscription(activityId) {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Inscrição cancelada com sucesso!');
      fetchActivities(); // Atualiza a lista de atividades
      fetchMyActivities(); // Atualiza a lista de minhas inscrições
    } else {
      alert('Erro ao cancelar a inscrição.');
    }
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
  }
}

// Função para criar uma nova atividade
document.getElementById('create-activity-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value,
    location: document.getElementById('location').value,
    maxParticipants: parseInt(document.getElementById('maxParticipants').value)
  };

  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Atividade criada com sucesso!');
      fetchActivities(); // Atualiza a lista de atividades
      document.getElementById('create-activity-section').style.display = 'none'; // Oculta o formulário
    } else {
      alert('Erro ao criar atividade.');
    }
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
  }
});

// Função para excluir uma atividade
async function deleteActivity(activityId) {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Atividade excluída com sucesso!');
      fetchActivities(); // Atualiza a lista de atividades
    } else {
      alert('Erro ao excluir atividade.');
    }
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
  }
}

// Exibe o formulário de criação de atividade
document.getElementById('create-activity-btn').addEventListener('click', () => {
  document.getElementById('create-activity-section').style.display = 'block';
});

// Função para logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); // Remove o token
  window.location.href = 'index.html'; // Redireciona para a página de login
});

// Chama as funções ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  await fetchActivities();
  await fetchMyActivities(); // Adicione esta linha
  await displayAdminActions();
});