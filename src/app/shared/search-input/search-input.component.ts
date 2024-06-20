import { Component, EventEmitter, HostBinding, Output, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/theme/theme.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent implements OnDestroy {

  @Input() isDisabledSearchInput: boolean = false;
  @Input() searchValue: string = '';
  @Input() isFocused: boolean = false;
  @Output() clearEvent = new EventEmitter();

  @HostBinding('class.input-focus') get isInputFocus() { return this.isFocused; }
  @HostBinding('class.si-disabled') get isDisabledComponent() { return this.isDisabledSearchInput; }

  public isDarkTheme: boolean;
  private _subscriptions: Subscription;

  constructor(
    private themeService: ThemeService
  ) {

    this._subscriptions = new Subscription();

    this._subscriptions.add(
      this.themeService.theme.subscribe(theme => {
        this.isDarkTheme = ('dark' === theme);
      })
    );

  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  clearData() {
    if (!this.isDisabledSearchInput) {
      this.clearEvent.emit(true);
    }
  }

}
