import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCardsComponent } from './table-cards.component';
import { Renderer2 } from '@angular/core';

describe('TableCardsComponent', () => {
  let component: TableCardsComponent;
  let fixture: ComponentFixture<TableCardsComponent>;
  let renderer: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCardsComponent],
      providers: [Renderer2],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCardsComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
