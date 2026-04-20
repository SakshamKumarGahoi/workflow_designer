import { StartNode }    from './StartNode'
import { TaskNode }     from './TaskNode'
import { ApprovalNode } from './ApprovalNode'
import { AutoStepNode } from './AutoStepNode'
import { EndNode }      from './EndNode'

export const nodeTypes = {
  start:    StartNode,
  task:     TaskNode,
  approval: ApprovalNode,
  autoStep: AutoStepNode,
  end:      EndNode,
}