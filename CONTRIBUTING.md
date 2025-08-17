# Contributing to Typed ES

Thank you for your interest in contributing to Typed ES! This guide will help you get started with contributing to the project.

## Getting Started

### Prerequisites

- **Bun >= 1.2.20** - Required for expect type features

### Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/Vahor/typed-es.git
   cd typed-es
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Verify the setup:
   ```bash
   bun run build
   bun run typecheck
   ```

## Development Workflow

### Available Scripts

- `bun run build` - Build the project
- `bun run format` - Format code with Biome
- `bun run typecheck` - Run TypeScript type checking

## Types of Contributions

### 1. Adding Missing Elasticsearch Aggregations

[List of elasticsearch aggregations](https://www.elastic.co/docs/reference/aggregations/)

If you need an aggregation that's not implemented:

1. **Check existing aggregations** in `src/aggregations/` for reference
2. **Use the aggregation issue template** when creating an issue
3. **Implement the aggregation** following existing patterns:
   - Bucket aggregations go in `src/aggregations/bucket/`
   - Metrics aggregations go in `src/aggregations/metrics/`
4. **Add comprehensive tests** in the corresponding `tests/aggregations/` directory
5. **Ensure type safety** - the types should match Elasticsearch input/output structure

### 2. Bug Fixes

- Create an issue describing the bug
- Include steps to reproduce
- Write tests that demonstrate the fix
- Ensure all existing tests still pass

### 3. New Features

- Open an issue first to discuss the feature
- For new methods, update the README with usage examples
- Consider adding examples to an `examples/` folder for complex features
- Ensure comprehensive test coverage

## Testing

### Type Testing
Since this is a type-focused library, we primarily use TypeScript's compiler for testing:

```bash
bun run typecheck  # This runs tsc --noEmit
```

Most tests verify that types compile correctly and infer the expected shapes.

### Test Requirements
- **All new features must have tests**
- **Tests should cover edge cases and error conditions**
- **Use existing test patterns as reference**

## Pull Request Process

1. **Create a feature branch** from `main`:

2. **Make your changes** following the code style guidelines

3. **Add tests** for your changes

4. **Add documentation** for your changes: README, and if needed add a new example in `examples/`

5. **Create a changeset** (optional):
   ```bash
   bunx @changesets/cli
   ```
   - Choose "patch" for the version bump (we're in 0.0.x)
   - Write a clear description of your changes

6. **Ensure quality checks pass**:
   ```bash
   bun run format
   bun run typecheck
   bun run build
   ```

7. **Create a pull request**:
   - Use a descriptive title
   - Reference any related issues


8. **Review part**:
   - Ensure quality checks pass
   - CodeRabbit AI bot will add comments to your PR. Check them, sometimes they are useful. (sometimes not..)
   - Once the bot review is done and your PR is up to date, ask for a review from a maintainer.

## Project Structure

```
src/
├── aggregations/
│   ├── bucket/          # Bucket aggregations (terms, histogram, etc.)
│   └── metrics/         # Metrics aggregations (stats, percentiles, etc.)
├── override/            # Response type overrides
└── types/               # Utility types and helpers

tests/                   # Mirror structure of src/
```

## Release Process

We use changesets for releases:
- Maintainers handle the actual releases
- Every PR that adds functionality should be accompanied by a changeset.
- Since we're in 0.0.x, most changes are patches.
