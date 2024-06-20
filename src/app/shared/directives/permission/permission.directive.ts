import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Directive({
  selector: '[permission]'
})
export class PermissionDirective {
  
  private tag = "";
  private type = "";
  private isHidden = true;
  
  @Input() set permission(val: {tag: string, type: string}) {
    if (val) {
      this.tag = val.tag;
      this.type = val.type;
      this.updateView();
    }
  }
  
  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _permissionsService: PermissionsService
  ) {}

  ngOnInit() {}

  private updateView() {
    if (this._permissionsService.checkValidity(this.tag, this.type)) {
      if (this.isHidden) {
        this._viewContainer.createEmbeddedView(this._templateRef);
        this.isHidden = false;
      }
    } else {
      this._viewContainer.clear();
      this.isHidden = true;
    }
  }

}
