import { Observable } from 'rxjs';
import { Gem } from '@app/models';

export interface GemOrder {
  gem: Gem;
  job: Observable<Gem>;
}
