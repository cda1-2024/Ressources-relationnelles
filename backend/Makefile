help:
	@echo cmig: create migration
	@echo runmig: run migration
	@echo revmig: revert migration
cmig:
	npm run typeorm:create-migration
runmig:
	npm run typeorm:run-migrations
revmig:
	npm run typeorm:revert-migrations
fixtures:
	npm run fixtures:apply
drop:
	npm run typeorm:drop-schema
reset:
	make drop
	make runmig
	make fixtures