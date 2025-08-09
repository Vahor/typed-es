type ReplaceStarWithString<T extends string> =
	T extends `${infer Left}*${infer Right}`
		? `${Left}${string}${ReplaceStarWithString<Right>}`
		: T;
type MatchesWildcard<
	W extends string,
	Pattern extends string,
> = W extends ReplaceStarWithString<Pattern> ? true : false;

export type WildcardSearch<Words, Search> = Words extends infer W extends string
	? Search extends infer S extends string
		? MatchesWildcard<W, S> extends true
			? W
			: never
		: never
	: never;
