# Image officielle Playwright basée sur Ubuntu focal (avec tous les navigateurs et libs)
FROM mcr.microsoft.com/playwright:focal

# Répertoire de travail dans le container
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste des fichiers (ton server.js, etc.)
COPY . .

# Exposer le port que ton serveur utilise
EXPOSE 3000

# Commande pour démarrer ton serveur Node.js
CMD ["node", "server.js"]
