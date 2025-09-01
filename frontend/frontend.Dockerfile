ARG NODE_VERSION=22.14.0-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:${NODE_VERSION} AS runner
RUN apk add --no-cache bash

WORKDIR /app
RUN npm install -g http-server

COPY --from=builder /app/dist/frontend ./dist
COPY --chmod=555 ./run.sh ./wait-for-it.sh ./
EXPOSE 4200

