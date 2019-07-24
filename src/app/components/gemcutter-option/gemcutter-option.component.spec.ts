import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemcutterOptionComponent } from './gemcutter-option.component';

describe('GemcutterOptionComponent', () => {
  let component: GemcutterOptionComponent;
  let fixture: ComponentFixture<GemcutterOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemcutterOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemcutterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
