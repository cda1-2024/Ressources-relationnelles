ARG NODE_VERSION=22.14.0-alpine

# Use a lightweight Node.js image for building (customizable via ARG)
FROM node:${NODE_VERSION} AS builder

RUN apk add --no-cache bash

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g http-server

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN npm ci

# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application
RUN npm run build

RUN chmod +x ./run.sh ./wait-for-it.sh

RUN find . -type f -name "*.sh" -exec dos2unix {} \;

EXPOSE 4200
