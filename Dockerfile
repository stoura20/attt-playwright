# Utilise l'image officielle Playwright avec tous les navigateurs et libs
FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

# Copier fichiers dépendances
COPY package.json package-lock.json ./

# Installer dépendances
RUN npm install

# Copier le reste du code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
