import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ApprovalNodeData } from '../types'
import { useWorkflowStore } from '../store/workflowStore'
import { CheckCircle, AlertCircle } from 'lucide-react'

export function ApprovalNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as ApprovalNodeData
  const errors = useWorkflowStore(s => s.validationErrors)
  const nodeError = errors.find(e => e.nodeId === id)
  const hasError = !!nodeError

  return (
    <div className={`workflow-node workflow-node--approval${selected ? ' selected' : ''}${hasError ? ' has-error' : ''}`}>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--accent-amber)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="node-icon node-icon--approval">
          <CheckCircle size={16} />
        </div>
        <div>
          <p className="text-label" style={{ marginBottom: '1px' }}>Approval</p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {d.title || 'Approval Step'}
          </p>
          {d.approverRole && (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {d.approverRole}
            </p>
          )}
        </div>
      </div>
      {hasError && (
        <div className="node-error-msg">
          <AlertCircle size={12} />
          {nodeError.message}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--accent-amber)' }} />
    </div>
  )
}