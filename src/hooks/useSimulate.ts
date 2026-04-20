import { useState } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import { validateWorkflow } from '../lib/validateWorkflow'
import type { SimulationResult } from '../types'

export function useSimulate() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const { nodes, edges, setValidationErrors } = useWorkflowStore.getState()

  const run = async () => {
    const { errors, details } = validateWorkflow(nodes, edges)
    setValidationErrors(errors)

    const globalErrors = errors.filter(e => e.nodeId === '__global__')
    if (globalErrors.length > 0) {
      setResult({
        success: false,
        steps: [],
        error: globalErrors.map(e => e.message).join(', '),
        validationDetails: details.filter(d => d.nodeId === '__global__'),
      })
      setOpen(true)
      return
    }

    if (errors.length > 0) {
      setResult({
        success: false,
        steps: [],
        error: 'Fix node errors before simulating',
        validationDetails: details,
      })
      setOpen(true)
      return
    }

    setLoading(true)
    setOpen(true)
    try {
      const response = await fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })
      const data: SimulationResult = await response.json()
      setResult(data)
    } catch {
      setResult({ success: false, steps: [], error: 'Simulation request failed' })
    } finally {
      setLoading(false)
    }
  }

  return { run, result, loading, open, setOpen }
}