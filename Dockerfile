# syntax=docker/dockerfile:1

# ==========================
# Build Stage
# ==========================
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production

# ==========================
# Artifact Stage
# ==========================
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/dist/inventory-ui ./