FROM node:23-slim AS base

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Build stage
FROM base AS build

# Copiez les fichiers du client et le dossier shared
COPY . . 

# Construisez l'application
RUN npm run build

# Production stage
FROM nginx:1.28-alpine-slim

# Copy built assets and nginx config
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8282

CMD ["nginx", "-g", "daemon off;"]
