const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const GLM_API_KEY = process.env.GLM_API_KEY || '3426673eebda4070a78bf8bbbf53509d.m87S46cq1QO6P8Qj';
const GLM_API_URL = process.env.GLM_API_URL || 'https://api.z.ai/api/coding/paas/v4';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      {
        role: 'system',
        content: 'Voce e um agente de atendimento escolar, especializado em ajudar alunos, pais e professores. Responda de forma clara, amigavel e educada. Pode ajudar com matriculas, notas, horarios, duvidas sobre materias e informacoes gerais da escola.'
      },
      ...history,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post(
      `${GLM_API_URL}/chat/completions`,
      {
        model: 'glm-4.7',
        messages: messages
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
    console.error('Erro ao chamar GLM-4.7:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar sua mensagem. Tente novamente.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`GLM-4.7 API configurada`);
});