FROM node:latest as base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

FROM base as build

COPY . .
RUN npm run build

ENV NODE_ENV production

FROM nginx:latest

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8181 for web traffic
EXPOSE 8181

CMD ["nginx", "-g", "daemon off;"]
