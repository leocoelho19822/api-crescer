const Article = require('../models/Article');
const User = require('../models/User');

// Criar artigo (editor)
exports.createArticle = async (req, res) => {
  try {
    const { title, summary, category, subcategory, content, imageUrl, status } = req.body;

    const article = await Article.create({
      title,
      summary,
      category,
      subcategory,
      content,
      imageUrl,
      status: status || 'draft',
      authorId: req.user.id,
    });

    res.status(201).json({ message: "Artigo criado com sucesso.", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar artigo.", error: error.message });
  }
};

// Listar todos os artigos
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar artigos.", error: error.message });
  }
};

// Buscar artigo por ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reviewer', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado." });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar artigo.", error: error.message });
  }
};

// Aprovar artigo (revisor)
exports.approveArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado." });
    }

    article.status = 'approved';
    article.reviewerId = req.user.id;
    article.reviewedAt = new Date();

    await article.save();

    res.status(200).json({ message: "Artigo aprovado com sucesso.", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao aprovar artigo.", error: error.message });
  }
};

// Atualizar artigo (editor)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, category, subcategory, content, imageUrl, status } = req.body;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado." });
    }

    if (article.authorId !== req.user.id) {
      return res.status(403).json({ message: "Não autorizado a editar este artigo." });
    }

    Object.assign(article, { title, summary, category, subcategory, content, imageUrl, status });

    await article.save();

    res.status(200).json({ message: "Artigo atualizado com sucesso.", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar artigo.", error: error.message });
  }
};

// Deletar artigo (editor)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado." });
    }

    if (article.authorId !== req.user.id) {
      return res.status(403).json({ message: "Não autorizado a deletar este artigo." });
    }

    if (article.status === 'approved') {
      return res.status(403).json({ message: "Não é possível apagar artigos aprovados." });
    }

    await article.destroy();

    res.status(200).json({ message: "Artigo deletado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar artigo.", error: error.message });
  }
};
