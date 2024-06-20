import {Observable, of} from 'rxjs';

export class RouterStub {
  navigate(params) {}
}

export class ModalResponse {
  res: boolean;
}

export class MatDialogRefStub {
  close(value) {}
}

export const ActivatedRouteStub = {
  paramMap: {
    subscribe() {
      return of();
    }
  },
  queryParams: {
    subscribe(): Observable<unknown> {
      return of();
    }
  },
  snapshot: {
    queryParams: {}
  }
};
