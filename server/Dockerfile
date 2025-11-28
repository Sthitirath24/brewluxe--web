FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm install --production || true

# Copy source
COPY . /app

# Ensure the DB file is writable in /app
VOLUME ["/app/brewluxe.db"]

EXPOSE 3000

CMD ["node", "server.js"]
