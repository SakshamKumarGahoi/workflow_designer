# HR Workflow Designer

Visual drag-and-drop workflow builder for HR processes built for Tredence Studio.

## How to Run
npm install && npm run dev
Open http://localhost:5173

## Architecture
- React Flow handles canvas, node rendering, edge connections
- Zustand single store manages all workflow state (nodes, edges, selectedNodeId, validationErrors)
- MSW intercepts /automations and /simulate — no real backend needed
- Each node type is an isolated component in src/nodes/
- Each form is an isolated controlled component in src/components/forms/
- All shared types live in src/types/index.ts — single source of truth

## Design Decisions
- Zustand over Context: avoids re-render cascades when node data updates frequently
- MSW over json-server: runs in-browser, no separate process, faster setup
- Controlled forms with direct store updates: no local form state, node updates are instant on canvas
- Validation runs before simulate, errors are pinned to nodes visually
- DFS cycle detection runs on every simulate call
- Added a Dark and Light mode switch (love those)
- Used Lucid Icons for better design
- Made the UI clean and crisp as per needs 

## Project Structure

```
hr-workflow-designer/
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite + React + Tailwind plugin config
├── tsconfig.json              # TypeScript compiler options
├── package.json
├── test.json                  # Sample workflow (Employee Onboarding)
├── public/                    # Static assets & MSW service worker
└── src/
    ├── main.tsx               # React DOM bootstrap + MSW init
    ├── App.tsx                # Root layout — Sidebar + Toolbar + Canvas + Form Panel
    ├── index.css              # Global styles, design tokens, dark/light themes
    │
    ├── nodes/                 # Custom React Flow node components
    │   ├── StartNode.tsx
    │   ├── TaskNode.tsx
    │   ├── ApprovalNode.tsx
    │   ├── AutoStepNode.tsx
    │   ├── EndNode.tsx
    │   └── index.ts           # Node type registry
    │
    ├── components/            # UI components
    │   ├── Sidebar.tsx        # Draggable node palette + import/export/reset
    │   ├── NodeFormPanel.tsx   # Right panel — routes to type-specific forms
    │   ├── SandboxPanel.tsx   # Simulation runner + results modal
    │   ├── ThemeToggle.tsx    # Dark / light mode switch
    │   └── forms/             # Per-node-type configuration forms
    │       ├── StartForm.tsx
    │       ├── TaskForm.tsx
    │       ├── ApprovalForm.tsx
    │       ├── AutoStepForm.tsx
    │       └── EndForm.tsx
    │
    ├── store/
    │   └── workflowStore.ts   # Zustand store — nodes, edges, selection, CRUD, import/export
    │
    ├── types/
    │   └── index.ts           # TypeScript interfaces — node data, simulation, validation
    │
    ├── hooks/
    │   ├── useSimulate.ts     # Validation → API call → simulation result
    │   └── useAutoLayout.ts   # Auto-layout utility
    │
    ├── lib/
    │   ├── validateWorkflow.ts  # Graph validation (start/end check, connectivity, cycle detection)
    │   └── simulateWorkflow.ts  # Simulation helpers
    │
    └── mocks/
        ├── browser.ts         # MSW browser worker setup
        └── handlers.ts        # Mock API handlers — /automations, /simulate
```

## What I'd Add With More Time
- Auto-layout using dagre
- Undo/redo with zustand middleware
- Node templates / presets
- Backend persistence with FastAPI
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright
- Use actual AI agents instead of mockups to make the thing work properly
- Use a authentication system using firebase 
