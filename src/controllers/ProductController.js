const Product = require('../models/Products');
const Category = require('../models/Categories');
const ProductCategories = require('../models/ProductCategories');
const ImageProduct = require('../models/ImageProducts');
const OptionProduct = require('../models/OptionsProducts');
const { Op, Sequelize } = require('sequelize');

module.exports = {

  async buscar(req, res) {
    try {

      let limit = parseInt(req.query.limit) || 12;
      let page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const fields = req.query.fields ? req.query.fields.split(',') : null;

    
      const where = {};
      const include = [];

      if (req.query.match) {
        where[Op.or] = [
          { name: { [Op.like]: `%${req.query.match}%` } },
          { description: { [Op.like]: `%${req.query.match}%` } }
        ];
      }

  
      if (req.query['price-range']) {
        const [min, max] = req.query['price-range'].split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          where.price = { [Op.between]: [min, max] };
        }
      }

  
      if (req.query.category_ids) {
        const catIds = req.query.category_ids.split(',').map(id => parseInt(id));
        include.push({
          model: Category,
          attributes: [],
          through: { attributes: [] },
          where: { id: { [Op.in]: catIds } }
        });
      } else {
        include.push({
          model: Category,
          attributes: ['id'],
          through: { attributes: [] }
        });
      }

      if (req.query.option) {
        const optionFilters = req.query.option;
        
        for (const optionId in optionFilters) {
          const values = optionFilters[optionId].split(',');
          include.push({
            model: OptionProduct,
            where: {
              id: optionId,
              values: {
                [Op.or]: values.map(v => Sequelize.where(Sequelize.fn('FIND_IN_SET', v, Sequelize.col('values')), '>', 0))
              }
            }
          });
        }
      } else {
        include.push({ model: OptionProduct });
      }

      include.push({
        model: ImageProduct,
        attributes: ['id', 'path'],
        where: { enabled: true },
        required: false
      });

      
      if (limit === -1) {
        limit = null;
      }

    
      const produtos = await Product.findAndCountAll({
        where,
        include,
        limit,
        offset,
        attributes: fields || undefined,
        distinct: true
      });

     
      const data = produtos.rows.map(prod => ({
        id: prod.id,
        enabled: prod.enabled,
        name: prod.name,
        slug: prod.slug,
        stock: prod.stock,
        description: prod.description,
        price: prod.price,
        price_with_discount: prod.price_with_discount,
        category_ids: prod.Categories ? prod.Categories.map(c => c.id) : [],
        images: prod.ImageProducts ? prod.ImageProducts.map(img => ({
          id: img.id,
          content: img.path
        })) : [],
        options: prod.OptionsProducts || []
      }));

      return res.status(200).json({
        data,
        total: produtos.count,
        limit: req.query.limit ? parseInt(req.query.limit) : 12,
        page: req.query.page ? parseInt(req.query.page) : 1
      });

    } catch (err) {
      return res.status(400).json({ erro: 'Requisição inválida.' });
    }
  },

  
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: ['id'],
            through: { attributes: [] }
          },
          {
            model: ImageProduct,
            attributes: ['id', 'path'],
            where: { enabled: true },
            required: false
          },
          {
            model: OptionProduct
          }
        ]
      });

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

     
      return res.status(200).json({
        id: produto.id,
        enabled: produto.enabled,
        name: produto.name,
        slug: produto.slug,
        stock: produto.stock,
        description: produto.description,
        price: produto.price,
        price_with_discount: produto.price_with_discount,
        category_ids: produto.Categories ? produto.Categories.map(c => c.id) : [],
        images: produto.ImageProducts ? produto.ImageProducts.map(img => ({
          id: img.id,
          content: img.path
        })) : [],
        options: produto.OptionsProducts || []
      });
    } catch (err) {
      return res.status(400).json({ erro: 'Requisição inválida.' });
    }
  },

  
  async criar(req, res) {
    try {
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options
      } = req.body;

      if (!name || !slug || price === undefined || price_with_discount === undefined) {
        return res.status(400).json({ erro: 'Dados obrigatórios ausentes.' });
      }

    
      const produto = await Product.create({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

   
      if (Array.isArray(category_ids)) {
        await produto.setCategories(category_ids);
      }

     
      if (Array.isArray(images)) {
        for (const img of images) {
          await ImageProduct.create({
            product_id: produto.id,
            enabled: true,
            path: img.content
          });
        }
      }

   
      if (Array.isArray(options)) {
        for (const opt of options) {
          await OptionProduct.create({
            product_id: produto.id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: opt.radius || 0,
            type: opt.type || 'text',
            values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values
          });
        }
      }

      return res.status(201).json(produto);

    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao criar produto.' });
    }
  },

 
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options
      } = req.body;

      if (!name || !slug || price === undefined || price_with_discount === undefined) {
        return res.status(400).json({ erro: 'Dados obrigatórios ausentes.' });
      }

      const produto = await Product.findByPk(id);
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

      await produto.update({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

     
      if (Array.isArray(category_ids)) {
        await produto.setCategories(category_ids);
      }

     
      if (Array.isArray(images)) {
        for (const img of images) {
          if (img.deleted && img.id) {
           
            await ImageProduct.destroy({ where: { id: img.id, product_id: produto.id } });
          } else if (img.content && !img.id) {
           
            await ImageProduct.create({
              product_id: produto.id,
              enabled: true,
              path: img.content
            });
          } else if (img.content && img.id) {
           
            await ImageProduct.update(
              { path: img.content },
              { where: { id: img.id, product_id: produto.id } }
            );
          }
        }
      }

      
      if (Array.isArray(options)) {
        for (const opt of options) {
          if (opt.deleted && opt.id) {
            await OptionProduct.destroy({ where: { id: opt.id, product_id: produto.id } });
          } else if (opt.id) {
        
            await OptionProduct.update(
              {
                title: opt.title,
                shape: opt.shape,
                radius: opt.radius,
                type: opt.type,
                values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values
              },
              { where: { id: opt.id, product_id: produto.id } }
            );
          } else {
            
            await OptionProduct.create({
              product_id: produto.id,
              title: opt.title,
              shape: opt.shape || 'square',
              radius: opt.radius || 0,
              type: opt.type || 'text',
              values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values
            });
          }
        }
      }

      return res.status(204).send();

    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao atualizar produto.' });
    }
  },

  
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const produto = await Product.findByPk(id);
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

      await produto.destroy();
      return res.status(204).send();

    } catch (err) {
      return res.status(400).json({ erro: 'Erro ao deletar produto.' });
    }
  }
};
