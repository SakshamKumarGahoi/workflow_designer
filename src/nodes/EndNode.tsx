import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { EndNodeData } from '../types'
import { useWorkflowStore } from '../store/workflowStore'
import { Square, AlertCircle } from 'lucide-react'

export function EndNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as EndNodeData
  const errors = useWorkflowStore(s => s.validationErrors)
  const nodeError = errors.find(e => e.nodeId === id)
  const hasError = !!nodeError

  return (
    <div className={`workflow-node workflow-node--end${selected ? ' selected' : ''}${hasError ? ' has-error' : ''}`}>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--accent-rose)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="node-icon node-icon--end">
          <Square size={16} />
        </div>
        <div>
          <p className="text-label" style={{ marginBottom: '1px' }}>End</p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {d.endMessage || 'Workflow Complete'}
          </p>
        </div>
      </div>
      {hasError && (
        <div className="node-error-msg">
          <AlertCircle size={12} />
          {nodeError.message}
        </div>
      )}
    </div>
  )
}