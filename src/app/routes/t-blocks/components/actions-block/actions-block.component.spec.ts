import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionsBlockComponent } from './actions-block.component';

describe('ActionsBlockComponent', () => {
  let component: ActionsBlockComponent;
  let fixture: ComponentFixture<ActionsBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
