import type { Node, Edge } from '@xyflow/react'
import type { ValidationError } from '../types'

interface NodeInfo {
  id: string
  type: string
  title: string
}

function getNodeTitle(node: Node): string {
  const data = node.data as Record<string, unknown>
  return (data?.title as string) || (data?.endMessage as string) || node.type || 'Unknown'
}

export interface ValidationDetail {
  title: string
  fix: string
  nodeId: string
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): {
  errors: ValidationError[]
  details: ValidationDetail[]
} {
  const errors: ValidationError[] = []
  const details: ValidationDetail[] = []

  const nodeInfos: NodeInfo[] = nodes.map(n => ({
    id: n.id,
    type: n.type || 'unknown',
    title: getNodeTitle(n),
  }))

  // Check for Start node
  const startNodes = nodes.filter(n => n.type === 'start')
  if (startNodes.length === 0) {
    errors.push({ nodeId: '__global__', message: 'Workflow needs a Start node' })
    details.push({
      title: 'Missing Start node',
      fix: 'Drag a Start node from the sidebar onto the canvas. Every workflow must begin with a Start node.',
      nodeId: '__global__',
    })
  }
  if (startNodes.length > 1) {
    startNodes.slice(1).forEach(n => {
      errors.push({ nodeId: n.id, message: 'Only one Start node allowed' })
      details.push({
        title: `Extra Start node: "${getNodeTitle(n)}"`,
        fix: 'Select this Start node and press Delete to remove it. A workflow can only have one starting point.',
        nodeId: n.id,
      })
    })
  }

  // Check for End node
  const endNodes = nodes.filter(n => n.type === 'end')
  if (endNodes.length === 0) {
    errors.push({ nodeId: '__global__', message: 'Workflow needs an End node' })
    details.push({
      title: 'Missing End node',
      fix: 'Drag an End node from the sidebar onto the canvas. Every workflow must have at least one ending point.',
      nodeId: '__global__',
    })
  }

  // Detect disconnected non-start nodes (no incoming)
  const connectedTargets = new Set(edges.map(e => e.target))
  const connectedSources = new Set(edges.map(e => e.source))

  nodes.forEach(n => {
    const info = nodeInfos.find(ni => ni.id === n.id)
    const title = info?.title || n.type || 'This node'

    if (n.type !== 'start' && !connectedTargets.has(n.id)) {
      errors.push({ nodeId: n.id, message: `"${title}" has no incoming connection` })
      details.push({
        title: `"${title}" is not connected to any input`,
        fix: `Connect another node's output (bottom handle) to this node's input (top handle). Drag from a handle on another node to the top of "${title}".`,
        nodeId: n.id,
      })
    }
    if (n.type !== 'end' && !connectedSources.has(n.id)) {
      errors.push({ nodeId: n.id, message: `"${title}" has no outgoing connection` })
      details.push({
        title: `"${title}" is not connected to any output`,
        fix: `Connect this node's output (bottom handle) to another node's input. Drag from the bottom handle of "${title}" to the top handle of the next step.`,
        nodeId: n.id,
      })
    }
  })

  // Detect cycles via DFS
  const adjacency = new Map<string, string[]>()
  nodes.forEach(n => adjacency.set(n.id, []))
  edges.forEach(e => adjacency.get(e.source)?.push(e.target))

  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    inStack.add(nodeId)
    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true
      if (inStack.has(neighbor)) return true
    }
    inStack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) {
      errors.push({ nodeId: node.id, message: 'Cycle detected in workflow' })
      details.push({
        title: 'Circular connection detected',
        fix: 'Your workflow has a loop where nodes connect back to each other in a cycle. Remove one of the connections that creates the loop. A workflow should flow in one direction from Start to End.',
        nodeId: node.id,
      })
      break
    }
  }

  return { errors, details }
}