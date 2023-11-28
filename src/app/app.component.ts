import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  tablestring = `
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
}
