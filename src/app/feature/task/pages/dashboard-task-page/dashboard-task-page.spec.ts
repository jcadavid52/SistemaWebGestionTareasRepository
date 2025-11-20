import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTaskPage } from './dashboard-task-page';

describe('DashboardTaskPage', () => {
  let component: DashboardTaskPage;
  let fixture: ComponentFixture<DashboardTaskPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTaskPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
