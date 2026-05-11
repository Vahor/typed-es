import type { Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-derivative-aggregation
 */
export type Derivative<Agg> = Agg extends {
	derivative: infer Derivative extends { buckets_path: string };
}
	? Prettify<
			{
				value: number;
				value_as_string?: string;
			} & (Derivative extends { unit: string }
				? { normalized_value: number }
				: { normalized_value?: number })
		>
	: never;
