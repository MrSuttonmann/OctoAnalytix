import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { Env } from 'types';
import { D1QB } from 'workers-qb';
import { Context } from 'interfaces';
import { authenticateUser, AuthLogin, AuthRegister } from 'auth';

export const router = OpenAPIRouter({
	schema: {
		info: {
			title: "OctoAnalytix API",
			version: "1.0",
		},
		security: [
			{
				bearerAuth: []
			}
		]
	},
	docs_url: "/",
});

router.registry.registerComponent('securitySchemes', 'bearerAuth', {
	type: 'http',
	scheme: 'bearer'
});

// Endpoints that don't require auth
router.post("/api/auth/register", AuthRegister);
router.post("/api/auth/login", AuthLogin);

// Authentication middleware
router.all('/api/*',  authenticateUser);

// Endpoints that require auth

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: async (request: Request, env: Env, executionContext: ExecutionContext) => {
		// Inject query builder in every endpoint
		const qb = new D1QB(env.DB);
		qb.setDebugger(true);
		return router.handle(request, env, {
			executionContext,
			qb
		} satisfies Context);
	}
};
