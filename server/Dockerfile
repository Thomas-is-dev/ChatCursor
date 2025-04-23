FROM node:23-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node

EXPOSE 3003

CMD ["ts-node", "index.ts"] 
