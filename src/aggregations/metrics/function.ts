import type { ElasticsearchIndexes, TypeOfField } from "../..";
import type { AggregationFieldResult } from "../helpers";

type ExtractAggField<Agg> = {
	[Fn in Extract<keyof Agg, AggFunction>]: Agg[Fn] extends {
		field: infer F;
	}
		? { fn: Fn; field: F }
		: never;
}[Extract<keyof Agg, AggFunction>];

type AggFunctionsNumber = "value_count" | "cardinality";

export type AggFunction = AggFunctionsNumber | "sum" | "avg" | "max" | "min";

export type Function<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
	FieldAgg = ExtractAggField<Agg>,
> = FieldAgg extends { fn: string; field: string }
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				value_as_string?: string;
				value: FieldAgg["fn"] extends AggFunctionsNumber
					? number
					: TypeOfField<FieldAgg["field"], E, Index> extends number
						? number
						: number | string;
			}
		>
	: never;
