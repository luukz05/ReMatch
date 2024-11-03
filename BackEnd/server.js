const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Importar o módulo crypto
const mongoose = require("mongoose");
const cors = require("cors");
const base64url = require("base64url"); // Importar a biblioteca base64url

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
    estado: { type: String }, // Campo para estado
    cidade: { type: String }, // Campo para cidade
    matches: { type: Array, default: [] },
    action: { type: String, default: "" }, // Agora é uma string em vez de um array
  },
  { collection: "users" }
);

// Criar o modelo de usuário
const User = mongoose.model("user", UserSchema);

// Rota para obter todos os perfis de usuários
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Obtém o ID da URL
    const user = await User.findById(userId); // Busca o usuário pelo ID
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user); // Retorna os dados do usuário
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários com ação 'Dar':", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// Rota para registrar usuário
app.post("/register", async (req, res) => {
  console.log(req.body); // Adicione esta linha para depuração
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
      matches,
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

    // Usar a função createJWT para gerar o token
    const token = createJWT(
      { userId: user._id },
      process.env.JWT_SECRET || "sua_chave_secreta_aqui"
    ); // Use uma chave secreta segura aqui
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
