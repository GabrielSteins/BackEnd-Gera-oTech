const Category = require('../models/Categories');
const { Op } = require('sequelize');

module.exports = {

  async buscar(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 12;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const fields = req.query.fields?.split(',') || ['id', 'name', 'slug', 'use_in_menu'];

      const where = {};
      if (req.query.use_in_menu === 'true') {
        where.use_in_menu = true;
      }

      const categorias = await Category.findAndCountAll({
        where,
        attributes: fields,
        limit: limit === -1 ? undefined : limit,
        offset: limit === -1 ? undefined : offset
      });

      return res.status(200).json({
        data: categorias.rows,
        total: categorias.count,
        limit: limit,
        page: page
      });

    } catch (err) {
      return res.status(400).json({ erro: 'Requisição inválida.' });
    }
  },


  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Category.findByPk(id, {
        attributes: ['id', 'name', 'slug', 'use_in_menu']
      });

      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      return res.status(200).json(categoria);
    } catch (err) {
      return res.status(400).json({ erro: 'Requisição inválida.' });
    }
  },


  async criar(req, res) {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
    }

    try {
      const novaCategoria = await Category.create({ name, slug, use_in_menu });
      return res.status(201).json(novaCategoria);
    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao criar categoria.' });
    }
  },


  async atualizar(req, res) {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
    }

    try {
      const categoria = await Category.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      await categoria.update({ name, slug, use_in_menu });
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao atualizar categoria.' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    try {
      const categoria = await Category.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada.' });
      }

      await categoria.destroy();
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao deletar categoria.' });
    }
  }
};
