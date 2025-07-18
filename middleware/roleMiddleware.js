// Verifica se o utilizador é "editor"
const isEditor = (req, res, next) => {
  if (req.user.role !== "editor") {
    return res.status(403).json({ message: "Acesso restrito aos editores." });
  }
  next();
};

// Verifica se o utilizador é "profissional"
const isReviewer = (req, res, next) => {
  if (req.user.role !== "profissional") {
    return res.status(403).json({ message: "Acesso restrito aos profissionais de saúde (revisores)." });
  }
  next();
};

// Público geral não precisa de middleware
// Utiliza rotas públicas sem autenticação, ou apenas com `authMiddleware` se necessário

module.exports = {
  isEditor,
  isReviewer,
};
