import { Observable, Subscription } from 'rxjs';
import { concatMap, mergeMap, switchMap, exhaustMap } from 'rxjs/operators';

import { AppComponent } from '@app/app.component';
import { Gem, GemOrder } from '@app/models';

/**
 * Base GemWorker class.
 */
export class GemWorker {

  protected app: AppComponent;

  protected currentOrders: Gem[] = [];

  private gemSubscription: Subscription;

  constructor(app: AppComponent) {
    this.app = app;
  }

  start(gemProducer: Observable<GemOrder>) {
    this.gemSubscription = this.createSubscription(gemProducer);
  }

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    throw new Error('Not implemented!');
  }

  stop() {
    if (this.gemSubscription) {
      this.gemSubscription.unsubscribe();
    }

    this.discardAllOrders();
  }

  discardAllOrders() {
    if (this.currentOrders.length > 0) {
      this.currentOrders.forEach(order => this.app.discardOrder(order));
      this.currentOrders = [];
    }
  }

  addOrder(order: Gem) {
    this.currentOrders.push(order);
  }

  removeOrder(order: Gem) {
    this.currentOrders = this.currentOrders.filter(item => item !== order);
  }

}

/**
 * Worker that does nothing.
 */
export class NoWorker extends GemWorker {

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    return gemProducer
    .subscribe(
      // Do nothing!
    );
  }

}

/**
 * Worker that processes Gems in sequence.
 */
export class ConcatMapWorker extends GemWorker {

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    return gemProducer
      .pipe(
        concatMap(order => order.job)
      )
      .subscribe(
        // Process the new Gem
        gem => this.app.completeOrder(gem)
      );
  }

}

/**
 * Worker that processes Gems in parallel.
 */
export class MergeMapWorker extends GemWorker {

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    return gemProducer
      .pipe(
        mergeMap(order => order.job)
      )
      .subscribe(
        // Process the new Gem
        gem => this.app.completeOrder(gem)
      );
  }

}

/**
 * Worker that discards Gems that are in progress in order to process new Gems.
 */
export class SwitchMapWorker extends GemWorker {

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    return gemProducer
      .pipe(
        switchMap(order => order.job)
      )
      .subscribe(
        // Process the new Gem
        gem => this.app.completeOrder(gem)
      );
  }

  addOrder(order: Gem) {
    this.discardAllOrders();
    super.addOrder(order);
  }

}

/**
 * Worker that ignores new Gems when a Gem is in progress.
 *
 * Note that we don't use the real `exhaustMap` operator here, because it would
 * prevent any incoming orders from reaching the ExhaustMapWorker while he is
 * busy, thus any such orders could not be correctly discarded.
 *
 * Instead, we simulate the `exhaustMap` operator by using `mergeMap`, and
 * manually discarding any incoming orders while busy.
 */
export class ExhaustMapWorker extends GemWorker {

  createSubscription(gemProducer: Observable<GemOrder>): Subscription {
    return gemProducer
      .pipe(
        mergeMap(order => order.job)
      )
      .subscribe(
        // Process the new Gem
        gem => this.app.completeOrder(gem)
      );
  }

  addOrder(order: Gem) {
    if (this.currentOrders.length === 0) {
      super.addOrder(order);
    } else {
      this.app.discardOrder(order);
    }
  }

}
