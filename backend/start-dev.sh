#!/bin/sh

echo "Applying TypeORM migrations..."
npm run typeorm:run-migrations

# echo "Starting NestJS in watch mode..."
# npm run start:dev