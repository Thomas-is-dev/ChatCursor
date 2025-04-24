FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source files
COPY . .

# Expose the port (optionnel mais utile si tu veux mapper depuis l'extérieur)
EXPOSE 3003

# Start the app (équivalent à "npm run dev")
CMD ["npm", "run", "dev"]
