import type { ExtractAggs, PrettyArray, SearchRequest } from "..";

export type TermsAggs<
	Query extends SearchRequest,
	Key extends keyof ExtractAggs<Query>,
> = ExtractAggs<Query>[Key] extends { terms: unknown }
	? {
			buckets: PrettyArray<{
				key: unknown;
				doc_count: number;
			}>;
		}
	: never;
