import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCardsComponent } from './table-cards.component';

describe('TableCardsComponent', () => {
  let component: TableCardsComponent;
  let fixture: ComponentFixture<TableCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should change table layout when viewport is resized below 1024px', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });
});
