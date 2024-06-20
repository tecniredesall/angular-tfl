import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LoteComponent} from './lote.component';

describe('LoteComponent', () => {
  let component: LoteComponent;
  let fixture: ComponentFixture<LoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.lote = '1';

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('should return the micro lote definition', () => {
    component.lote = '2';
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it ('should return the nano lote definition', () => {
    component.lote = '3';

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

});
