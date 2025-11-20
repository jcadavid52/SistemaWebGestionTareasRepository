import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoTaskComponent } from './card-info-task-component';

describe('CardInfoTaskComponent', () => {
  let component: CardInfoTaskComponent;
  let fixture: ComponentFixture<CardInfoTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInfoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
