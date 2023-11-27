import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  tablestring = `<div class="table-container">
  <table>
    <tbody>
      <tr>
        <td>Header1</td>
        <td
          data-label="Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1Definition1"
        >
          Row 1.1
        </td>
        <td data-label="Definition2">Row 2.1</td>
        <td data-label="Definition3">Row 3.1</td>
      </tr>
      <tr>
        <td>Header2</td>
        <td data-label="Definition1">Row 1.2</td>
        <td data-label="Definition2">Row 2.2</td>
        <td data-label="Definition3">Row 3.2</td>
      </tr>
    </tbody>
  </table>
</div>`;
}
