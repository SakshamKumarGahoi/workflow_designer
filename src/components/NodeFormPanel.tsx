import { useWorkflowStore } from '../store/workflowStore'
import { StartForm } from './forms/StartForm'
import { TaskForm } from './forms/TaskForm'
import { ApprovalForm } from './forms/ApprovalForm'
import { AutoStepForm } from './forms/AutoStepForm'
import { EndForm } from './forms/EndForm'
import { MousePointerClick, X } from 'lucide-react'

const nodeLabels: Record<string, string> = {
  start: 'Start Node', task: 'Task Node',
  approval: 'Approval Node', autoStep: 'Automated Step', end: 'End Node',
}

export function NodeFormPanel() {
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId)
  const nodes = useWorkflowStore(s => s.nodes)
  const setSelectedNodeId = useWorkflowStore(s => s.setSelectedNodeId)

  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-tertiary)',
        gap: '12px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <MousePointerClick size={32} strokeWidth={1.5} />
        <p style={{ fontSize: '13px' }}>Select a node to configure it</p>
      </div>
    )
  }

  const type = selectedNode.type as string

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="right-panel-header">
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {nodeLabels[type] ?? 'Node'}
        </h3>
        <button
          onClick={() => setSelectedNodeId(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          <X size={18} />
        </button>
      </div>
      <div className="right-panel-body">
        {type === 'start' && <StartForm nodeId={selectedNodeId!} />}
        {type === 'task' && <TaskForm nodeId={selectedNodeId!} />}
        {type === 'approval' && <ApprovalForm nodeId={selectedNodeId!} />}
        {type === 'autoStep' && <AutoStepForm nodeId={selectedNodeId!} />}
        {type === 'end' && <EndForm nodeId={selectedNodeId!} />}
      </div>
    </div>
  )
}