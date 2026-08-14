import { setup } from 'xstate';

export const revealMachine = setup({
  types: {
    events: {} as
      | { type: 'ASSETS_LOADED' }
      | { type: 'SWOOP_DONE' }
      | { type: 'TAP_GIFT' }
      | { type: 'UNWRAP_DONE' }
      | { type: 'PROMPT_PASSED' }
      | { type: 'NEXT' }
      | { type: 'REPLAY' },
  },
}).createMachine({
  id: 'reveal',
  initial: 'loading',
  states: {
    loading: {
      on: { ASSETS_LOADED: 'swoop' }
    },
    swoop: {
      on: { SWOOP_DONE: 'sealed_gift' }
    },
    sealed_gift: {
      on: { TAP_GIFT: 'unwrapping' }
    },
    unwrapping: {
      on: { UNWRAP_DONE: 'memory_gate' }
    },
    memory_gate: {
      on: { PROMPT_PASSED: 'greeting' }
    },
    greeting: {
      on: { NEXT: 'memories' }
    },
    memories: {
      on: { NEXT: 'celebration' }
    },
    celebration: {
      on: { REPLAY: 'swoop' } // Can loop back to swoop or sealed_gift
    }
  }
});
