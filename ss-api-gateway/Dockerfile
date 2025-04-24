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

# Copy public keys for JWT verification
COPY keys/public.pem /usr/src/app/dist/keys/public.pem

# Run
CMD [ "node", "dist/server.js" ]