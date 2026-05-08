import { Client } from "@elastic/elasticsearch";
import { type TypedClient, typedEs } from "@vahor/typed-es";

type Indexes = {
	products: {
		id: string;
		name: string;
		category: string;
		price: number;
		created_at: string;
	};
};

const client = new Client({
	node: "http://localhost:9200",
}) as unknown as TypedClient<Indexes>;

const query = typedEs(client, {
	index: "products",
	_source: ["id", "name", "*_at"],
	track_total_hits: true,
	rest_total_hits_as_int: true,
	aggs: {
		categories: {
			terms: { field: "category" },
		},
		price_stats: {
			stats: { field: "price" },
		},
	},
});

const result = await client.search(query);

result.hits.total;
//     ^? number

result.hits.hits[0]?._source;
//                  ^? { id: string; name: string; created_at: string }

result.aggregations.categories.buckets;
//                  ^? Array<{ key: string | number; doc_count: number }>

result.aggregations.price_stats.avg;
//                  ^? number | null
