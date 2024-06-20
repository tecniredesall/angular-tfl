import { Component } from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockUiComponent {

  constructor() { }

  static start: any = () => {
    document.getElementById('loader').style.display = 'flex';
  }

  static stop: any = () => {
    document.getElementById('loader').style.display = 'none';
  }
}
