const {DataTypes} = require('sequelize');
const {v4: uuidv4} = require('uuid'); // Importa a geração de UUID
const sequelize = require('../config/database');

const Article = sequelize.define("Article", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING(500), // Limitando o resumo a 500 caracteres
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved'),
      defaultValue: 'draft',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }); 
  
  // Associações com User (editor e revisor)
  const User = require("./User");
  
  Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' }); // Quem criou
  Article.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' }); // Quem aprovou/revisou
  
  module.exports = Article;