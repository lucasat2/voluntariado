const API_BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html'; // Redireciona para o login se não houver token
}

// Função para buscar e exibir atividades no dropdown
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

    const dropdown = document.getElementById('activities-dropdown');

    // Limpa o dropdown
    dropdown.innerHTML = '<option value="">Selecione uma atividade</option>';

    // Preenche o dropdown com as atividades
    activities.forEach(activity => {
      const option = document.createElement('option');
      option.value = activity.id;
      option.textContent = `${activity.title} (${activity.date})`;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
  }
}

// Função para inscrever-se em uma atividade selecionada
document.getElementById('subscribe-btn').addEventListener('click', async () => {
  const dropdown = document.getElementById('activities-dropdown');
  const activityId = dropdown.value;

  if (!activityId) {
    alert('Selecione uma atividade para se inscrever.');
    return;
  }

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
});

// Função para logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); // Remove o token
  window.location.href = 'index.html'; // Redireciona para a página de login
});

// Carrega as atividades ao abrir a página
document.addEventListener('DOMContentLoaded', fetchActivities);