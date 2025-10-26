# Agent Guidelines for typed-es

## Build/Test/Lint Commands

- **Build**: `bun run build` (uses build.ts)
- **Format**: `bunx @biomejs/biome check ./ --write`
- **Typecheck**: `bun typecheck`
- **Test**: `bun test` (uses Bun test runner)
- **Test single file**: `bun test tests/index.test.ts`
- **Adding changesets**: `bunx @changesets/cli` (package name is `@vahor/typed-es`)

## Code Style Guidelines

- **Formatter**: Biome with tab indentation, double quotes for JS/TS
- **Imports**: Auto-organize imports enabled, use type imports (`import type`)
- **Types**: Strict TypeScript, use `const` assertions, prefer type-only imports
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Avoid comments unless necessary for complex type logic
- **Error handling**: Use TypeScript's type system for compile-time safety
- **File structure**: Code in src/, tests in tests/ directory
- **Backticks**: Add backticks around any field name, aggregation name, or index name in comments.

## Project Specifics

- Uses Bun as runtime and package manager
- Complex TypeScript utility types for Elasticsearch query typing
- Biome linting with recommended rules (noBannedTypes disabled)
- Pre-commit hooks with husky and lint-staged
- Export types and utilities for Elasticsearch type safety
- Add changesets when making a pull request. In version 0.x.x, create patch changesets.
