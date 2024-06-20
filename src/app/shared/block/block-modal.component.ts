import { Component } from '@angular/core';

@Component({
  selector: 'app-block-modal',
  template: `
    <div id="loader" class="loader-container">
      <div class="block-ui-overlay"></div>
      <div class="block-ui-message-container">
        <div class="block-ui-message">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./block-modal.component.css']
})
export class BlockModalUiComponent {

  constructor() { }

  static start: any = () => {
    document.getElementById('loader').style.display = 'flex';
  }

  static stop: any = () => {
    document.getElementById('loader').style.display = 'none';
  }
}
