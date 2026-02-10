# 🎓 Agente Escolar com GLM-4.7

> Site de escola online com agente inteligente usando API GLM-4.7

---

## 📋 O que tem

- **Frontend:** React + Vite (interface da escola)
- **Backend:** Node.js (API do agente)
- **Agente:** GLM-4.7 (API de codificação)
- **Deploy:** Docker Swarm na VPS
- **Upload de arquivos:** MinIO

---

## 🚀 Como usar

### Desenvolvimento local
```bash
npm install
npm run dev
```

### Deploy na VPS
```bash
# Buildar imagem
docker build -t escola-agente:latest .

# Deploy no Swarm
docker stack deploy -c docker-compose-stack.yml escola-agente
```

---

## 🔧 Configurações

GLM-4.7 API Key configurada via variável de ambiente:
```env
GLM_API_KEY=3426673eebda4070a78bf8bbbf53509d.m87S46cq1QO6P8Qj
GLM_API_URL=https://api.z.ai/api/coding/paas/v4
```

---

## 🌐 Acesso

- **Dev:** http://localhost:5173
- **Produção:** http://escola.insn.online
- **Agente GLM-4.7:** Integrado no chat

---

## 📦 Tecnologias

- React 18
- Vite 5
- Node.js 18
- Docker Swarm
- Traefik (SSL automático)
- GLM-4.7 (Agente inteligente)