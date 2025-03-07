// public/js/profile.js
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html'; // Redireciona para o login se não houver token
}

// Decodificar o token para obter as informações do usuário
function decodeToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}

const user = decodeToken(token);

// Exibir informações do perfil
document.getElementById('profile-email').textContent = user.email;
document.getElementById('profile-role').textContent = user.role;
document.getElementById('profile-token').textContent = token; // Exibe o token

// Redirecionar para a página de atividades
document.getElementById('go-to-activities-btn').addEventListener('click', () => {
  window.location.href = 'atividades.html';
});

// Função para fazer logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});