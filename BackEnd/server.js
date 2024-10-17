const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

// Configuração básica
const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB com verificação de erros
mongoose.connect('mongodb+srv://admin:admin@cluster0.kh8vv.mongodb.net/app-data?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
});

// Definir o modelo de usuário
const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    hashed_password: { type: String, required: true },
    area: { type: String },
    interesse: { type: String },
    descricao: { type: String },
    matches: { type: Array, default: [] }
}, { collection: 'users' });  // Especifica a coleção "users"

// Criar o modelo de usuário
const User = mongoose.model('User', UserSchema);

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { nome, email, senha, area, interesse, descricao } = req.body;

    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'O email já está em uso.' });
    }

    // Criptografar a senha
    const hashed_password = await bcrypt.hash(senha, 10);

    try {
        const newUser = new User({
            nome,
            email,
            hashed_password,
            area,
            interesse,
            descricao,
        });

        // Salvar o usuário na coleção "users"
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Encontrar usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Comparar a senha inserida com a senha criptografada
        const isMatch = await bcrypt.compare(senha, user.hashed_password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta.' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: user._id }, 'seu_segredo', { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ error: 'Erro ao realizar login.' });
    }
});

// Iniciar o servidor
app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
