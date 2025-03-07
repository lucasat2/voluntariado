//userController.js
exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // Obtém o usuário do token JWT
    res.json({ message: 'Perfil do usuário', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error });
  }
};