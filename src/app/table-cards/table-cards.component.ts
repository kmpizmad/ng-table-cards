import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrl: './table-cards.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TableCardsComponent implements OnInit, AfterViewInit {
  @Input() tablestring: string = '';
  @ViewChild('table') table: ElementRef<HTMLDivElement> | undefined;

  private rows: HTMLTableCellElement[][] | undefined;

  constructor(
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.tablestring = this.domSanitizer.bypassSecurityTrustHtml(
      this.tablestring
    ) as string;
  }

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
    const nativeRows = Array.from(
      this.table?.nativeElement.querySelectorAll('.table-container tr') || []
    );
    this.rows = nativeRows.map((row) => Array.from(row.querySelectorAll('td')));

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
  private setHeight<T extends HTMLElement>(group: T[]): void {
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
  private selectLargestHeight<T extends HTMLElement>(arr: T[]): number {
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
