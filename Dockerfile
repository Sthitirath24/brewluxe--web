FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy backend package manifest and install dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

# Copy the entire repository into the image (includes coffee.html)
COPY . /app

EXPOSE 3000

ENV NODE_ENV=production

# Start the server which now also serves the static frontend
CMD ["node", "server/server.js"]
