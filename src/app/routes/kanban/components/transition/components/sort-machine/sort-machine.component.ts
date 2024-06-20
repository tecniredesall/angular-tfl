import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { SortMachineDialogComponent } from 'src/app/routes/iot-devices/components/sort-machine-dialog/sort-machine-dialog.component';
import { ISortMachineListenerEvent } from 'src/app/routes/iot-devices/models/sort-machine-listener-event.model';
import { IProcessListModel } from 'src/app/routes/kanban/models/process-list.model';
import { ITRConfiguration } from 'src/app/shared/utils/models/configuration.model';

@Component({
  selector: 'app-sort-machine',
  templateUrl: './sort-machine.component.html',
  styleUrls: ['./sort-machine.component.scss']
})
export class SortMachineComponent implements OnInit {

  @Input() lotId: string;
  @Input() isEdit: boolean = false;
  @Input() configuration: ITRConfiguration;
  @Input() currentProcess: IProcessListModel;
  @Output() changeTotals: EventEmitter<any> = new EventEmitter();
  public machineSort: ISortMachineListenerEvent;
  public DECIMAL_PLACES: string;

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  public openModalSortMachine(){
    let dialog = this._dialog.open(SortMachineDialogComponent, {
      data: {
        lotId: `${this.currentProcess.name}${this.lotId}`,
        configuration: this.configuration
      }
    });
    dialog.afterClosed()
      .pipe(
        take(1)
      )
      .subscribe((result: any) => {
        if(result) {
          this.machineSort = result.data;
          this.DECIMAL_PLACES = result.DECIMAL_PLACES;
          this.changeTotals.emit(this.machineSort);
        }
      })
  }

}
