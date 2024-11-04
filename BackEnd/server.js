const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const cors = require("cors");
const base64url = require("base64url");
const jwt = require("jsonwebtoken");

// Configuração básica
const corsOptions = {
  origin: "http://localhost:3000", // Permite apenas esta origem
  credentials: true, // Permite que cookies e credenciais sejam enviados
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

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
    estado: { type: String },
    cidade: { type: String },
    matches: { type: Array, default: [] },
    action: { type: String, default: "" },
  },
  { collection: "users" }
);

// Criar o modelo de usuário
const User = mongoose.model("user", UserSchema);

// Rota para obter todos os perfis de usuários
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

// Rota para obter todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

app.post("/swipe", async (req, res) => {
  const { userId, likedUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    if (!user || !likedUser) {
      return res.status(404).json({ error: "Usuário(s) não encontrado(s)." });
    }

    // Adiciona o likedUserId à lista de matches do user, se ainda não estiver lá
    if (!user.matches.includes(likedUserId)) {
      user.matches.push(likedUserId);
      await user.save();
    }

    // Verifica se o likedUser também deu swipe em userId
    if (likedUser.matches.includes(userId)) {
      // Adiciona o userId à lista de matches do likedUser
      if (!likedUser.matches.includes(userId)) {
        likedUser.matches.push(userId);
        await likedUser.save();
      }

      return res.json({ match: true, message: "É um match!" });
    }

    res.json({ match: false, message: "Swipe registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao processar o swipe:", error);
    res.status(500).json({ error: "Erro ao processar o swipe." });
  }
});

// Rota para registrar usuário
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
    action,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = new User({
      nome,
      email,
      hashed_password: hashedPassword,
      area,
      interesse,
      descricao,
      estado,
      cidade,
      action,
    });

    await user.save();
    res
      .status(201)
      .json({ userId: user._id, message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

// Função para criar JWT usando crypto
const createJWT = (payload, secret) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64url.encode(JSON.stringify(header));
  const encodedPayload = base64url.encode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Rota para fazer login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Senha incorreta." });
    }

    const token = createJWT(
      { userId: user._id },
      process.env.JWT_SECRET || "sua_chave_secreta_aqui"
    );

    res.json({ userId: user._id, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
