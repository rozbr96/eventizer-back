
DOCKER := docker compose

api:
	@${DOCKER} up -d api

db:
	@${DOCKER} up -d db

bash: api
	@${DOCKER} exec api bash

bash.db: db
	@${DOCKER} exec db bash

logs:
	@${DOCKER} logs -f

logs.api:
	@${DOCKER} logs -f api

logs.db:
	@${DOCKER} logs -f db

