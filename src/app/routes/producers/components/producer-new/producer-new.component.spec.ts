import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducerNewComponent } from './producer-new.component';

describe('ProducerNewComponent', () => {
  let component: ProducerNewComponent;
  let fixture: ComponentFixture<ProducerNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
