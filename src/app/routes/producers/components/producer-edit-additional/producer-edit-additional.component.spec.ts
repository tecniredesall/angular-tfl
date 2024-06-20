import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducerEditAdditionalComponent } from './producer-edit-additional.component';

describe('ProducerEditAdditionalComponent', () => {
  let component: ProducerEditAdditionalComponent;
  let fixture: ComponentFixture<ProducerEditAdditionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerEditAdditionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerEditAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
