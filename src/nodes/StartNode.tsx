import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { StartNodeData } from '../types'
import { useWorkflowStore } from '../store/workflowStore'
import { Play, AlertCircle } from 'lucide-react'

export function StartNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as StartNodeData
  const errors = useWorkflowStore(s => s.validationErrors)
  const nodeError = errors.find(e => e.nodeId === id)
  const hasError = !!nodeError

  return (
    <div className={`workflow-node workflow-node--start${selected ? ' selected' : ''}${hasError ? ' has-error' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="node-icon node-icon--start">
          <Play size={16} />
        </div>
        <div>
          <p className="text-label" style={{ marginBottom: '1px' }}>Start</p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {d.title || 'Start'}
          </p>
        </div>
      </div>
      {hasError && (
        <div className="node-error-msg">
          <AlertCircle size={12} />
          {nodeError.message}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--accent-emerald)' }} />
    </div>
  )
}