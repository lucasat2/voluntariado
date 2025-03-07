const API_BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html'; // Redireciona para o login se não houver token
}

// Função para buscar e exibir atividades
async function fetchActivities() {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const activities = await response.json();

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
      activitiesList.appendChild(activityCard);
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
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
    } else {
      alert('Erro ao cancelar a inscrição.');
    }
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
  }
}

// Chama a função para buscar atividades ao carregar a página
document.addEventListener('DOMContentLoaded', fetchActivities);
