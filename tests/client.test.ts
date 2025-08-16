import { describe, expectTypeOf, test } from "bun:test";
import { typedEs } from "../src/index";
import { client } from "./shared";

const query = typedEs(client, {
	index: "demo",
	_source: false,
});

describe("Client", () => {
	describe("transport options are respected", () => {
		describe("search", () => {
			test("with meta", async () => {
				type Result = Awaited<
					ReturnType<typeof client.search<typeof query, { meta: true }>>
				>;
				expectTypeOf<Result>().toHaveProperty("body");
				expectTypeOf<Result>().toHaveProperty("statusCode");
				expectTypeOf<Result>().toHaveProperty("headers");
			});
			test("without meta", async () => {
				type Result = Awaited<
					ReturnType<typeof client.search<typeof query, { meta: false }>>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
			test("without explicit options", async () => {
				type Result = Awaited<ReturnType<typeof client.search<typeof query>>>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
		});

		describe("asyncSearch.get", () => {
			test("with meta", async () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.get<typeof query, { meta: true }>
					>
				>;
				expectTypeOf<Result>().toHaveProperty("body");
				expectTypeOf<Result>().toHaveProperty("statusCode");
				expectTypeOf<Result>().toHaveProperty("headers");
			});
			test("without meta", async () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.get<typeof query, { meta: false }>
					>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
			test("without explicit options", async () => {
				type Result = Awaited<
					ReturnType<typeof client.asyncSearch.get<typeof query>>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
		});
	});
});
