const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secreta';

module.exports = {
  async buscarPorId(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id, {
        attributes: ['id', 'firstname', 'surname', 'email']
      });

      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },

  async criar(req, res) {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ erro: 'As senhas não coincidem.' });
    }

    const jaExiste = await User.findOne({ where: { email } });
    if (jaExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    try {
      const novoUsuario = await User.create({ firstname, surname, email, password });

      return res.status(201).json({
        id: novoUsuario.id,
        firstname: novoUsuario.firstname,
        surname: novoUsuario.surname,
        email: novoUsuario.email
      });
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { firstname, surname, email } = req.body;

    if (!firstname || !surname || !email) {
      return res.status(400).json({ erro: 'Dados inválidos.' });
    }

    try {
      const usuario = await User.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      await usuario.update({ firstname, surname, email });
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
    }
  },


  async deletar(req, res) {
    const { id } = req.params;

    try {
      const usuario = await User.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      await usuario.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'Dados obrigatórios ausentes.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const senhaConfere = await bcrypt.compare(password, user.password);
    if (!senhaConfere) {
      return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({ token });
  }
};
