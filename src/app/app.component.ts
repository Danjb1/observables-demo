import { OnInit, OnDestroy, Component } from '@angular/core';

import { interval, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';

import { Gem, GemOrder, GemRecipe } from '@app/models';
import {
  GemFactory,
  GemWorker,
  NoWorker,
  ConcatMapWorker,
  MergeMapWorker,
  SwitchMapWorker,
  ExhaustMapWorker
} from '@app/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private static readonly GEM_RECIPES: GemRecipe[] = [
    { type: { colour: '#d11717', time: 500 }, weight: 100 },
    { type: { colour: '#17d129', time: 1000 }, weight: 75 },
    { type: { colour: '#28b1d3', time: 2000 }, weight: 50 },
    { type: { colour: '#e8ce40', time: 3500 }, weight: 25 },
    { type: { colour: '#cc14bf', time: 6000 }, weight: 10 },
    { type: { colour: '#3e127c', time: 10000 }, weight: 5 },
    { type: { colour: '#c4cad3', time: 15000 }, weight: 1 },
  ];

  private readonly WORKERS: {[name: string]: GemWorker} = {
    'none': new NoWorker(this),
    'concat-map': new ConcatMapWorker(this),
    'merge-map': new MergeMapWorker(this),
    'switch-map': new SwitchMapWorker(this),
    'exhaust-map': new ExhaustMapWorker(this)
  };

  orders$: Subject<GemOrder> = new Subject();

  currentWorker: GemWorker;

  gemFactory: GemFactory = new GemFactory();

  orders: GemOrder[] = [];

  ngOnInit(): void {

    // Register our GemRecipes
    for (const recipe of AppComponent.GEM_RECIPES) {
      this.gemFactory.register(recipe);
    }

    this.produceGems();
    this.setCurrentWorker('none');
  }

  ngOnDestroy(): void {
      this.currentWorker.stop();
  }

  produceGems(): void {
    interval(1000)
      .pipe(

        // Create a random Gem
        map(i => this.gemFactory.create()),

        // Filter out null values
        filter(gem => !!gem),

        // Create an order from this Gem
        map(gem => this.createOrder(gem)),

    ).subscribe((order) => {
      this.orders.push(order);
      this.orders$.next(order);
    });
  }

  gemcutterChanged(worker: string): void {
    this.setCurrentWorker(worker);
  }

  setCurrentWorker(worker: string): void {

    // Stop the previous worker
    if (this.currentWorker) {
      this.currentWorker.stop();
    }

    // Start the new worker
    this.currentWorker = this.WORKERS[worker];
    this.currentWorker.start(this.orders$);

    // Emit all waiting orders
    this.orders.forEach((order) => {
      if (order.gem.state === 'waiting') {
        this.orders$.next(order);
      }
    });
  }

  createOrder(gem: Gem): GemOrder {

    // Create an Observable representing this Gem as an order
    const job = of(gem)
      .pipe(

        // Do some functionality before starting work
        tap(gemToCommence => this.commenceOrder(gemToCommence)),

        // The Gem should take some time to process
        delay(gem.type.time)
      );

    return { gem, job };
  }

  commenceOrder(gem: Gem): void {
    gem.state = 'in-progress';

    if (this.currentWorker) {
      this.currentWorker.addOrder(gem);
    }
  }

  completeOrder(gem: Gem): void {

    if (gem.state !== 'in-progress') {
      // Gem has already been completed or discarded
      return;
    }

    gem.state = 'completed';

    if (this.currentWorker) {
      this.currentWorker.removeOrder(gem);
    }
  }

  discardOrder(gem: Gem): void {

    if (gem.state !== 'waiting' && gem.state !== 'in-progress') {
      // Gem has already been completed or discarded
      return;
    }

    gem.state = 'discarded';

    if (this.currentWorker) {
      this.currentWorker.removeOrder(gem);
    }
  }

}
