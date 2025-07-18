const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");  
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");

dotenv.config();
const app = express();

app.use(cookieParser());  

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,  
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes); 

sequelize.sync({ force: false }) 
  .then(() => console.log("Banco de dados sincronizado"))
  .catch((error) => console.error("Erro ao sincronizar o banco de dados:", error));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
