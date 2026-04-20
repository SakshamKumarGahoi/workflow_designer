import { useEffect, useState } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import type { AutoStepNodeData, AutomationAction } from '../../types'
import { Loader2 } from 'lucide-react'

export function AutoStepForm({ nodeId }: { nodeId: string }) {
  const node = useWorkflowStore(s => s.nodes.find(n => n.id === nodeId))
  const updateNodeData = useWorkflowStore(s => s.updateNodeData)
  const d = node?.data as AutoStepNodeData
  const update = (patch: Partial<AutoStepNodeData>) => updateNodeData(nodeId, patch)

  const [actions, setActions] = useState<AutomationAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/automations')
      .then(r => r.json())
      .then((data: AutomationAction[]) => { setActions(data); setLoading(false) })
  }, [])

  const selectedAction = actions.find(a => a.id === d?.actionId)

  const handleActionChange = (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    const actionParams: Record<string, string> = {}
    action?.params.forEach(p => { actionParams[p] = '' })
    update({ actionId, actionParams })
  }

  const updateParam = (param: string, value: string) => {
    update({ actionParams: { ...(d.actionParams ?? {}), [param]: value } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label className="form-label">Title</label>
        <input className="form-input"
          value={d?.title ?? ''} onChange={e => update({ title: e.target.value })} placeholder="e.g. Send Welcome Email" />
      </div>
      <div>
        <label className="form-label">Action</label>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
            <Loader2 size={14} className="animate-spin-slow" /> Loading actions...
          </div>
        ) : (
          <select className="form-select"
            value={d?.actionId ?? ''} onChange={e => handleActionChange(e.target.value)}>
            <option value="">Select an action</option>
            {actions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <label className="form-label" style={{ marginBottom: '8px' }}>Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param} style={{ marginBottom: '8px' }}>
              <label style={{
                display: 'block', fontSize: '12px', color: 'var(--text-secondary)',
                marginBottom: '4px', textTransform: 'capitalize',
              }}>{param}</label>
              <input className="form-input"
                value={d?.actionParams?.[param] ?? ''}
                onChange={e => updateParam(param, e.target.value)}
                placeholder={param} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}