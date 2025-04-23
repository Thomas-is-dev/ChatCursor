FROM node:23-slim AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build

COPY . .
RUN npm run build

ENV NODE_ENV=production

FROM nginx:1.27.5-alpine-slim

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8282

CMD ["nginx", "-g", "daemon off;"]
