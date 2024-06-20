import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProducersComponent } from './producers.component';

describe('ProducersComponent', () => {
  let component: ProducersComponent;
  let fixture: ComponentFixture<ProducersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
