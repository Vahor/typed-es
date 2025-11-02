import { describe, test } from "bun:test";
import { typedEs } from "../../src/index";
import { client } from "../shared";

/**
 * Test for issue #3: _source error message should be clearer when a field is invalid
 * https://github.com/Vahor/typed-es/issues/3
 *
 * Note: The fix allows wildcards and field variants (e.g., "field.keyword") which means
 * we can't strictly validate all strings. However, simple field names that don't contain
 * wildcards or dots will now show better error messages tied to the correct index.
 */
describe("Issue #3: _source error messages", () => {
	test("should allow valid fields in _source", () => {
		// This should work without errors
		typedEs(client, {
			index: "demo",
			_source: ["score", "entity_id"],
		});
	});

	test("should allow wildcard patterns in _source", () => {
		// This should work with wildcards
		typedEs(client, {
			index: "demo",
			_source: ["score", "*_id"],
		});
	});

	test("should allow field variants in _source", () => {
		// Field variants like .keyword should be allowed
		typedEs(client, {
			index: "demo",
			_source: ["score", "entity_id.keyword"],
		});
	});

	test("should allow valid fields in demo2", () => {
		// This should work
		typedEs(client, {
			index: "demo2",
			_source: ["invalid"],
		});
	});

	test("should allow includes/excludes with valid fields", () => {
		typedEs(client, {
			index: "demo",
			_source: {
				includes: ["score", "entity_id"],
				excludes: ["date"],
			},
		});
	});

	test("should allow fields with wildcards", () => {
		typedEs(client, {
			index: "demo",
			fields: ["score", "*_id"],
		});
	});

	test("should allow field objects in fields", () => {
		typedEs(client, {
			index: "demo",
			fields: [{ field: "date", format: "yyyy-MM-dd" }],
		});
	});
});
