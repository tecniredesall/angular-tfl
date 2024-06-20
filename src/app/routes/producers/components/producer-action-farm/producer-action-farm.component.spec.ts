import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducerActionFarmComponent } from './producer-action-farm.component';

describe('ProducerActionFarmComponent', () => {
  let component: ProducerActionFarmComponent;
  let fixture: ComponentFixture<ProducerActionFarmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerActionFarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerActionFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
