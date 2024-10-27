const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

// Configuração básica
const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.kh8vv.mongodb.net/app-data?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

// Definir o modelo de usuário
const UserSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    hashed_password: { type: String, required: true },
    area: { type: String },
    interesse: { type: String },
    descricao: { type: String },
    estado: { type: String }, // Campo para estado
    cidade: { type: String }, // Campo para cidade
    matches: { type: Array, default: [] },
  },
  { collection: "users" }
);

// Criar o modelo de usuário
const User = mongoose.model("user", UserSchema);

// Rota para obter todos os perfis de usuários
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Erro ao obter perfis:", error);
    res.status(500).json({ error: "Erro ao obter perfis." });
  }
});

// Rota de cadastro
app.post("/register", async (req, res) => {
  const {
    nome,
    email,
    senha,
    area,
    interesse,
    descricao,
    estado,
    cidade,
    matches,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "O email já está em uso." });
  }

  const hashed_password = await bcrypt.hash(senha, 10);

  try {
    const newUser = new User({
      nome,
      email,
      hashed_password,
      area,
      interesse,
      descricao,
      estado, // Adicionar estado
      cidade, // Adicionar cidade
      matches,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(senha, user.hashed_password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign({ id: user._id }, "seu_segredo", {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id }); // Retorna o token e o ID do usuário
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// Rota para dar "match" (adicionar usuário aos matches de outro)
// app.post("/match", async (req, res) => {
//   const { userId, matchId } = req.body;

//   try {
//     // Verifica se os IDs são válidos antes de criar ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(userId) ||
//       !mongoose.Types.ObjectId.isValid(matchId)
//     ) {
//       return res.status(400).json({ error: "IDs inválidos." });
//     }

//     // Busca o usuário pelo userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "Usuário não encontrado." });
//     }

//     // Adiciona o match à lista de matches do usuário
//     if (!user.matches.includes(matchId)) {
//       user.matches.push(matchId);
//       await user.save();
//     }

//     res.json({ message: "Match adicionado com sucesso!" });
//   } catch (error) {
//     console.error("Erro ao dar match:", error);
//     res.status(500).json({ error: "Erro ao dar match." });
//   }
// });

// Iniciar o servidor
app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
