import { Subscription } from 'rxjs';

export interface IWNDeductionTradingStatusModel {
  isBeingCalculated: boolean;
  refTimeout: any;
  refRequest: Subscription;
  timestamp: number;
}

export class WNDeductionTradingStatusModel implements IWNDeductionTradingStatusModel {
  public isBeingCalculated: boolean = false;
  public refTimeout: any = null;
  public refRequest: Subscription = new Subscription();
  public timestamp: number = 0;

  constructor(item?: any) {
    if (item) {
      this.isBeingCalculated = item.isBeingCalculated ?? this.isBeingCalculated;
      this.refTimeout = item.refTimeout ?? this.refTimeout;
      this.refRequest = item.refRequest ?? this.refRequest;
      this.timestamp = item.timestamp ?? this.timestamp;
    }
    else {
      Object.assign(this, {});
    }
  }
}