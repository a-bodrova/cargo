// Hand-written today, same shape the future generator would produce — see
// .claude/skills/generate-api.
import { setBetMutation } from '@/shared/api'
import { createMutation } from '@/shared/lib/wrappers'

export const useSetBet = createMutation(setBetMutation)
