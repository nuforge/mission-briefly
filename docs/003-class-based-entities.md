# ADR-003: Class-based Game Entities

## Status

Accepted

## Context

The application needs to model complex game entities (Characters, Ships, Missions) with relationships, behaviors, and data validation. We needed to choose between:

1. Plain TypeScript interfaces with functional approach
2. Class-based object-oriented approach
3. Composition-based approach with factory functions

## Decision

Implement class-based inheritance hierarchy with:

- Abstract `Entity` base class for common functionality
- Concrete classes for `Character`, `Ship`, `Mission`, etc.
- Method chaining for fluent API (e.g., `ship.setCrew().assignCrew()`)
- JSON serialization support for data persistence

## Consequences

### Positive

- **Type Safety**: Strong typing with method validation
- **Code Reuse**: Common functionality in base Entity class
- **Intuitive API**: Object-oriented approach matches domain model
- **Extensibility**: Easy to add new entity types
- **Method Chaining**: Fluent API for complex object configuration
- **Encapsulation**: Private/protected members for data integrity

### Negative

- **Bundle Size**: Classes add overhead compared to plain objects
- **Complexity**: More complex than simple data objects
- **Serialization**: Requires custom toJSON/fromJSON methods
- **Testing**: Need to test both data and behavior
- **Memory Usage**: Class instances use more memory than plain objects

## Notes

- All game classes extend the abstract `Entity` base class
- ID generation is handled automatically via `normalizeString` utility
- JSON serialization is implemented but deserialization is commented out (needs implementation)
- The approach works well for the Star Trek domain model where entities have complex relationships
- Consider implementing factory methods if object creation becomes complex

## Related Files

- `src/game/entity.ts` - Base entity class
- `src/game/character.ts` - Character implementation
- `src/game/ship.ts` - Ship implementation
- `src/game/mission.ts` - Mission implementation
- `src/utils/StringUtils.ts` - ID normalization utility
