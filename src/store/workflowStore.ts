import { create } from 'zustand'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import type { WorkflowNodeData, WorkflowNode, ValidationError } from '../types'

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: Edge[]
  selectedNodeId: string | null
  validationErrors: ValidationError[]

  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  setSelectedNodeId: (id: string | null) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  addNode: (node: WorkflowNode) => void
  setValidationErrors: (errors: ValidationError[]) => void
  exportWorkflow: () => string
  importWorkflow: (json: string) => void
  resetWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],

  onNodesChange: (changes) =>
    set(s => ({ nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[] })),

  onEdgesChange: (changes) =>
    set(s => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set(s => ({ edges: addEdge({ ...connection, animated: true }, s.edges) })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) =>
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  addNode: (node) => set(s => ({ nodes: [...s.nodes, node] })),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  exportWorkflow: () => {
    const { nodes, edges } = get()
    return JSON.stringify({ nodes, edges }, null, 2)
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json)
      set({ nodes, edges, selectedNodeId: null, validationErrors: [] })
    } catch {
      alert('Invalid workflow JSON')
    }
  },

  resetWorkflow: () =>
    set({ nodes: [], edges: [], selectedNodeId: null, validationErrors: [] }),
}))