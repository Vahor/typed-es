import type { ExtractAggs, RequestedIndex, SearchRequest } from "..";

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
	Query extends SearchRequest,
	Indexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
	Agg = ExtractAggField<ExtractAggs<Query>[Key]>,
> = Agg extends { fn: string; field: string }
	? {
			value: Agg["fn"] extends AggFunctionsNumber
				? number
				: Agg["fn"] extends "stats"
					? {
							count: number;
							min: number;
							max: number;
							avg: number;
							sum: number;
						}
					: // @ts-expect-error: Index should be in keyof Indexes, This is fine
						TypeOfField<Agg["field"], Indexes, Index>;
		}
	: never;
