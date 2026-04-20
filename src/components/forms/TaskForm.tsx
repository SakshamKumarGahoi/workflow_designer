import { useWorkflowStore } from '../../store/workflowStore'
import type { TaskNodeData } from '../../types'
import { Plus, X } from 'lucide-react'

export function TaskForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(s => s.nodes.find(n => n.id === nodeId))
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const d = node?.data as TaskNodeData
  const update = (patch: Partial<TaskNodeData>) => updateNodeData(nodeId, patch)

  const updateField = (index: number, field: 'key' | 'value', val: string) => {
    const customFields = [...(d.customFields ?? [])]
    customFields[index] = { ...customFields[index], [field]: val }
    update({ customFields })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        { label: 'Title *', key: 'title', placeholder: 'e.g. Collect Documents' },
        { label: 'Description', key: 'description', placeholder: 'What needs to be done' },
        { label: 'Assignee', key: 'assignee', placeholder: 'e.g. HR Manager' },
        { label: 'Due Date', key: 'dueDate', placeholder: 'e.g. 2025-12-31', type: 'date' },
      ].map(({ label, key, placeholder, type }) => (
        <div key={key}>
          <label className="form-label">{label}</label>
          <input
            type={type ?? 'text'}
            className="form-input"
            value={(d as any)?.[key] ?? ''}
            onChange={e => update({ [key]: e.target.value } as any)}
            placeholder={placeholder}
          />
        </div>
      ))}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Custom Fields</label>
          <button onClick={() => update({ customFields: [...(d.customFields ?? []), { key: '', value: '' }] })}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent-blue)', fontSize: '12px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
            <Plus size={12} /> Add
          </button>
        </div>
        {(d?.customFields ?? []).map((kv, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input className="form-input" style={{ flex: 1, padding: '6px 8px', fontSize: '12px' }}
              placeholder="key" value={kv.key} onChange={e => updateField(i, 'key', e.target.value)} />
            <input className="form-input" style={{ flex: 1, padding: '6px 8px', fontSize: '12px' }}
              placeholder="value" value={kv.value} onChange={e => updateField(i, 'value', e.target.value)} />
            <button onClick={() => update({ customFields: d.customFields.filter((_, idx) => idx !== i) })}
              style={{
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