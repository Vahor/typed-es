import type {
	ElasticsearchIndexes,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IfFieldCanBeUsedInAggregation, IsSomeSortOf } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-ttest-aggregation
 */
export type TTestAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	t_test: {
		a?: infer TA;
		b?: infer TB;
	};
}
	// Extract field names, defaulting to `never` if not provided.
	// This handles cases where `a`, `b`, or their `field` properties are missing.
	? type FieldA = TA extends { field: infer F extends string } ? F : never;
	  type FieldB = TB extends { field: infer F extends string } ? F : never;

	  // Local helper type to check if a field is numeric for the t-test aggregation.
	  type CheckFieldIsNumeric<Field extends string, TSuccess> = IsSomeSortOf<
			TypeOfField<Field, E, Index>,
			number
		> extends true
			? TSuccess
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					"t-test",
					TypeOfField<Field, E, Index>,
					number
				>;

	  // Sequentially validate FieldA and FieldB using the helpers.
	  IfFieldCanBeUsedInAggregation<
			FieldA,
			Index,
			't-test',
			// If FieldA is valid, check if it's numeric.
			CheckFieldIsNumeric<
				FieldA,
				// If FieldA is also numeric, validate FieldB.
				IfFieldCanBeUsedInAggregation<
					FieldB,
					Index,
					't-test',
					// If FieldB is valid, check if it's numeric.
					CheckFieldIsNumeric<
						FieldB,
						// If all checks pass, define the aggregation result type.
						{ value: number }
					>,
					E
				>
			>,
			E
		>
	: never;