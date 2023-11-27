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

  it('should change table layout when viewport is resized below 1024px', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('should transpose the cell group matrix', () => {
    const matrix = component['transposeMatrix']([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    expect(matrix).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });

  it('should select the largest visible height from an HTMLElement group', () => {
    const elements3 = createTestNodes(fixture.debugElement.nativeElement, 3);
    const elements5 = createTestNodes(fixture.debugElement.nativeElement, 5);
    const maxHeight3 = component['selectLargestHeight'](elements3);
    const maxHeight5 = component['selectLargestHeight'](elements5);
    removeTestNodes(fixture.debugElement.nativeElement, elements3);
    removeTestNodes(fixture.debugElement.nativeElement, elements5);
    expect(maxHeight3).toBe(2 ** 3);
    expect(maxHeight5).toBe(2 ** 5);
  });

  it('should set height to the largest height from an HTMLElement group', () => {
    const isSameHeight = (power: number) => (element: HTMLElement) =>
      element.style.height === `${2 ** power}px`;
    const elements3 = createTestNodes(fixture.debugElement.nativeElement, 3);
    const elements5 = createTestNodes(fixture.debugElement.nativeElement, 5);
    component['setHeight'](elements3);
    component['setHeight'](elements5);
    const isSameHeight3 = elements3.every(isSameHeight(3));
    const isSameHeight5 = elements5.every(isSameHeight(5));
    removeTestNodes(fixture.debugElement.nativeElement, elements3);
    removeTestNodes(fixture.debugElement.nativeElement, elements5);
    expect(isSameHeight3).toBeTrue();
    expect(isSameHeight5).toBeTrue();
  });
});

function createTestNodes(
  parent: HTMLElement,
  nodeCount: number = 3
): HTMLDivElement[] {
  const elements = [];
  for (let i: number = 0; i < nodeCount; i++) {
    const node = document.createElement('div');
    node.style.height = `${2 ** (i + 1)}px`;
    parent.appendChild(node);
    elements.push(node);
  }
  return elements;
}

function removeTestNodes(parent: HTMLElement, nodes: HTMLElement[]): void {
  for (let i: number = 0; i < nodes.length; i++) {
    parent.removeChild(nodes[i]);
  }
}
