import type { Node, Edge } from '@xyflow/react'

export type NodeType = 'start' | 'task' | 'approval' | 'autoStep' | 'end'

export interface KeyValuePair {
  key: string
  value: string
}

export interface StartNodeData {
  type: 'start'
  title: string
  metadata: KeyValuePair[]
  [key: string]: unknown
}

export interface TaskNodeData {
  type: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
  [key: string]: unknown
}

export interface ApprovalNodeData {
  type: 'approval'
  title: string
  approverRole: string
  autoApproveThreshold: number
  [key: string]: unknown
}

export interface AutoStepNodeData {
  type: 'autoStep'
  title: string
  actionId: string
  actionParams: Record<string, string>
  [key: string]: unknown
}

export interface EndNodeData {
  type: 'end'
  endMessage: string
  showSummary: boolean
  [key: string]: unknown
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutoStepNodeData
  | EndNodeData

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulationStep {
  nodeId: string
  nodeTitle: string
  status: 'success' | 'skipped' | 'error'
  message: string
}

export interface ValidationDetail {
  title: string
  fix: string
  nodeId: string
}

export interface SimulationResult {
  success: boolean
  steps: SimulationStep[]
  error?: string
  validationDetails?: ValidationDetail[]
}

export interface ValidationError {
  nodeId: string
  message: string
}