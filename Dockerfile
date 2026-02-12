FROM node:18-alpine

WORKDIR /app

# Instala dependências do sistema necessárias para build de deps nativos (se houver)
RUN apk add --no-cache python3 make g++

COPY package.json ./

# Força instalação limpa sem package-lock (pra evitar treta de versão local vs server)
# E garante que as devDependencies (Tailwind) sejam instaladas para o build
RUN npm install

COPY . .

# Build do Vite (Gera dist/)
RUN npm run build

# Remove deps de dev para ficar leve na produção
RUN npm prune --production

EXPOSE 3000

CMD ["node", "server.js"]