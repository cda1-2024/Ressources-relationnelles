@echo off
echo Suppression du schéma...
CALL npm run typeorm schema:drop -- -d src/configuration/data-source-cli.ts

echo Exécution des migrations...
CALL npm run typeorm -- migration:run -d src/configuration/data-source-cli.ts

echo Chargement des fixtures...
CALL npm run fixtures:apply

REM echo Application des fixtures...
REM CALL npm run fixtures load ./src/fixtures/

echo Script terminé !
pause
