import { useWorkflowStore } from '../store/workflowStore'
import { Play, ClipboardList, CheckCircle, Zap, Square, Download, Upload, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NodeConfig {
  type: string
  label: string
  Icon: LucideIcon
  iconClass: string
}

const nodeConfig: NodeConfig[] = [
  {
    type: 'start',
    label: 'Start',
    Icon: Play,
    iconClass: 'node-icon--start',
  },
  {
    type: 'task',
    label: 'Task',
    Icon: ClipboardList,
    iconClass: 'node-icon--task',
  },
  {
    type: 'approval',
    label: 'Approval',
    Icon: CheckCircle,
    iconClass: 'node-icon--approval',
  },
  {
    type: 'autoStep',
    label: 'Auto Step',
    Icon: Zap,
    iconClass: 'node-icon--autostep',
  },
  {
    type: 'end',
    label: 'End',
    Icon: Square,
    iconClass: 'node-icon--end',
  },
]

export function Sidebar() {
  const exportWorkflow = useWorkflowStore(s => s.exportWorkflow)
  const importWorkflow = useWorkflowStore(s => s.importWorkflow)
  const resetWorkflow = useWorkflowStore(s => s.resetWorkflow)

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('nodeType', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleExport = () => {
    const json = exportWorkflow()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'workflow.json'; a.click()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => importWorkflow(ev.target?.result as string)
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p className="text-label" style={{ marginBottom: '8px' }}>Nodes</p>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          Drag onto canvas
        </p>
      </div>

      <div className="sidebar-items">
        {nodeConfig.map(n => (
          <div
            key={n.type}
            draggable
            onDragStart={e => handleDragStart(e, n.type)}
            className="sidebar-node-card"
          >
            <div className={`node-icon ${n.iconClass}`} style={{ width: '28px', height: '28px' }}>
              <n.Icon size={14} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {n.label}
            </span>
          </div>
        ))}
      </div>

      <div className="sidebar-actions">
        <button onClick={handleExport} className="btn btn-ghost" style={{ width: '100%', fontSize: '12px' }}>
          <Download size={14} />
          Export JSON
        </button>
        <button onClick={handleImport} className="btn btn-ghost" style={{ width: '100%', fontSize: '12px' }}>
          <Upload size={14} />
          Import JSON
        </button>
        <button onClick={resetWorkflow} className="btn btn-danger" style={{ width: '100%', fontSize: '12px' }}>
          <Trash2 size={14} />
          Reset
        </button>
      </div>
    </div>
  )
}