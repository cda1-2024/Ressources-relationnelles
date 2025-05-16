@echo off
echo Suppression du schéma...
CALL npm run typeorm:drop-schema

echo Exécution des migrations...
CALL npm run typeorm:run 

echo Chargement des fixtures...
CALL npm run fixtures:apply

REM echo Application des fixtures...
REM CALL npm run fixtures load ./src/fixtures/

echo Script terminé !
pause
