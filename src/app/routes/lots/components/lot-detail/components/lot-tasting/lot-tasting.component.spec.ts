import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotTastingComponent } from './lot-tasting.component';

describe('LotTastingComponent', () => {
  let component: LotTastingComponent;
  let fixture: ComponentFixture<LotTastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotTastingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
