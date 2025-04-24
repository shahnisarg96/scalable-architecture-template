FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the TypeScript code
RUN npm run build

# Run
CMD [ "node", "dist/server.js" ]