
# Use Node.js 22
FROM node:22-alpine

# Application directory
WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./

RUN npm ci --omit=dev

# Copy application source
COPY . .

# Run as a non-root user
USER node

EXPOSE 5000

CMD ["npm", "start"]
