# Agent Guidelines for typed-es

This library is a TypeScript type-safe wrapper for Elasticsearch queries.
There won't be any runtime code in this library.

Always start by making a plan for your changes. Gather requirements, read issue and comments.

## Build/Test/Lint Commands

- **Build**: `bun run build` (uses build.ts)
- **Format**: `bunx @biomejs/biome check ./ --write`
- **Typecheck**: `bun typecheck`
- **Test**: `bun test` (uses Bun test runner; Even tests pass, run typecheck to make sure types are correct ; Add `AGENT=1` env variable to reduce noise)
- **Test single file**: `bun test tests/index.test.ts`
- **Adding changesets**:
```bash
cat > .changeset/your-changeset.md <<'EOF'
---
"@vahor/typed-es": patch
---

message content
EOF
```

## Code Style Guidelines

- **Formatter**: Biome with tab indentation, double quotes for JS/TS
- **Imports**: Auto-organize imports enabled, use type imports (`import type`)
- **Types**: Strict TypeScript, use `const` assertions, prefer type-only imports
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Avoid comments unless necessary for complex type logic
- **Error handling**: Use TypeScript's type system for compile-time safety
- **File structure**: Code in src/, tests in tests/ directory
- **Backticks**: Add backticks around any field name, aggregation name, or index name in comments.
- **Add issue name in branch name**: Never commit to main branch. Instead, create a branch with the issue number and name (can add agent name).

## Project Specifics

- Uses Bun as runtime and package manager
- Complex TypeScript utility types for Elasticsearch query typing
- Biome linting with recommended rules (noBannedTypes disabled)
- Pre-commit hooks with husky and lint-staged
- Export types and utilities for Elasticsearch type safety
- Add changesets when making a pull request. In version 0.x.x, create patch changesets.
- When adding an aggregation, update the README.md table. 
- Each aggregation has a test file in tests/aggregations/[type]. The filename for the test file should be the same as the aggregation name but with .test.ts extension. The aggregation filename should contain the aggregation full name in snake_case. If you don't find it by listing the files, it does not exist yet.
- To add a new aggregation, you'll have to update lib.ts AggregationOutput type and probably NextAggsParentKey. Do not modify the other aggregation implementations unless requested.
- When implementing tests, add a base case that uses the documentation example.
- You don't need to update the CHANGELOG.md file. 

## Guidelines 

Ignore formatting and linting rules while coding. Fix them at the end once all types are correct.

### Try to fetch markdown pages from the docs

Whenever possible, try to fetch markdown pages from the docs.
Elasticsearch documentation is available as markdown by appending `.md` to the URL.
For example: `https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-reverse-nested-aggregation` is available in markdown at `https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-reverse-nested-aggregation.md`.

If you need to fetch another page or website, try the same approach.


You can use github `gh` cli to fetch information about github issues, pull requests, and other resources. (ex: `gh issue view 231`)

### Check Existing Implementation

Always search the codebase for similar implementations. Identify patterns, reusable functions, or existing modules that may impact your solution.

You can also check previous pull requests for implementations (check CHANGELOG.md first).

### Verify Examples and References

Always check `README.md`, example scripts, and other documentation that may provide context. Update examples if your output affects them.

### Never Assume File Contents or URL content

Never try to guess a file's content. Always read the actual file before using or modifying it.
Similarly, never assume a URL's content, fetch it before attempting to use it.

### Context Awareness

Consider surrounding code and project conventions when proposing changes. Maintain consistency with variable naming, formatting, and architecture.

### Remove Unused Code

Once a feature is implemented, remove any unused code or dependencies. Use The format command to detect them if necessary.
