import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModelComponent } from './create-model.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {I18nPipe} from 'src/app/shared/i18n/i18n.pipe';
import {I18nService} from 'src/app/shared/i18n/i18n.service';
import {MaterialModule} from '../../../../../material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from 'src/app/shared/test-utils/test.utils';
import {WorkflowService} from '../../../services/workflow.service';

describe('CreateModelComponent', () => {
  let component: CreateModelComponent;
  let fixture: ComponentFixture<CreateModelComponent>;

  function resize(width: number): void {
    spyOnProperty(window, 'innerWidth').and.returnValue(width);
  }
  beforeEach(() => {
    const user = {
      // tslint:disable-next-line:max-line-length
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVhOThiYjc2ZGVmN2YyZTg4ZmY1MWU4YmE0YzRhYjk1MmY0ZTNhZmJiZDhmYTEwZDYxMGMyM2U5YjA3ZDA0YjFmZTU5YzM0MzA3ZWRjMDNhIn0.eyJhdWQiOiIxIiwianRpIjoiZWE5OGJiNzZkZWY3ZjJlODhmZjUxZThiYTRjNGFiOTUyZjRlM2FmYmJkOGZhMTBkNjEwYzIzZTliMDdkMDRiMWZlNTljMzQzMDdlZGMwM2EiLCJpYXQiOjE1OTQyMjkxMjUsIm5iZiI6MTU5NDIyOTEyNSwiZXhwIjoxNTk1NTI1MTI1LCJzdWIiOiIxIiwic2NvcGVzIjpbIioiXX0.LiP1A7uc_2k7kUXBe1cKtb76CQmOKQkTQhuXz3BEvhRO1yOJ27mHe8GPMEEj3RapjWMJpDb8mxVgYd1FzsgDFOFgCeLytZA-XuwCu2gDRa52o_hO72Nub8ZK0zg1N6W0IwbNLWN-3onf3zVl7SJsFcvehE15a8ooD7TYdE6t0UV_htSmlnHF-wFxjuT0gDhVVEUdHKa8eZiOUrO58N5s22yRyfiE06cHRjgmWaRkuCD6Nz-536xJWOx6wGMJ2aEyiZDOtakhUQ_B9gq7hIV_pneaqIoAhXEsDTzSgitlzG_MD-oJwpPGK1CPKaNdlDXtWTbGjl8oZemXSdI_eQguscR1mmcUjHbv80ItmNRbq2C36CMXEpIqcSuk6YA76qDNY3eZDR5OOsBIHhtEx7HQQL4vYun-kf1KQX7r2bfVvKZLWhrhWPkBhKJvjYZc4s4VC1XGZxoXV2TQAdj9e0L6W02uksizrrCLot1UWz4p2z-yac3u7C8u3pSWlXp3Ukwk8-ITx2UpgJrIUiaXnW67IK4-uFHVb0KQ8KmlOALGhij4ksL1jsC9ORdj-RntZgvHyWicxM7uPSJnVfKWA-OYIxhUyoo8J38OmV1CqwD1EnUCEVIByN5m8c1uTK-0mGYM3u0Y3oeAipHaTZyK1jHjCkrY10f6aRHWsn0C61kI-Js',
      tokenType: 'Bearer',
      userName: 'Administrator admin',
      session: 1
    };
    localStorage.setItem('token-data', JSON.stringify(user));
    TestBed.configureTestingModule({
      declarations: [ CreateModelComponent ],
      imports: [
        FormsModule,
        MaterialModule,
        SharedModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        I18nPipe,
        I18nService,
        {
          provide: ActivatedRoute,
          useValue: ActivatedRouteStub
        },
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  beforeEach(() => {
    const route = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(CreateModelComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on no selected commodity, return to workflow main page', () => {
    const service = TestBed.get(WorkflowService);
    const router = TestBed.get(Router);
    const spy = spyOn(router, 'navigate');

    service.selectedCommodity = undefined;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(['/workflow']);
  });
});
