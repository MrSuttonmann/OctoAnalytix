# Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [itty-router-openapi](https://github.com/cloudflare/itty-router-openapi).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [itty-router-openapi official documentation](https://cloudflare.github.io/itty-router-openapi/).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:9000/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.

### Database

This project uses a Cloudflare D1 database, generated and interacted with through Prisma ORM.

To create a migration after modifying the Prisma schema:

1. Run `npx wrangler d1 migrations create octo-db <migration-name>`
2. Run `npx prisma migrate diff --script --to-schema-datamodel ./prisma/schema.prisma -o ./migrations/<migration-file-name>.sql`
3. Run `npx wrangler d1 migrations apply octo-db`
4. Run `npx prisma generate`