/**
 * Change Point aggregation - detects spikes, dips, and distribution changes in time-based data.
 *
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-change-point-aggregation
 */
export type ChangePointAggs<Agg> = Agg extends {
	change_point: {
		buckets_path: unknown;
	};
}
	? {
			bucket?: {
				key: string | number;
			};
			type?: {
				dip?: {
					p_value: number;
				};
				spike?: {
					p_value: number;
				};
				stationary?: Record<string, never>;
				step_change?: {
					p_value: number;
				};
				distribution_change?: {
					p_value: number;
				};
				trend_change?: {
					p_value: number;
					change_point: number;
				};
				non_stationary?: {
					p_value: number;
					trend?: string;
				};
			};
		}
	: never;
