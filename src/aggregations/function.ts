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

export type AggFunction = "last" | "first" | "stats" | AggFunctionsNumber;

export type FunctionAggs<
	Index extends string,
	Agg,
	FieldAgg = ExtractAggField<Agg>,
> = FieldAgg extends { fn: string; field: string }
	? {
			value: FieldAgg["fn"] extends AggFunctionsNumber
				? number
				: FieldAgg["fn"] extends "stats"
					? {
							count: number;
							min: number;
							max: number;
							avg: number;
							sum: number;
						}
					: // @ts-expect-error: Index should be in keyof Indexes, This is fine
						TypeOfField<FieldAgg["field"], Indexes, Index>;
		}
	: never;
