# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npm run build

# --- STAGE 2: Run with Nginx (Reverse Proxy & Asset Management) ---
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create Nginx configuration
RUN echo 'server { \
    listen 5173; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Proxy API requests \
    location /api/ { \
        proxy_pass http://backend:3000/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
    \
    # Proxy Uploads \
    location /uploads/ { \
        proxy_pass http://backend:3000/uploads/; \
        proxy_set_header Host $host; \
    } \
    \
    # Handle /public/ prefix for assets (common in dev code) \
    location /public/ { \
        alias /usr/share/nginx/html/; \
    } \
    \
    # Static Assets Cache \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|map)$ { \
        expires 1y; \
        access_log off; \
        add_header Cache-Control "public"; \
        try_files $uri =404; \
    } \
    \
    # Proxy Socket.IO \
    location /socket.io/ { \
        proxy_pass http://backend:3000/socket.io/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
    \
    # SPA Routing fallback \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]