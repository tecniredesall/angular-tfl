import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducerActionBlockComponent } from './producer-action-block.component';

describe('ProducerActionBlockComponent', () => {
  let component: ProducerActionBlockComponent;
  let fixture: ComponentFixture<ProducerActionBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerActionBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerActionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
