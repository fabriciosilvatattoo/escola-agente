import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
const GLM_API_KEY = process.env.GLM_API_KEY || '3426673eebda4070a78bf8bbbf53509d.m87S46cq1QO6P8Qj';
const GLM_API_URL = process.env.GLM_API_URL || 'https://api.z.ai/api/coding/paas/v4';
const JWT_SECRET = process.env.JWT_SECRET || 'escola-nexus-secret-2026';

// Conexão Postgres
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'escola',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '9c178312ab630fab4c92fd2c7aaff71f', // Senha descoberta
});

// Inicializar tabelas
const initDB = async () => {
  try {
    const client = await pool.connect();

    // Tabela Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tabela Modules
    await client.query(`
        CREATE TABLE IF NOT EXISTS modules (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          cover_image VARCHAR(500),
          created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    // Tabela Lessons
    await client.query(`
        CREATE TABLE IF NOT EXISTS lessons (
          id SERIAL PRIMARY KEY,
          module_id INT REFERENCES modules(id),
          title VARCHAR(255) NOT NULL,
          content TEXT,
          video_url VARCHAR(500),
          order_num INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log('📦 Banco de dados inicializado com sucesso!');
    client.release();
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
    // Não crashar o app se o banco não conectar (pode ser delay do container)
  }
};

initDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware de Autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rotas de Auth
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// Chat API (Mantendo a existente, mas melhorada)
app.post('/api/chat', async (req, res) => {
  // TODO: Adicionar autenticação aqui depois
  try {
    const { message, history = [] } = req.body;

    const messages = [
      {
        role: 'system',
        content: `Você é um tutor inteligente da Escola NEXUS. 
Seu objetivo é ajudar o aluno a aprender. 
Seja encorajador, didático e prático.
Use emojis ocasionalmente.
Se não souber algo, diga que vai pesquisar.`
      },
      ...history.slice(-6), // Limitar histórico
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      `${GLM_API_URL}/chat/completions`,
      {
        model: 'glm-4.7',
        messages: messages,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GLM_API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({
      success: true,
      reply: reply
    });
  } catch (error) {
    console.error('Erro GLM:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar mensagem.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});