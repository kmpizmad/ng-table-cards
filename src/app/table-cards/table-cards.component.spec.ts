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

  it('should add data-label to cells', () => {
    const testHtmlString = `
    <table>
      <tbody>
        <tr>
            <td>Definitions</td>
            <td>Column 1</td>
            <td>Column 2</td>
            <td>Column 3</td>
        </tr>
        <tr>
            <td>Definition 1</td>
            <td>Row 1</td>
            <td>Row 1</td>
            <td>Row 1</td>
        </tr>
        <tr>
            <td>Definition 2</td>
            <td>Row 2</td>
            <td>Row 2</td>
            <td>Row 2</td>
        </tr>
        <tr>
            <td>Definition 3</td>
            <td>Row 3</td>
            <td>Row 3</td>
            <td>Row 3</td>
        </tr>
      </tbody>
    </table>
  `;

    const result = component['applyMobileAttributes'](testHtmlString);
    expect(result.includes('data-label="Definition 1"')).toBeTruthy();
    expect(result.includes('data-label="Definition 2"')).toBeTruthy();
    expect(result.includes('data-label="Definition 3"')).toBeTruthy();
  });
});
