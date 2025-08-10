import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { RemoveLastDot } from "../src/types/object-to-dot-notation";

describe("RemoveLastDot", () => {
	test("should return the same string when there is no dot", () => {
		type NoDot = RemoveLastDot<"hello">;
		expectTypeOf<NoDot>().toEqualTypeOf<"hello">();

		type EmptyString = RemoveLastDot<"">;
		expectTypeOf<EmptyString>().toEqualTypeOf<"">();

		type SingleWord = RemoveLastDot<"world">;
		expectTypeOf<SingleWord>().toEqualTypeOf<"world">();
	});

	test("should remove the last segment when there is a single dot", () => {
		type SingleDot = RemoveLastDot<"hello.world">;
		expectTypeOf<SingleDot>().toEqualTypeOf<"hello">();

		type ShortSegments = RemoveLastDot<"a.b">;
		expectTypeOf<ShortSegments>().toEqualTypeOf<"a">();

		type NumberLikeSegments = RemoveLastDot<"field1.field2">;
		expectTypeOf<NumberLikeSegments>().toEqualTypeOf<"field1">();
	});

	test("should remove only the last segment when there are multiple dots", () => {
		type TwoDots = RemoveLastDot<"hello.world.foo">;
		expectTypeOf<TwoDots>().toEqualTypeOf<"hello.world">();

		type ThreeDots = RemoveLastDot<"a.b.c.d">;
		expectTypeOf<ThreeDots>().toEqualTypeOf<"a.b.c">();

		type ManyDots = RemoveLastDot<"level1.level2.level3.level4.level5">;
		expectTypeOf<ManyDots>().toEqualTypeOf<"level1.level2.level3.level4">();
	});

	test("should handle edge cases with dots at various positions", () => {
		type TrailingDot = RemoveLastDot<"hello.">;
		expectTypeOf<TrailingDot>().toEqualTypeOf<"hello">();

		type LeadingDot = RemoveLastDot<".hello">;
		expectTypeOf<LeadingDot>().toEqualTypeOf<"">();

		type OnlyDot = RemoveLastDot<".">;
		expectTypeOf<OnlyDot>().toEqualTypeOf<"">();

		type MultipleDots = RemoveLastDot<"...">;
		expectTypeOf<MultipleDots>().toEqualTypeOf<"..">();

		type DotsWithEmptySegments = RemoveLastDot<"a..b">;
		expectTypeOf<DotsWithEmptySegments>().toEqualTypeOf<"a.">();
	});
});
