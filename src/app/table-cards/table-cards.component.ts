import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrl: './table-cards.component.css',
})
export class TableCardsComponent implements AfterViewInit {
  @ViewChildren('row') tableRows:
    | QueryList<ElementRef<HTMLTableRowElement>>
    | undefined;

  private rows: (HTMLTableCellElement | null)[][] | undefined;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.equalizeCellHeights();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const list = window.matchMedia('(max-width: 1024px)');
    if (list.matches) {
      this.equalizeCellHeights();
    } else {
      this.rows?.forEach((row) => {
        row.forEach((cell) => {
          if (cell) {
            this.renderer.removeStyle(cell, 'height');
          }
        });
      });
    }
  }

  /**
   * Equalizes cell heights across table rows
   */
  private equalizeCellHeights(): void {
    this.rows = this.tableRows
      ?.toArray()
      .map((row) => Array.from(row.nativeElement.querySelectorAll('td')));

    if (!this.rows) return;

    const cellMatrix = this.transposeMatrix(this.rows);

    for (let i: number = 0; i < cellMatrix.length; i++) {
      this.setHeight(cellMatrix[i]);
    }
  }

  /**
   * Transposing a matrix
   * @param {Array} matrix input matrix
   * @returns a rotated matrix
   */
  private transposeMatrix<T>(matrix: T[][]): T[][] {
    const transposedMatrix: T[][] = [];
    for (let i: number = 0; i < matrix[0].length; i++) {
      transposedMatrix[i] = [];
      for (let j: number = 0; j < matrix.length; j++) {
        transposedMatrix[i][j] = matrix[j][i];
      }
    }
    return transposedMatrix;
  }

  /**
   * Sets the `height` CSS property on each element in the `group` using the `renderer` object
   * @param {Array} group input array
   */
  private setHeight<T extends HTMLElement>(group: (T | null)[]): void {
    const maxHeight = this.selectLargestHeight(group);
    for (let i: number = 0; i < group.length; i++) {
      const current = group[i];
      if (!current) continue;
      this.renderer.setStyle(current, 'height', `${maxHeight}px`);
    }
  }

  /**
   * Selects the largest `offsetHeight` from a list of `HTMLElement`
   * @param {Array} arr input array
   * @returns the largest `offsetHeight` in pixels
   */
  private selectLargestHeight<T extends HTMLElement>(
    arr: (T | null)[]
  ): number {
    let maxHeight: number = arr[0]?.offsetHeight ?? 0;
    for (let i: number = 1; i < arr.length; i++) {
      let current = arr[i];
      if (!!current && maxHeight < current.offsetHeight) {
        maxHeight = current.offsetHeight;
      }
    }
    return maxHeight;
  }
}
