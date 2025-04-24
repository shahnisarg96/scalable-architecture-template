FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema separately before generate
COPY prisma ./prisma

# Generate Prisma Client (must come AFTER schema is copied & npm install)
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Build the TypeScript code
RUN npm run build

# Copy generated client into `dist` to match import paths
RUN mkdir -p dist/generated/prisma-client && \
    cp -r prisma/generated/prisma-client/* dist/generated/prisma-client/