# SketchNest

> An infinite web whiteboard for freehand sketches, diagrams and quick visual thinking — inspired by Excalidraw and built as a deep-dive into high-performance canvas rendering, strict typing and Feature-Sliced Design.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![MobX](https://img.shields.io/badge/MobX-6-FF9955?logo=mobx&logoColor=white)
![Konva](https://img.shields.io/badge/Konva-10-0D83CD)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2-60A5FA?logo=biome&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)

---

## Table of contents

- [Overview](#overview)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Technical highlights](#technical-highlights)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Roadmap](#roadmap)

---

## Overview

**SketchNest** is a browser-based drawing board for creating handwritten diagrams, wireframes and quick sketches. It targets designers, engineers and teams that need a zero-install canvas to externalize ideas.

The project is intentionally built from first principles — not as a wrapper around an existing drawing engine. It combines a Konva-powered 2D scene graph with a custom, schema-validated domain model, an R-tree spatial index for fast hit-testing and a diff-based undo/redo system designed to scale to thousands of elements without losing history semantics.

## Key features

- **Infinite canvas** with smooth zoom-to-cursor and panning (Hand tool).
- **Drawing tools**: freehand line, rectangle, ellipse — all with rotation support.
- **Smart eraser** with soft-delete preview, pixel-accurate SDF hit-testing and `Alt`-hold to restore erased items during the same stroke.
- **Full undo / redo stack** with `Ctrl+Z` / `Ctrl+Shift+Z`, per-element versioning and branch pruning on new edits.
- **Per-element properties panel**: stroke color, fill, stroke width and opacity.
- **Pointer Events** for unified mouse, pen and touch input (including pointer capture).
- **Validated state**: every element, update and interactive draft is parsed through a Zod schema before it enters the store.
- **Spatial queries**: an R-tree (RBush) powers eraser hit-detection in O(log n); the same bounding-box index exposes a `searchByBounds` primitive ready to back viewport culling.
- **Responsive UI** built on Radix primitives and a custom shadcn-style component layer.
- **Tested core**: the domain model, geometry/SDF math and diff engine are covered by a Vitest suite, including a seeded-fuzz invariant test and a diff/patch round-trip property test (see [Testing](#testing)).

## Tech stack

| Area | Technology | Why it was chosen |
| --- | --- | --- |
| UI framework | **React 19** + **react-dom 19** | Latest concurrent features, Actions, and native `use` hook. |
| Compiler | **babel-plugin-react-compiler** | Automatic memoization — eliminates manual `useMemo` / `useCallback` churn. |
| Build tool | **Vite 7** | Instant HMR, modern ESM-first bundling. |
| Language | **TypeScript 5.9** (strict) | End-to-end type safety from Zod schema to Konva props. |
| State | **MobX 6** + **mobx-react-lite** | Fine-grained observability perfectly suited for a mutable canvas scene; minimal re-renders via per-element observers. |
| Rendering | **Konva 10** + **react-konva 19** | Imperative 2D scene graph with retained-mode performance. |
| Validation | **Zod 4** | Runtime schemas for every domain entity (`BoardElement`, updates, interactive drafts). |
| Geometry | **@thi.ng/geom**, **@thi.ng/geom-sdf**, **@thi.ng/geom-resample** | Robust shape math, bounding boxes, rotation, signed-distance fields. |
| Spatial index | **RBush** (R-tree) | Sub-linear bounding-box queries for the eraser (and, ahead, viewport culling). |
| Styling | **Tailwind CSS 4** + **tw-animate-css** | Zero-config v4 engine with the `@tailwindcss/vite` plugin. |
| Components | **Radix UI**, **lucide-react**, **class-variance-authority**, **tailwind-merge** | Accessible, unstyled primitives + an in-house shadcn-style layer. |
| Tooling | **Biome 2** | Unified linter + formatter with a single config (replaces ESLint + Prettier). |
| Testing | **Vitest 4** | Vite-native runner that reuses the app's config and `@` aliases; fast unit, invariant and property tests for the domain, geometry and diff engine. |

## Architecture

The codebase follows **Feature-Sliced Design (FSD)** — a layered architecture that keeps business rules, UI and infrastructure cleanly separated:

```
app/        → composition root, providers, global store, styles
pages/      → route-level screens (currently: home)
widgets/    → reserved for larger composite UI blocks
features/   → self-contained user-facing capabilities (drawing-tools, eraser, zoom…)
entities/   → domain models and their stores (elements, tools, properties)
shared/     → framework-agnostic primitives (hooks, guards, utils, UI kit)
```

Each layer is only allowed to import from layers below it, which makes the dependency graph acyclic and the domain layer trivially reusable.

### State containers

- `RootStore` composes four MobX stores and is injected via a React `StoreProvider`:
  - `ToolsStore` — the currently selected tool (`hand`, `rect`, `ellipse`, `draw`, `eraser`; a `selection` slot is wired into the toolbar but reserved for upcoming work — see [Roadmap](#roadmap)).
  - `PropertiesStore` — stroke, fill, stroke width, opacity.
  - `ElementsStore` — the source of truth for every element on the board, plus history.
  - `InteractiveStore` — the ephemeral element being drawn right now and a pending soft-delete set used by the eraser.

This split yields two rendering layers in Konva (`StaticLayer` + `InteractiveLayer`), so in-progress strokes never trigger re-renders of the committed scene.

## Technical highlights

These are the parts of the codebase that were the most interesting to design:

### 1. Diff-based, per-element history

`ElementsStore` does not store full snapshots of the board per undo step. Instead:

- Every element carries its own `history: DiffPair<BoardElementUpdate>[]` and a monotonically increasing `version`.
- A custom `getDiff` walks the object tree and produces a minimal `{ previous, current }` patch; `applyPatch` plays it back.
- A parallel `historySteps: BoardElement['id'][][]` records which elements were touched on each user action — so an undo only re-hydrates the affected subset.
- When the user makes a new edit after undoing, `pruneFutureSteps` compacts the arrays with a two-pointer pass, reclaiming memory from discarded branches.

This keeps memory bounded to the size of the actual edits, not the size of the board.

### 2. R-tree spatial index + SDF hit-testing

Every element maintains an axis-aligned `shapeBox` stored in an `RBush` R-tree. The eraser tool:

1. Computes a tight bounding capsule between the previous and current pointer positions.
2. Queries the R-tree — `O(log n)` candidates instead of a linear scan over all elements.
3. For each candidate, evaluates the exact distance using dedicated SDF-style functions (`getDistanceToRect`, `getDistanceToLine`, `getDistanceToEllipse`) with stroke-width compensation.
4. Distinguishes *filled* vs *outline* shapes so the eraser does not false-trigger inside an unfilled rectangle.
5. Supports **restore mode** while `Alt` is held — items can be un-marked before the stroke is committed.

The result is pixel-accurate erasure that stays responsive even with thousands of shapes.

### 3. Runtime-validated domain

Every write path to the store goes through Zod:

```ts
const validatedElement = BoardElementCreateSchema.parse(element);
```

Discriminated unions (`LineElementSchema | RectElementSchema | EllipseElementSchema`) guarantee exhaustive `switch` checks in geometry utilities, and all types are derived via `z.infer`, so the compile-time and runtime contracts can never drift.

### 4. Unified Pointer Events

Mouse, stylus and touch go through a single `useStageEventListener` pipeline using the Pointer Events API with `setPointerCapture`. This removes a whole class of "lost pointerup" bugs and made pen pressure / palm rejection trivial to add later.

### 5. Performance details

- Two Konva layers — `listening={false}` on the interactive overlay so Konva skips event hit-testing for in-progress strokes.
- `babel-plugin-react-compiler` enabled in Vite → components are auto-memoized without manual hooks.
- `searchByBounds` exposes O(log n) bounding-box queries over the R-tree — today it backs the eraser, and it is the primitive viewport culling will build on.
- `useIsTabActive` cancels long-running eraser/draw sessions when the tab loses focus, preventing stuck pointers after `Alt+Tab`.

## Testing

The hard parts of SketchNest — the schema-validated domain, the geometry/SDF math and the diff-based history — are covered by a **Vitest** suite that runs in a fast `node` environment (no browser needed). Tests live next to the code they exercise as colocated `*.test.ts` files.

What is covered:

- **Schemas** — every Zod entity and its discriminated union (`BoardElementCreateSchema`, line / rect / ellipse), including rejection of malformed payloads.
- **Geometry & SDF** — `getBounds` and the signed/unsigned distance functions (`getDistanceToRect`, `getDistanceToLine`, `getDistanceToEllipse`), asserting correct inside/outside behaviour the eraser relies on.
- **Stores** — `ElementsStore` (create / update / undo / redo), `InteractiveStore`, `PropertiesStore`, `ToolsStore`, plus a **seeded-fuzz invariant suite** that hammers the history with randomised actions and asserts the store never corrupts.
- **Diff engine** — `getDiff` and `applyPatch` unit tests plus a **round-trip property test** proving `applyPatch(getDiff(a, b)) === b`.
- **Guards** — `isPlainObject`, `hasObjectPrototype`, `isVector2d`.

Shared test helpers (minimal valid `create*` factories and a Vitest setup) live in `src/shared/testing/`.

```bash
bun run test         # run once
bun run test:watch   # watch mode
```

## Project structure

```
src/
├── app/                 # Composition root
│   ├── App.tsx
│   ├── providers/       # StoreProvider (MobX)
│   ├── store/           # RootStore
│   └── styles/
├── pages/
│   └── home/            # Main board page — wires up Stage + panels
├── widgets/             # Reserved for future composite blocks
├── features/
│   ├── canvas-menu/         # Top-left menu
│   ├── canvas-tools/        # Tool switcher
│   ├── canvas-viewport/     # useResize, useZoom
│   ├── drawing-tools/       # useFreehandDrawing, useDrawRect,
│   │                        # useDrawEllipse, useEraser,
│   │                        # useStageEventListener (dispatcher)
│   ├── history-panel/       # Undo / Redo UI + keyboard shortcuts
│   ├── interactive-layer/   # Konva layer for the in-progress element
│   ├── properties-panel/    # Stroke / fill / width / opacity controls
│   └── static-layer/        # Konva layer for committed elements
├── entities/
│   ├── elements/        # BoardElement domain: schemas, stores,
│   │                    # geometry (getBounds, SDF distances), UI (Line/Rect/Ellipse)
│   ├── properties/      # PropertiesStore
│   └── tools/           # ToolsStore + ToolsEnum
├── shared/
│   ├── components/ui/   # shadcn-style primitives (Button, Slider, Toggle…)
│   ├── guards/          # isPlainObject, hasObjectPrototype, isVector2d
│   ├── hooks/           # useIsTabActive, useThrottleCallback
│   ├── lib/             # cn()
│   ├── testing/         # test factories + Vitest setup
│   ├── types/           # DeepReadonly
│   └── utils/           # getDiff, applyPatch
└── main.tsx
```

> Tests are colocated with the code they cover as `*.test.ts` files (schemas, geometry, stores, guards and the diff engine).

## Getting started

### Prerequisites

- **Node.js** ≥ 20
- **bun**, **pnpm** or **npm** (the repo ships a `bun.lock`)

### Installation

```bash
git clone git@github.com:meme-d0ge/SketchNest.git
cd SketchNest
bun install     # or: npm install / pnpm install
```

### Development

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
bun run build
bun run preview
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start Vite dev server with HMR. |
| `build` | Type-check the project (`tsc -b`) and produce a production bundle. |
| `preview` | Serve the production build locally. |
| `test` | Run the Vitest suite once. |
| `test:watch` | Run Vitest in watch mode. |
| `format` | Format the codebase with Biome. |
| `lint` | Lint and auto-fix with Biome. |
| `check` | Run Biome `check --write` (format + lint + organize imports). |
| `check:ci` | Run Biome in CI mode (fails on any issue). |

## Roadmap

Planned / in-progress work:

- Selection tool with multi-select, transform handles and group operations.
- Text elements with inline editing.
- Image import (drag-and-drop + paste).
- Board persistence (IndexedDB) and JSON import / export.
- Real-time multiplayer collaboration — a sync layer built on top of the existing per-element diff/patch stream.
- Export to PNG / SVG.

---

Built by [@meme-d0ge](https://github.com/meme-d0ge). Contributions and issues are welcome.
