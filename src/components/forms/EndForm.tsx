import { useWorkflowStore } from '../../store/workflowStore'
import type { EndNodeData } from '../../types'

export function EndForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(s => s.nodes.find(n => n.id === nodeId))
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const d = node?.data as EndNodeData
  const update = (patch: Partial<EndNodeData>) => updateNodeData(nodeId, patch)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="form-label">End Message</label>
        <input className="form-input"
          value={d?.endMessage ?? ''} onChange={e => update({ endMessage: e.target.value })} placeholder="e.g. Onboarding complete!" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id="summary-flag"
          checked={d?.showSummary ?? false}
          onChange={e => update({ showSummary: e.target.checked })}
          style={{
            width: '16px', height: '16px',
            accentColor: 'var(--accent-rose)',
            cursor: 'pointer',
          }}
        />
        <label htmlFor="summary-flag" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          Show workflow summary on completion
        </label>
      </div>
    </div>
  )
}