import type { TypedClient } from "../src";

// Define your index structure
type MyIndexes = {
	users: {
		id: string;
		name: string;
		email: string;
		age: number;
		created_at: string;
	};
	posts: {
		id: string;
		title: string;
		content: string;
		author_id: string;
		created_at: string;
		tags: string[];
	};
	comments: {
		id: string;
		post_id: string;
		user_id: string;
		content: string;
		created_at: string;
	};
};

// Example of how to use msearch with the typed client
async function exampleMsearch(client: TypedClient<MyIndexes>) {
	// Perform multiple searches in a single request
	const result = await client.msearch({
		searches: [
			// Search for users with age > 25
			{
				header: { index: "users" },
				body: {
					query: {
						range: {
							age: { gt: 25 }
						}
					},
					_source: ["id", "name", "age"],
					size: 10
				}
			},
			// Search for posts with specific tags
			{
				header: { index: "posts" },
				body: {
					query: {
						terms: {
							tags: ["javascript", "typescript"]
						}
					},
					_source: ["id", "title", "tags"],
					size: 5
				}
			},
			// Search for recent comments
			{
				header: { index: "comments" },
				body: {
					query: {
						range: {
							created_at: {
								gte: "now-7d"
							}
						}
					},
					_source: ["id", "content", "created_at"],
					size: 20
				}
			}
		],
		// Optional msearch options
		allow_no_indices: true,
		ignore_unavailable: true,
		max_concurrent_searches: 3
	});

	// The result will be typed with the correct response types for each search
	console.log(`Total searches: ${result.responses.length}`);
	console.log(`Time taken: ${result.took}ms`);

	// Each response is properly typed
	const usersResponse = result.responses[0];
	const postsResponse = result.responses[1];
	const commentsResponse = result.responses[2];

	// TypeScript will provide full type safety for each response
	if ('hits' in usersResponse) {
		const response = usersResponse as any; // Type assertion for demo purposes
		console.log(`Found ${response.hits.total} users`);
		response.hits.hits.forEach((hit: any) => {
			console.log(`User: ${hit._source.name} (${hit._source.age})`);
		});
	}

	if ('hits' in postsResponse) {
		const response = postsResponse as any; // Type assertion for demo purposes
		console.log(`Found ${response.hits.total} posts`);
		response.hits.hits.forEach((hit: any) => {
			console.log(`Post: ${hit._source.title} - Tags: ${hit._source.tags.join(', ')}`);
		});
	}

	if ('hits' in commentsResponse) {
		const response = commentsResponse as any; // Type assertion for demo purposes
		console.log(`Found ${response.hits.total} comments`);
		response.hits.hits.forEach((hit: any) => {
			console.log(`Comment: ${hit._source.content.substring(0, 50)}...`);
		});
	}
}

// Example without headers (using index in body)
async function exampleMsearchWithoutHeaders(client: TypedClient<MyIndexes>) {
	const result = await client.msearch({
		searches: [
			{
				body: {
					index: "users",
					query: { match: { name: "John" } },
					_source: ["id", "name"]
				}
			},
			{
				body: {
					index: "posts",
					query: { match: { title: "Hello" } },
					_source: ["id", "title"]
				}
			}
		]
	});

	return result;
}

export { exampleMsearch, exampleMsearchWithoutHeaders }; 