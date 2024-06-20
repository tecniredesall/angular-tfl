import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelTastingComponent } from './modal-cancel-tasting.component';

describe('ModalCancelTastingComponent', () => {
  let component: ModalCancelTastingComponent;
  let fixture: ComponentFixture<ModalCancelTastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCancelTastingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
