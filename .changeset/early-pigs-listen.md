---
"@vahor/typed-es": patch
---

Using an invalid field in an aggregation will now cause an "error" instead of returning unknown of assuming "number".

For example, with this index:

```typescript
type Indexes = {
  index_name: {
    score: number;
  };
};
```

When requesting

```typescript
{
			aggs: {
				min_value: {
					min: {
						field: "price",
					},
				},
			},
}
```

You'll get:

```typescript
{
aggregations: {
    min_value: {
        message: `Field 'price' cannot be used in aggregation on 'index_name'`;
        aggregation: {
            min: {
                field: "price",
            },
        };
    }
}
```
