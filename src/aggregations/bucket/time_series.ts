import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify, PrettyArray } from "../../types/helpers";
import type { BucketBase } from "../helpers";

type TimeSeriesKeyValue = string | number | boolean | null;

export type TimeSeriesKey = Record<string, TimeSeriesKeyValue>;

type TimeSeriesBucket<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
> = Prettify<
	BucketBase & {
		key: TimeSeriesKey;
	} & AppendSubAggs<BaseQuery, E, Index, Agg>
>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-time-series-aggregation
 */
export type TimeSeries<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	time_series: {
		keyed?: infer Keyed;
	};
}
	? Agg extends Record<string, unknown>
		? Keyed extends true
			? {
					buckets: Record<string, TimeSeriesBucket<BaseQuery, E, Index, Agg>>;
				}
			: {
					buckets: PrettyArray<TimeSeriesBucket<BaseQuery, E, Index, Agg>>;
				}
		: never
	: never;
