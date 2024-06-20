import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeleteBlockComponent } from './modal-delete-block.component';

describe('ModalDeleteBlockComponent', () => {
  let component: ModalDeleteBlockComponent;
  let fixture: ComponentFixture<ModalDeleteBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
