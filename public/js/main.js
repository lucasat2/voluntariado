// public/js/main.js
const API_BASE_URL = 'http://localhost:3000';

// Alternar entre login e registro
document.getElementById('show-register').addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('login-form-container').style.display = 'none';
  document.getElementById('register-form-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('register-form-container').style.display = 'none';
  document.getElementById('login-form-container').style.display = 'block';
});

// Login
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token); // Salva o token no localStorage
      window.location.href = 'perfil.html'; // Redireciona para a página de perfil
    } else {
      alert('Erro no login: ' + data.message);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao conectar ao servidor');
  }
});

// Registro
document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Envia o token JWT
      },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registro realizado com sucesso! Faça login.');
      document.getElementById('register-form-container').style.display = 'none';
      document.getElementById('login-form-container').style.display = 'block';
    } else {
      alert('Erro no registro: ' + data.message);
    }
  } catch (error) {
    console.error('Erro no registro:', error);
    alert('Erro ao conectar ao servidor');
  }
});