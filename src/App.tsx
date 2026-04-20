import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useWorkflowStore } from './store/workflowStore'
import { nodeTypes } from './nodes'
import { Sidebar } from './components/Sidebar'
import { NodeFormPanel } from './components/NodeFormPanel'
import { SandboxPanel } from './components/SandboxPanel'
import { ThemeToggle } from './components/ThemeToggle'
import { v4 as uuid } from 'uuid'
import type { WorkflowNodeData } from './types'

const nodeDefaultData: Record<string, () => WorkflowNodeData> = {
  start: () => ({ type: 'start', title: 'Start', metadata: [] }),
  task: () => ({ type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] }),
  approval: () => ({ type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 3 }),
  autoStep: () => ({ type: 'autoStep', title: 'Automated Action', actionId: '', actionParams: {} }),
  end: () => ({ type: 'end', endMessage: 'Workflow Complete', showSummary: false }),
}

function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect,
    setSelectedNodeId, addNode } = useWorkflowStore()
  const { screenToFlowPosition } = useReactFlow()

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('nodeType')
    if (!type) return

    // Use screenToFlowPosition for accurate placement at cursor
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })

    const defaultDataFn = nodeDefaultData[type]
    if (!defaultDataFn) return

    addNode({ id: uuid(), type, position, data: defaultDataFn() })
  }, [addNode, screenToFlowPosition])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        deleteKeyCode="Delete"
        connectionMode={"loose" as any}
        connectionLineStyle={{ stroke: 'var(--accent-indigo)', strokeWidth: 2 }}
        defaultEdgeOptions={{ animated: true, style: { strokeWidth: 2 } }}
      >
        <Background gap={20} color="var(--rf-bg-dot)" />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          style={{ background: 'var(--rf-minimap-bg)' }}
        />
      </ReactFlow>
    </div>
  )
}

export default function App() {
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId)

  return (
    <ReactFlowProvider>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
      }}>
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <div className="toolbar">
            <div>
              <h1 style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}>
                HR Workflow Designer
              </h1>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}>
                Tredence Studio — Agentic Platform
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ThemeToggle />
              <SandboxPanel />
            </div>
          </div>

          {/* Canvas + Right Panel */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <FlowCanvas />

            {/* Right form panel */}
            <div className="right-panel" style={{
              transform: selectedNodeId ? 'translateX(0)' : 'translateX(0)',
            }}>
              <NodeFormPanel />
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}