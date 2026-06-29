# ==========================
# Build Stage
# ==========================
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production

# ==========================
# Runtime Stage
# ==========================
FROM nginx:1.27-alpine

COPY --from=builder /app/dist/inventory-ui /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]