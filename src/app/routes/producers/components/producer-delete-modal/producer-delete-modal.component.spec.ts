import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducerDeleteModalComponent } from './producer-delete-modal.component';

describe('ProducerDeleteModalComponent', () => {
  let component: ProducerDeleteModalComponent;
  let fixture: ComponentFixture<ProducerDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
