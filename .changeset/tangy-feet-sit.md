---
"@vahor/typed-es": patch
---

Add `unknown` types to custom fields.

Custom object properties are not supported. This only works on leaf types.
Example:

```typescript
type Index = {
  index_name: {
    name: string;
    object: {
      nested: number;
    };
  };
};
```

With an Elasticsearch mapping like:

```json
{
    "properties": {
        "name": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword"
                }
            }
        }
            ...
    }
}
```

You can now request

```typescript
_source: [
  "name.keyword",
  "object.nested.something",
  "invalid",
  "object.variant",
];
```

and the output will be:

```typescript
{ name: unknown, object: { nested: unknown} }
```

As `invalid` is not a valid field, it will be ignored.
And as `object` is an object, `variant` can't be a valid field on it. (only leaf types can have custom variants)
