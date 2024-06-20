import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnDestroy {
  public selectedTabIndex = 0;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ){
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(queryParams => {
        this.selectedTabIndex = queryParams.tabIndex ?? 0;
      })
  }

  public onChangeTab(tabIndex: number) {
    this._router.navigate(['routes', 'workflow'], { queryParams: { tabIndex } })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
