import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlockEditFederatedComponent } from './block-edit-federated.component';

describe('BlockEditFederatedComponent', () => {
  let component: BlockEditFederatedComponent;
  let fixture: ComponentFixture<BlockEditFederatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockEditFederatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockEditFederatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
