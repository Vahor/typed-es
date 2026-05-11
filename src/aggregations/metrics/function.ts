import type { ElasticsearchIndexes, TypeOfField } from "../..";
import type {
	AggregationFieldResult,
	AggregationFieldTypeResult,
} from "../helpers";

type ExtractAggField<Agg> = {
	[Fn in Extract<keyof Agg, AggFunction>]: Agg[Fn] extends {
		field: infer F;
	}
		? { fn: Fn; field: F }
		: never;
}[Extract<keyof Agg, AggFunction>];

type AggFunctionsCount = "value_count" | "cardinality";
type AggFunctionsNumericField = "sum" | "avg";
type AggFunctionsNumericOrDateField = "max" | "min";

export type AggFunction =
	| AggFunctionsCount
	| AggFunctionsNumericField
	| AggFunctionsNumericOrDateField;

type NumericFunctionResult = {
	value_as_string?: string;
	value: number;
};

type FunctionOutput<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
	Fn extends AggFunction,
	Field extends string,
> = Fn extends AggFunctionsNumericField
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			NumericFunctionResult,
			Field
		>
	: AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				value_as_string?: string;
				value: Fn extends AggFunctionsCount
					? number
					: TypeOfField<Field, E, Index> extends number
						? number
						: number | string;
			},
			Field
		>;

export type Function<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
	FieldAgg = ExtractAggField<Agg>,
> = FieldAgg extends {
	fn: infer Fn extends AggFunction;
	field: infer Field extends string;
}
	? FunctionOutput<E, Index, Agg, Fn, Field>
	: never;
