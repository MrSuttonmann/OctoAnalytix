import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { UserCreate } from "endpoints/userCreate";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/users", UserCreate);

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
	fetch: router.handle,
};
