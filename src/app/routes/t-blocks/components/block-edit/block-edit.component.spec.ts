import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlockEditComponent } from './block-edit.component';

describe('BlockEditComponent', () => {
  let component: BlockEditComponent;
  let fixture: ComponentFixture<BlockEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
