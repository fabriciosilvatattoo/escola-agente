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
  password: process.env.DB_PASSWORD || '9c178312ab630fab4c92fd2c7aaff71f',
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

    // Tabela Posts (Feed)
    await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            content TEXT NOT NULL,
            likes_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log('📦 Banco de dados inicializado com sucesso!');
    client.release();
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
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

// --- ROTAS AUTH ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos' });

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
    if (err.code === '23505') return res.status(400).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Email ou senha incorretos' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Email ou senha incorretos' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// --- ROTAS DA ESCOLA (Módulos e Aulas) ---

const seedModules = async () => {
  try {
    const countRes = await pool.query('SELECT COUNT(*) FROM modules');
    if (parseInt(countRes.rows[0].count) === 0) {
      console.log('🌱 Seeding modules...');
      const modRes = await pool.query(`
             INSERT INTO modules (title, description, cover_image) VALUES 
             ('Fundamentos da Tatuagem', 'Tudo o que você precisa saber para começar.', 'https://placehold.co/600x400/667eea/ffffff?text=Fundamentos')
             RETURNING id
           `);
      const modId = modRes.rows[0].id;
      await pool.query(`
             INSERT INTO lessons (module_id, title, content, video_url, order_num) VALUES 
             ($1, 'Introdução aos Materiais', '# Materiais Necessários\n\nNesta aula vamos ver tudo sobre agulhas, máquinas e tintas.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
             ($1, 'Higiene e Biossegurança', '# Segurança Primeiro\n\nComo montar sua bancada de forma segura.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2)
           `, [modId]);
    }
  } catch (e) { console.error('Seed error:', e); }
};
// Executar seed depois do initDB
setTimeout(seedModules, 5000);

app.get('/api/modules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM modules ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar módulos' });
  }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const modResult = await pool.query('SELECT * FROM modules WHERE id = $1', [id]);
    if (modResult.rows.length === 0) return res.status(404).json({ error: 'Módulo não encontrado' });

    const lessonsResult = await pool.query('SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_num ASC, id ASC', [id]);
    res.json({ module: modResult.rows[0], lessons: lessonsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

app.get('/api/lessons/:id', authenticateToken, async (req, res) => { // Proteger aula
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aula não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
});

// --- ROTAS DO FEED ---

app.get('/api/feed', async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT p.*, u.name as author_name 
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC 
        LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar feed' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Conteúdo vazio' });

    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [req.user.id, content]
    );
    // Buscar nome do usuario para retornar
    const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const post = result.rows[0];
    post.author_name = userRes.rows[0]?.name || 'Usuário';

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// --- CHAT API ---

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      {
        role: 'system',
        content: `Você é um tutor inteligente da Escola NEXUS e especialista em Tatuagem.
Ajude os alunos com dúvidas técnicas, artísticas e sobre o curso.
Seja encorajador.`
      },
      ...history.slice(-6),
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      `${GLM_API_URL}/chat/completions`,
      { model: 'glm-4.7', messages: messages, temperature: 0.7 },
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GLM_API_KEY}` } }
    );
    res.json({ success: true, reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Erro GLM:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao processar mensagem.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});