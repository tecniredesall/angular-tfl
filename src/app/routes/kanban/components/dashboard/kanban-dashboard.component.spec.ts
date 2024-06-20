import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KanbanDashboardComponent } from './kanban-dashboard.component';

describe('KanbanDashboardComponent', () => {
  let component: KanbanDashboardComponent;
  let fixture: ComponentFixture<KanbanDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
