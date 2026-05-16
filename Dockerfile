# Base image
FROM node:20-alpine

WORKDIR /app

# Install dependencies separately to utilize caching
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the application
COPY . .

# Expose the Vite port
EXPOSE 5173

# Default command for development (HMR)
# Note: Host is set to 0.0.0.0 to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
