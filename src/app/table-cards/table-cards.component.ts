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

    const maxLength = this.selectLargestRow(this.rows);
    this.rows = this.rows.map((row) =>
      this.fillWithNull(row, maxLength - row.length)
    );
    const groups = this.createCellGroups(this.rows, maxLength);

    for (let i: number = 0; i < groups.length; i++) {
      this.setHeight(groups[i]);
    }
  }

  /**
   * Groups the neighbouring cells into a new row and adding them to the output object
   * @param {Array} data input jagged array
   * @param {number} columns number of columns
   * @returns a new jagged array
   */
  private createCellGroups(
    data: (HTMLTableCellElement | null)[][],
    columns: number
  ): (HTMLTableCellElement | null)[][] {
    const groups: (HTMLTableCellElement | null)[][] = [];
    for (let i: number = 0; i < columns; i++) {
      groups[i] = [];
      for (let j: number = 0; j < data.length; j++) {
        groups[i][j] = data[j][i];
      }
    }
    return groups;
  }

  /**
   * Sets the `height` CSS property on each element in the `group` using the `renderer` object
   * @param {Array} group input array
   */
  private setHeight(group: (HTMLTableCellElement | null)[]): void {
    const maxHeight = this.selectLargestHeight(group);
    for (let i: number = 0; i < group.length; i++) {
      const current = group[i];
      if (!current) continue;
      this.renderer.setStyle(current, 'height', `${maxHeight}px`);
    }
  }

  /**
   * Selects the largest row from a jagged array
   * @param {Array} arr input array
   * @returns the length of the largest row
   */
  private selectLargestRow<T>(arr: T[][]): number {
    let maxLength: number = arr[0].length;
    for (let i: number = 1; i < arr.length; i++) {
      if (maxLength < arr[i].length) {
        maxLength = arr[i].length;
      }
    }
    return maxLength;
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

  /**
   * Add `null` values to an array as many times as the `count` value specifies
   * @param {Array} arr input array
   * @param {number} count defines how many times does it need to push `null` into the `arr`
   * @returns a new array
   */
  private fillWithNull<T>(arr: (T | null)[], count: number): (T | null)[] {
    const localCopy = [...arr];
    for (let i: number = 0; i < count; i++) {
      localCopy.push(null);
    }
    return localCopy;
  }
}
