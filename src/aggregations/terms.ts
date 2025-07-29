import type { ExtractAggs, SearchRequest } from "..";
import type { PrettyArray } from "../types/helpers";

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
