import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenListTaskPage } from './screen-list-task-page';

describe('ScreenListTaskPage', () => {
  let component: ScreenListTaskPage;
  let fixture: ComponentFixture<ScreenListTaskPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenListTaskPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenListTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
