import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductionFlowsComponent } from './production-flows.component';

describe('ProductionFlowsComponent', () => {
  let component: ProductionFlowsComponent;
  let fixture: ComponentFixture<ProductionFlowsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionFlowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
