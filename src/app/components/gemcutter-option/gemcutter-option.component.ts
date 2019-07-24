import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gemcutter-option',
  templateUrl: './gemcutter-option.component.html',
  styleUrls: ['./gemcutter-option.component.scss']
})
export class GemcutterOptionComponent {

  @Input() type: string;
  @Input() label: string;
  @Input() checked: boolean;
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  onSelect(event: any) {
    this.selected.emit(this.type);
  }

}
