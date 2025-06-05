const express = require("express");
const router = express.Router();
const articleController = require("../controllers/ArticleController");
const authMiddleware = require("../middleware/authMiddleware");
const { isEditor, isReviewer } = require("../middleware/roleMiddleware");

// Criar artigo (editor)
router.post("/", authMiddleware, isEditor, articleController.createArticle);

// Listar artigos (qualquer utilizador autenticado)
router.get("/", authMiddleware, articleController.getAllArticles);

// Aprovar artigo (revisor)
router.put("/:id/approve", authMiddleware, isReviewer, articleController.approveArticle);

// Editar artigo (editor autor)
router.put("/:id", authMiddleware, isEditor, articleController.updateArticle);

// Apagar artigo (editor autor)
router.delete("/:id", authMiddleware, isEditor, articleController.deleteArticle);

module.exports = router;
