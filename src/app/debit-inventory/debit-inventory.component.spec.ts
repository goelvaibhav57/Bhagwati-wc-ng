import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitInventoryComponent } from './debit-inventory.component';

describe('DebitInventoryComponent', () => {
  let component: DebitInventoryComponent;
  let fixture: ComponentFixture<DebitInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
