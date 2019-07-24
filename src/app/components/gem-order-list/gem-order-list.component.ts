import { Component, Input } from '@angular/core';
import { GemOrder } from '@app/models';

@Component({
  selector: 'app-gem-order-list',
  templateUrl: './gem-order-list.component.html',
  styleUrls: ['./gem-order-list.component.scss']
})
export class GemOrderListComponent {

  @Input() orders: GemOrder[] = [];

}
