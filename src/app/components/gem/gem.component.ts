import { Component, Input } from '@angular/core';
import { Gem } from '@app/models';

@Component({
  selector: 'app-gem',
  templateUrl: './gem.component.html',
  styleUrls: ['./gem.component.scss']
})
export class GemComponent {

    @Input() gem: Gem;

}
