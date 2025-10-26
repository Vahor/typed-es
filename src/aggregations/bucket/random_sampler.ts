import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { IsNumericLiteral, Prettify } from "../../types/helpers";

/**
 * Error type for invalid `probability` values in `random_sampler` aggregation.
 */
type InvalidProbabilityError<P> = {
	error: `Invalid probability value '${P extends number ? P : "unknown"}'. The probability must be greater than 0, less than 0.5, or exactly 1.`;
	received: P;
	expected: "0 < probability < 0.5 or probability === 1";
};

/**
 * Validates the `probability` parameter for `random_sampler` aggregation.
 *
 * The probability must be:
 * - Greater than 0
 * - Less than 0.5, OR exactly 1
 *
 * @template P - The probability value to validate
 */
type ValidateProbability<P> = IsNumericLiteral<P> extends true
	? P extends 1
		? true
		: P extends number
			? `${P}` extends `0.${string}`
				? `${P}` extends `0.${infer D}${string}`
					? D extends "5" | "6" | "7" | "8" | "9"
						? false
						: true
					: true
				: `${P}` extends `-${string}`
					? false
					: `${P}` extends "0"
						? false
						: false
			: false
	: true; // Allow non-literal numbers (variables) to pass through

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-random-sampler-aggregation
 */
export type RandomSamplerAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { random_sampler: { probability: infer P } }
	? ValidateProbability<P> extends true
		? Prettify<
				{
					doc_count: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>
		: InvalidProbabilityError<P>
	: Agg extends { random_sampler: object }
		? Prettify<
				{
					doc_count: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>
		: never;
