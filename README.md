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

## What I'd Add With More Time
- Auto-layout using dagre
- Undo/redo with zustand middleware
- Node templates / presets
- Backend persistence with FastAPI
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright
- Use actual AI agents instead of mockups to make the thing work properly
- Use a authentication system using firebase 
