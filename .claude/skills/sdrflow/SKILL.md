```markdown
# sdrflow Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `sdrflow` TypeScript codebase. You will learn how to structure files, write imports/exports, follow commit message standards, and write tests in alignment with the project's established practices. This guide is designed to help contributors maintain consistency and quality across the repository.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    user-service.ts
    data-processor.test.ts
    ```

### Import Style
- Use **relative imports** for referencing other modules within the project.
  - Example:
    ```typescript
    import { processData } from './data-processor';
    ```

### Export Style
- Use **named exports** for all exported functions, classes, or constants.
  - Example:
    ```typescript
    // data-processor.ts
    export function processData(input: string): string {
      // ...
    }
    ```

### Commit Messages
- Follow **Conventional Commits** with the `feat` prefix for new features.
  - Example:
    ```
    feat: add support for custom data sources
    ```

## Workflows

### Feature Development
**Trigger:** When adding a new feature to the codebase  
**Command:** `/feature-development`

1. Create a new TypeScript file using kebab-case for the filename.
2. Implement your feature using named exports.
3. Use relative imports to include dependencies.
4. Write a corresponding test file named `<feature>.test.ts`.
5. Commit your changes using the `feat` prefix and a concise description.
6. Open a pull request for review.

### Testing
**Trigger:** When writing or running tests  
**Command:** `/run-tests`

1. Create a test file with the `.test.ts` suffix (e.g., `data-processor.test.ts`).
2. Write tests for your modules and functions.
3. Use the project's preferred testing framework (framework not specified; check with maintainers).
4. Run the tests to ensure all pass before committing.

## Testing Patterns

- Test files are named with the `.test.ts` suffix and placed alongside the modules they test.
  - Example:
    ```
    data-processor.ts
    data-processor.test.ts
    ```
- The specific testing framework is not specified; follow existing patterns or consult the team.
- Ensure all new features and bug fixes include appropriate test coverage.

## Commands

| Command              | Purpose                                        |
|----------------------|------------------------------------------------|
| /feature-development | Start the workflow for adding a new feature    |
| /run-tests           | Run all test files in the repository           |
```
