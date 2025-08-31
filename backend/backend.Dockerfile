FROM node:23-alpine3.20

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN chmod +x ./run.sh ./wait-for-it.sh

RUN find . -type f -name "*.sh" -exec dos2unix {} \;

EXPOSE 3000