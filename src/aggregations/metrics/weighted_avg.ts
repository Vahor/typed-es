import type {
	AggregationFieldResult,
	AggregationFieldTypeResult,
	ElasticsearchIndexes,
} from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation
 */
export type WeightedAvg<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	weighted_avg: {
		value: {
			field?: infer ValueField extends string;
			script?: string;
		};
		weight: {
			field?: infer WeightField extends string;
			script?: string;
		};
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			AggregationFieldResult<
				E,
				Index,
				Agg,
				AggregationFieldTypeResult<
					E,
					Index,
					Agg,
					number,
					AggregationFieldTypeResult<
						E,
						Index,
						Agg,
						number | Array<number>,
						{
							value: number;
							value_as_string?: string;
						},
						ValueField
					>,
					WeightField
				>,
				WeightField
			>,
			ValueField
		>
	: never;
