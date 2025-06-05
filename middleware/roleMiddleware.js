exports.isEditor = (req, res, next) => {
    if (req.user.role !== 'editor') {
      return res.status(403).json({ message: "Acesso restrito aos editores." });
    }
    next();
  };
  
  exports.isReviewer = (req, res, next) => {
    if (req.user.role !== 'reviewer') {
      return res.status(403).json({ message: "Acesso restrito aos profissionais de saúde (revisores)." });
    }
    next();
  };
  