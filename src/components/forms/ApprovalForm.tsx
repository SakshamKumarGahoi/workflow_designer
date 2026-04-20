import { useWorkflowStore } from '../../store/workflowStore'
import type { ApprovalNodeData } from '../../types'

const ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite']

export function ApprovalForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(s => s.nodes.find(n => n.id === nodeId))
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const d = node?.data as ApprovalNodeData
  const update = (patch: Partial<ApprovalNodeData>) => updateNodeData(nodeId, patch)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="form-label">Title</label>
        <input className="form-input"
          value={d?.title ?? ''} onChange={e => update({ title: e.target.value })} placeholder="e.g. Manager Approval" />
      </div>
      <div>
        <label className="form-label">Approver Role</label>
        <select className="form-select"
          value={d?.approverRole ?? ''} onChange={e => update({ approverRole: e.target.value })}>
          <option value="">Select role</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">
          Auto-approve threshold <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>(days)</span>
        </label>
        <input type="number" min={0} className="form-input"
          value={d?.autoApproveThreshold ?? 0}
          onChange={e => update({ autoApproveThreshold: Number(e.target.value) })} />
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
          Auto-approve if no response within this many days
        </p>
      </div>
    </div>
  )
}