# Mission Briefly

A Star Trek-inspired mission management and fleet coordination system built with Vue 3, TypeScript, and Vuetify.

## 🚀 Project Overview

Mission Briefly simulates Starfleet operations, allowing users to manage characters, coordinate starships, and track missions in the Star Trek universe. The application features a comprehensive character system, fleet management capabilities, and mission logging functionality.

### ✨ Key Features

- **Character Management**: Create and manage Starfleet officers with species, ranks, and department assignments
- **Fleet Coordination**: Manage starships, assign crew members, and track ship status
- **Mission System**: Create, assign, and track missions with detailed logging
- **Interactive UI**: Material Design interface with responsive navigation
- **Type Safety**: Full TypeScript implementation with comprehensive type checking

### 🎯 Current Status

This project is in active development. See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed project analysis and roadmap.

## 📋 Development Guidelines

### Vuetify Component Changes

Before modifying Vuetify tree-shaking configuration, review [VUETIFY_CHECKLIST.md](./VUETIFY_CHECKLIST.md) to prevent component display issues.

### Documentation

- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Comprehensive project analysis and roadmap
- [DEVELOPMENT_TRACKER.md](./DEVELOPMENT_TRACKER.md) - Sprint planning and progress tracking
- [VUETIFY_CHECKLIST.md](./VUETIFY_CHECKLIST.md) - Component audit checklist for Vuetify changes

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
