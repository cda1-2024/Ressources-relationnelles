help:
	@echo cmig:
	@echo 	npm run typeorm:create-migration
	@echo runmig:
	@echo 	npm run typeorm:run-migrations
	@echo revmig:
	@echo 	npm run typeorm:revert-migrations
	@echo fixtures:
	@echo 	npm run fixtures:apply
	@echo drop:
	@echo 	npm run typeorm:drop-schema
	@echo reset:
	@echo 	make drop
	@echo 	make runmig
	@echo 	make fixtures
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