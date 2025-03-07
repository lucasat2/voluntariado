//authController.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
  }

  db.get(email, (err, value) => {
    if (!err) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const user = { id: uuidv4(), email, password, role };
    db.put(email, JSON.stringify(user), (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao salvar usuário' });
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.get(email, (err, value) => {
    if (err) return res.status(400).json({ message: 'Usuário não encontrado' });

    const user = JSON.parse(value);
    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token });
  });
};