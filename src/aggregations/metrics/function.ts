import type { ElasticsearchIndexes, TypeOfField } from "../..";
import type { IsNever } from "../../types/helpers";
import type { AggregationFieldResult } from "../helpers";

type ExtractAggField<Agg> = {
	[Fn in Extract<keyof Agg, AggFunction>]: Agg[Fn] extends {
		field: infer F;
	}
		? { fn: Fn; field: F }
		: Agg[Fn] extends { script: unknown }
			? { fn: Fn; script: unknown }
			: never;
}[Extract<keyof Agg, AggFunction>];

type AggFunctionsNumber = "value_count" | "cardinality";

type FunctionResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Fn,
	Field = never,
> = {
	value_as_string?: string;
	value: Fn extends AggFunctionsNumber
		? number
		: IsNever<Field> extends true
			? number
			: Field extends string
				? TypeOfField<Field, E, Index> extends number
					? number
					: number | string
				: number;
};

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
			FunctionResult<E, Index, FieldAgg["fn"], FieldAgg["field"]>
		>
	: FieldAgg extends { fn: string; script: unknown }
		? FunctionResult<E, Index, FieldAgg["fn"]>
		: never;
