import { GemVariant } from './gem-variant.model';

export type GemState =
    'waiting'
    | 'in-progress'
    | 'discarded'
    | 'completed';

export interface Gem {
  id: number;
  type: GemVariant;
  state: GemState;
}
