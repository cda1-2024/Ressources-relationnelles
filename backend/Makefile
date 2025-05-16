help:
	@echo cmig
	@echo runmig
	@echo revmig
	@echo fixtures
	@echo drop
	@echo reset
cmig:
	npm run typeorm:generate --name=init
runmig:
	npm run typeorm:run
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