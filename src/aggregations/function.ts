import type { ExtractAggs, RequestedIndex, SearchRequest } from "..";

type ExtractAggField<Agg> = {
	[K in keyof Agg]: {
		[Fn in Extract<keyof Agg[K], AggFunction>]: Agg[K][Fn] extends {
			field: infer F;
		}
			? { fn: Fn; field: F }
			: never;
	}[Extract<keyof Agg[K], AggFunction>];
}[keyof Agg];
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
	Index = RequestedIndex<Query>,
	Agg = ExtractAggField<ExtractAggs<Query>>,
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
