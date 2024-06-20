import { StringReplacePipe } from './../../../../shared/utils/pipes/string-replace.pipe';
import { RelatedProducersService } from './../../../producers/services/related-producers/related-producers.service';
import { Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { IIoTRecord } from '../../models/iot-record.model';
import { getGeneralDecimalPlaces } from "src/app/shared/utils/functions/decimals-configuration";
import { bufferWhen, debounceTime, map, take, takeUntil, tap } from 'rxjs/operators';
import { Subject, interval } from 'rxjs';
import { IScaleWeightEvent } from 'src/app/shared/models/scale-weight-event.model';
import { truncateDecimals } from 'src/app/shared/utils/functions/truncate-decimals';
import { IScaleListenerEvent } from 'src/app/routes/iot-devices/models/scale-listener-event.model';
import { ScaleSocketService } from '../../shared/services/scale-socket/scale-socket.service';
import { SCALES_LISTENER_ACTIONS, SSTSocketContract } from '../../shared/services/sst-socket/contracts/sst-socket-contract';

@Component({
    selector: 'tr-scale-listener',
    templateUrl: './scale-listener.component.html',
    styleUrls: ['./scale-listener.component.scss']
})
export class ScaleListenerComponent implements OnDestroy {

    @Input() status: IScaleListenerEvent = null;
    @Output() actions: EventEmitter<SCALES_LISTENER_ACTIONS> = new EventEmitter();
    readonly SCALE_LISTENER_STATUS: any = CONSTANTS.SCALE_LISTENER_STATUS;
    readonly DECIMAL_PLACES: number = getGeneralDecimalPlaces();
    public weightUnity: string = 'lb';
    public scaleStatus: string = CONSTANTS.SCALE_LISTENER_STATUS.UNSELECTED;
    public weight: number = 0;
    private closeScaleConnection$: Subject<boolean> = new Subject<boolean>();

    constructor(
    ) {
        this.status = {
                code: this.scaleStatus,
                weight: 0,
                unityMeasurement: this.weightUnity
            }
    }

    /**
     * Method called on destroy component
     */
    ngOnDestroy() {
        this.closeScaleConnection$.next(true);
        this.closeScaleConnection$.complete();
    }

    /**
     * Detect whem some input is changed
     * @param changes changes in component
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('status') && changes.status.previousValue !== changes.status.currentValue) {
                this.scaleStatus = changes.status.currentValue.code
                this.weight = changes.status.currentValue.weight
        }
    }

    /**
     * Method invoked for weigh again
     */
    public weighAgain(): void {
        this.actions.emit(SCALES_LISTENER_ACTIONS.WIGHT_AGAIN)
    }

    /**
     * Method invoked for retry connection
     */
    public retryConnectionToScale(): void {
        this.actions.emit(SCALES_LISTENER_ACTIONS.RETRY_CONNECTION)
    }
}
