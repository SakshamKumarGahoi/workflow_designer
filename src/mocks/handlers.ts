import { http, HttpResponse } from 'msw'
import type { AutomationAction, SimulationResult } from '../types'

const automations: AutomationAction[] = [
  { id: 'send_email',    label: 'Send Email',        params: ['to', 'subject', 'body'] },
  { id: 'generate_doc',  label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack',    label: 'Send Slack Message',params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket',params: ['project', 'summary'] },
]

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json(automations)
  }),

  http.post('/simulate', async ({ request }) => {
    const body = await request.json() as { nodes: any[], edges: any[] }

    const steps: SimulationResult['steps'] = body.nodes
      .filter(n => n.type !== 'start')
      .map(node => ({
        nodeId: node.id,
        nodeTitle: node.data?.title || node.data?.endMessage || node.type,
        status: Math.random() > 0.15 ? 'success' : 'skipped',
        message: getStepMessage(node.type),
      }))

    const result: SimulationResult = {
      success: true,
      steps,
    }

    return HttpResponse.json(result)
  }),
]

function getStepMessage(type: string): string {
  const messages: Record<string, string> = {
    task:     'Task assigned and pending completion',
    approval: 'Approval request sent to approver role',
    autoStep: 'Automated action executed successfully',
    end:      'Workflow completed',
  }
  return messages[type] ?? 'Step processed'
}