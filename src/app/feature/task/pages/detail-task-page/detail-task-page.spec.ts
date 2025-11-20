import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTaskPage } from './detail-task-page';

describe('DetailTaskPage', () => {
  let component: DetailTaskPage;
  let fixture: ComponentFixture<DetailTaskPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTaskPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
