import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	TypeOfField,
} from "..";

type ExtractAggField<Agg> = {
	[Fn in Extract<keyof Agg, AggFunction>]: Agg[Fn] extends {
		field: infer F;
	}
		? { fn: Fn; field: F }
		: never;
}[Extract<keyof Agg, AggFunction>];
type AggFunctionsNumber =
	| "sum"
	| "avg"
	| "max"
	| "min"
	| "value_count"
	| "cardinality";

export type AggFunction = AggFunctionsNumber;

export type FunctionAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
	FieldAgg = ExtractAggField<Agg>,
> = FieldAgg extends { fn: string; field: infer Field extends string }
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				value_as_string?: string;
				value: FieldAgg["fn"] extends AggFunctionsNumber
					? number
					: TypeOfField<FieldAgg["field"], E, Index>;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
