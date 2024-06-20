import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProcessComponent } from './create-process.component';

describe('CreateProcessComponent', () => {
  let component: CreateProcessComponent;
  let fixture: ComponentFixture<CreateProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
