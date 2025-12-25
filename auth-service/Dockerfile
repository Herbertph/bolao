# ============================
# BUILD STAGE
# ============================
FROM node:20-alpine AS build

WORKDIR /app

# Instala todas as dependências (inclui dev)
COPY package*.json ./
RUN npm install

# Copia o código e compila
COPY . .
RUN npm run build


# ============================
# RUNTIME STAGE
# ============================
FROM node:20-alpine

WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm install --production

# Copia somente o build final
COPY --from=build /app/dist ./dist

EXPOSE 5001
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
