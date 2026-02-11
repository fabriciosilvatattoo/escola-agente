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

const GLM_API_KEY = process.env.GLM_API_KEY || '3426673eebda4070a78bf8bbbf53509d.m87S46cq1QO6P8Qj';
const GLM_API_URL = process.env.GLM_API_URL || 'https://api.z.ai/api/coding/paas/v4';
const JWT_SECRET = process.env.JWT_SECRET || 'escola-nexus-secret-2026';

// Postgres
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'escola',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '9c178312ab630fab4c92fd2c7aaff71f',
});

// ============================================
// DB INIT
// ============================================
const initDB = async () => {
  try {
    const client = await pool.connect();
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        content TEXT NOT NULL,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('📦 DB pronto');
    client.release();
  } catch (err) {
    console.error('Erro DB init:', err.message);
  }
};

// ============================================
// SEED - Dados iniciais
// ============================================
const seedModules = async () => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM modules');
    if (parseInt(rows[0].count) > 0) return;

    console.log('🌱 Seeding dados iniciais...');

    // Módulo 1
    const m1 = await pool.query(
      `INSERT INTO modules (title, description, cover_image) VALUES ($1, $2, $3) RETURNING id`,
      ['Fundamentos da Tatuagem', 'Tudo que você precisa saber para dar os primeiros passos na arte da tatuagem.', 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=400&fit=crop']
    );
    await pool.query(
      `INSERT INTO lessons (module_id, title, content, video_url, order_num) VALUES
       ($1, 'Introdução aos Materiais', 'Nesta aula você vai conhecer todos os materiais essenciais: máquinas rotativas, agulhas cartridge, tintas veganas, grip tape, e como montar seu setup.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
       ($1, 'Higiene e Biossegurança', 'Segurança é prioridade absoluta. Vamos cobrir: autoclave, descartáveis, EPIs, montagem de bancada estéril e protocolos ANVISA.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2),
       ($1, 'Primeiro Traço na Pele Sintética', 'Hora de praticar! Aprenda a tensionar a pele sintética, ângulo correto da agulha, profundidade e velocidade ideal.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 3)`,
      [m1.rows[0].id]
    );

    // Módulo 2
    const m2 = await pool.query(
      `INSERT INTO modules (title, description, cover_image) VALUES ($1, $2, $3) RETURNING id`,
      ['Técnicas de Sombreamento', 'Domine o preto e cinza com técnicas profissionais de whip shading, pepper shading e smooth shading.', 'https://images.unsplash.com/photo-1590246814883-57764a7a69b8?w=600&h=400&fit=crop']
    );
    await pool.query(
      `INSERT INTO lessons (module_id, title, content, video_url, order_num) VALUES
       ($1, 'Whip Shading - Teoria', 'O whip shading é uma técnica onde o movimento do pulso cria degradês suaves. Vamos entender a mecânica por trás do movimento.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
       ($1, 'Pepper Shading na Prática', 'Pontilhismo com máquina rotativa. Aprenda a controlar a densidade dos pontos para criar texturas e volumes realistas.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2)`,
      [m2.rows[0].id]
    );

    // Módulo 3
    const m3 = await pool.query(
      `INSERT INTO modules (title, description, cover_image) VALUES ($1, $2, $3) RETURNING id`,
      ['Colorido e Aquarela', 'Aprenda a trabalhar com cores, mistura de tintas, degradês coloridos e a técnica aquarela na pele.', 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=400&fit=crop']
    );
    await pool.query(
      `INSERT INTO lessons (module_id, title, content, video_url, order_num) VALUES
       ($1, 'Teoria das Cores na Pele', 'A pele é um filtro. Entenda como o tom de pele afeta a cor final da tatuagem e como escolher a paleta certa.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
       ($1, 'Técnica Aquarela', 'Sem contorno, sem limites! Aprenda a criar efeitos de aquarela com splashes de cor e transições suaves.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2)`,
      [m3.rows[0].id]
    );

    console.log('✅ Seed completo: 3 módulos, 7 aulas');
  } catch (e) {
    console.error('Seed error:', e.message);
  }
};

// Init
initDB().then(() => setTimeout(seedModules, 2000));

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token necessário' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos' });
    if (password.length < 6) return res.status(400).json({ error: 'Senha precisa ter no mínimo 6 caracteres' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email já cadastrado' });
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Preencha email e senha' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Email ou senha incorretos' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Email ou senha incorretos' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.get('/api/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ============================================
// MODULES & LESSONS
// ============================================
app.get('/api/modules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM modules ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar módulos' });
  }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const modResult = await pool.query('SELECT * FROM modules WHERE id = $1', [id]);
    if (modResult.rows.length === 0) return res.status(404).json({ error: 'Módulo não encontrado' });
    const lessonsResult = await pool.query('SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_num ASC', [id]);
    res.json({ module: modResult.rows[0], lessons: lessonsResult.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar módulo' });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aula não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
});

// ============================================
// FEED / POSTS
// ============================================
app.get('/api/feed', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as author_name FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar feed' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Conteúdo vazio' });
    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [req.user.id, content.trim()]
    );
    const post = result.rows[0];
    post.author_name = req.user.name || 'Usuário';
    res.json(post);
  } catch (err) {
    console.error('Post error:', err.message);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// ============================================
// CHAT - Normal (fallback)
// ============================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const messages = [
      { role: 'system', content: 'Você é um tutor inteligente da Escola NEXUS, especialista em Tatuagem. Ajude os alunos com dúvidas técnicas, artísticas e sobre o curso. Seja encorajador e conciso.' },
      ...history.slice(-6),
      { role: 'user', content: message }
    ];
    const response = await axios.post(
      `${GLM_API_URL}/chat/completions`,
      { model: 'glm-4.7', messages, temperature: 0.7 },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GLM_API_KEY}` } }
    );
    res.json({ success: true, reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao processar mensagem' });
  }
});

// ============================================
// CHAT - STREAMING (SSE)
// ============================================
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Desabilita buffering no nginx/traefik

  try {
    const { message, history = [] } = req.body;
    const messages = [
      { role: 'system', content: 'Você é um tutor inteligente da Escola NEXUS, especialista em Tatuagem. Ajude os alunos com dúvidas técnicas, artísticas e sobre o curso. Seja encorajador, direto e conciso. Responda em português.' },
      ...history.slice(-6),
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      `${GLM_API_URL}/chat/completions`,
      { model: 'glm-4.7', messages, temperature: 0.7, stream: true },
      {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GLM_API_KEY}` },
        responseType: 'stream',
      }
    );

    response.data.on('data', (chunk) => {
      const text = chunk.toString();
      // Reenvia cada linha do stream diretamente pro cliente
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          res.write(line + '\n');
        }
      }
    });

    response.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    response.data.on('error', (err) => {
      console.error('Stream error:', err.message);
      res.write(`data: {"error": "Stream interrompido"}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('Chat stream error:', error.message);
    res.write(`data: {"error": "Erro ao iniciar stream"}\n\n`);
    res.end();
  }
});

// ============================================
// SPA FALLBACK
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});