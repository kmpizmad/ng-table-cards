import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrl: './table-cards.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCardsComponent implements OnInit, AfterViewInit {
  @Input() tableData!: string;
  @Input() headline!: string;

  @ViewChild('table') table!: ElementRef<HTMLDivElement>;

  private rows!: HTMLTableCellElement[][];

  private readonly domSanitizer = inject(DomSanitizer);
  private readonly renderer = inject(Renderer2);

  ngOnInit(): void {
    this.tableData = this.applyMobileAttributes( this.tableData );
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

  private applyMobileAttributes(dom: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dom, 'text/html');
    const tableElement = doc.body.querySelector('table');

    if (tableElement) {
      const rows = tableElement.rows;
      for (let i = 0; i < rows.length; i++) {
        const firstCell = rows[i].cells[0];
        if (firstCell) {
          const attributeValue = firstCell.textContent || firstCell.innerText;
          for (let j = 1; j < rows[i].cells.length; j++) {
            rows[i].cells[j].setAttribute('data-label', attributeValue);
          }
        }
      }
    }

    return this.domSanitizer.bypassSecurityTrustHtml(
      tableElement ? tableElement.outerHTML : ''
    ) as string;
  }

  /**
   * Equalizes cell heights across table rows
   */
  private equalizeCellHeights(): void {
    const nativeRows = Array.from(
      this.table?.nativeElement.querySelectorAll('tr') || []
    );
    this.rows = nativeRows.map((row) => Array.from(row.querySelectorAll('td')));

    if (!this.rows) return;

    const cellMatrix = this.transposeTable(this.rows);
    for (let i: number = 0; i < cellMatrix.length; i++) {
      this.setHeight(cellMatrix[i]);
    }
  }

  /**
   * Transposing a matrix
   * @param {Array} matrix input matrix
   * @returns a rotated matrix
   */
  private transposeTable<T>(matrix: T[][]): T[][] {
    const transposed: T[][] = [];
    for (let i: number = 0; i < matrix[0].length; i++) {
      transposed[i] = [];
      for (let j: number = 0; j < matrix.length; j++) {
        transposed[i][j] = matrix[j][i];
      }
    }
    return transposed;
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
