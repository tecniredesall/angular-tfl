import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlockFederatedViewComponent } from './block-federated-view.component';

describe('BlockFederatedViewComponent', () => {
  let component: BlockFederatedViewComponent;
  let fixture: ComponentFixture<BlockFederatedViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockFederatedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockFederatedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
