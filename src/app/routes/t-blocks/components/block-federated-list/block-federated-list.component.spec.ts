import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlockFederatedListComponent } from './block-federated-list.component';

describe('BlockFederatedListComponent', () => {
  let component: BlockFederatedListComponent;
  let fixture: ComponentFixture<BlockFederatedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockFederatedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockFederatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
