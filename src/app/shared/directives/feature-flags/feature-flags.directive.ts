import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeatureFlagsService } from '../../services/feature-flags/feature-flags.service';

@Directive({
  selector: '[featureFlags]'
})
export class FeatureFlagsDirective {

  private requiredFlag: string = "";
  private isHidden = true;
  private _subscription = new Subscription()
  
  @Input() set featureFlags(val: string) {
    if (val) {
      this.requiredFlag = val;
      this.updateView();
    }
  }
  
  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _featureFlags: FeatureFlagsService
  ) {
    this._subscription.add(this._featureFlags.onGetFlagsEvent.subscribe(
      response => this.updateView()
    ))
  }

  ngOnInit() {}

  private updateView() {
    if (this.checkValidity()) {
      if (this.isHidden) {
        this._viewContainer.createEmbeddedView(this._templateRef);
        this.isHidden = false;
      }
    } else {
      this._viewContainer.clear();
      this.isHidden = true;
    }
  }

  private checkValidity() {
    return (
      this.requiredFlag &&
      this._featureFlags.isFeatureFlagEnabled(this.requiredFlag)
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}
