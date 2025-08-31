set -e
./wait-for-it.sh database:3306 -t 60 --strict
npm run typeorm migration:run -- -d ./src/configuration/data-source.ts
node dist/main