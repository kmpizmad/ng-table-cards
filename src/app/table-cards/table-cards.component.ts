import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
export class TableCardsComponent implements OnInit {
  @Input() tableData!: string;
  @Input() headline!: string;

  @ViewChild('table') table!: ElementRef<HTMLDivElement>;

  private readonly domSanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.tableData = this.applyMobileAttributes(this.tableData);
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
}
