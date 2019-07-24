import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemOrderListComponent } from './gem-order-list.component';

describe('GemOrderListComponent', () => {
  let component: GemOrderListComponent;
  let fixture: ComponentFixture<GemOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
