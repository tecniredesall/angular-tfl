import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTastingComponent } from './create-tasting.component';

describe('CreateTastingComponent', () => {
  let component: CreateTastingComponent;
  let fixture: ComponentFixture<CreateTastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTastingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
