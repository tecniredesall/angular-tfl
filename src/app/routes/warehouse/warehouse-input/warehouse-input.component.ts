import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-warehouse-input',
  templateUrl: './warehouse-input.component.html',
  styleUrls: ['./warehouse-input.component.css']
})
export class WarehouseInputComponent {

  @Input() tag: string;
}
