import { useWorkflowStore } from '../../store/workflowStore'
import type { StartNodeData } from '../../types'
import { Plus, X } from 'lucide-react'

export function StartForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(s => s.nodes.find(n => n.id === nodeId))
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const d = node?.data as StartNodeData

  const update = (patch: Partial<StartNodeData>) => updateNodeData(nodeId, patch)

  const updateMeta = (index: number, field: 'key' | 'value', val: string) => {
    const metadata = [...(d.metadata ?? [])]
    metadata[index] = { ...metadata[index], [field]: val }
    update({ metadata })
  }

  const addMeta = () => update({ metadata: [...(d.metadata ?? []), { key: '', value: '' }] })
  const removeMeta = (i: number) => update({ metadata: d.metadata.filter((_, idx) => idx !== i) })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="form-label">Start Title</label>
        <input
          className="form-input"
          value={d?.title ?? ''}
          onChange={e => update({ title: e.target.value })}
          placeholder="e.g. Employee Onboarding"
        />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Metadata</label>
          <button
            onClick={addMeta}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent-emerald)', fontSize: '12px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
        {(d?.metadata ?? []).map((kv, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input className="form-input" style={{ flex: 1, padding: '6px 8px', fontSize: '12px' }}
              placeholder="key" value={kv.key} onChange={e => updateMeta(i, 'key', e.target.value)} />
            <input className="form-input" style={{ flex: 1, padding: '6px 8px', fontSize: '12px' }}
              placeholder="value" value={kv.value} onChange={e => updateMeta(i, 'value', e.target.value)} />
            <button onClick={() => removeMeta(i)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent-red)', padding: '0 4px', display: 'flex', alignItems: 'center',
            }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}