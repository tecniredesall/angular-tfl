import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScaleListenerComponent } from './scale-listener.component';

describe('ScaleListenerComponent', () => {
  let component: ScaleListenerComponent;
  let fixture: ComponentFixture<ScaleListenerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleListenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
