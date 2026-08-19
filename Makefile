
DOCKER := docker compose

api:
	@${DOCKER} up -d api

db:
	@${DOCKER} up -d db

tests: api
	@${DOCKER} exec api npm test

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

prisma.generate:
	@${DOCKER} run --rm npx prisma generate

prisma.push:
	@${DOCKER} run --rm npx prisma db push

prisma.pull:
	@${DOCKER} run --rm npx prisma db pull
