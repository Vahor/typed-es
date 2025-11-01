import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Extended Stats Bucket Pipeline Aggregation", () => {
	test("docs example: extended stats monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				stats_monthly_sales: {
					extended_stats_bucket: { buckets_path: "sales_per_month>sales" };
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_per_month: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					sales: { value: number; value_as_string?: string };
				}>;
			};
			stats_monthly_sales: {
				count: number;
				min: number;
				max: number;
				avg: number;
				sum: number;
				sum_of_squares: number;
				variance: number;
				variance_population: number;
				variance_sampling: number;
				std_deviation: number;
				std_deviation_population: number;
				std_deviation_sampling: number;
				std_deviation_bounds: {
					upper: number;
					lower: number;
					upper_population: number;
					lower_population: number;
					upper_sampling: number;
					lower_sampling: number;
				};
				min_as_string?: string;
				max_as_string?: string;
				avg_as_string?: string;
				sum_as_string?: string;
				sum_of_squares_as_string?: string;
				variance_as_string?: string;
				variance_population_as_string?: string;
				variance_sampling_as_string?: string;
				std_deviation_as_string?: string;
				std_deviation_population_as_string?: string;
				std_deviation_sampling_as_string?: string;
			};
		}>();
	});
});
