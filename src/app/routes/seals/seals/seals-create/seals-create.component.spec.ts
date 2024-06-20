// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { SealsCreateComponent } from './seals-create.component';
// import {SharedModule} from '../../../../shared/shared.module';
// import {HttpClientTestingModule} from '@angular/common/http/testing';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {I18nService} from '../../../../shared/i18n/i18n.service';
// import {I18nPipe} from '../../../../shared/i18n/i18n.pipe';
// import {ActivatedRoute, Router} from '@angular/router';
// import {ActivatedRouteStub, RouterStub} from '../../../../shared/test-utils/test.utils';
// import {MaterialModule} from '../../../../material.module';
// import {NotifierModule} from 'angular-notifier';
//
// describe('SealsCreateComponent', () => {
//   let component: SealsCreateComponent;
//   let fixture: ComponentFixture<SealsCreateComponent>;
//
//   beforeEach(() => {
//     const user = {
//       // tslint:disable-next-line:max-line-length
//       token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVhOThiYjc2ZGVmN2YyZTg4ZmY1MWU4YmE0YzRhYjk1MmY0ZTNhZmJiZDhmYTEwZDY
//       xMGMyM2U5YjA3ZDA0YjFmZTU5YzM0MzA3ZWRjMDNhIn0.eyJhdWQiOiIxIiwianRpIjoiZWE5OGJiNzZkZWY3ZjJlODhmZjUxZThiYTRjNGFiOTUyZjRlM2
//       FmYmJkOGZhMTBkNjEwYzIzZTliMDdkMDRiMWZlNTljMzQzMDdlZGMwM2EiLCJpYXQiOjE1OTQyMjkxMjUsIm5iZiI6MTU5NDIyOTEyNSwiZXhwIjoxNTk1N
//       TI1MTI1LCJzdWIiOiIxIiwic2NvcGVzIjpbIioiXX0.LiP1A7uc_2k7kUXBe1cKtb76CQmOKQkTQhuXz3BEvhRO1yOJ27mHe8GPMEEj3RapjWMJpDb8mxVg
//       Yd1FzsgDFOFgCeLytZA-XuwCu2gDRa52o_hO72Nub8ZK0zg1N6W0IwbNLWN-3onf3zVl7SJsFcvehE15a8ooD7TYdE6t0UV_htSmlnHF-wFxjuT0gDhVVEU
//       dHKa8eZiOUrO58N5s22yRyfiE06cHRjgmWaRkuCD6Nz-536xJWOx6wGMJ2aEyiZDOtakhUQ_B9gq7hIV_pneaqIoAhXEsDTzSgitlzG_MD-oJwpPGK1CPKa
//       NdlDXtWTbGjl8oZemXSdI_eQguscR1mmcUjHbv80ItmNRbq2C36CMXEpIqcSuk6YA76qDNY3eZDR5OOsBIHhtEx7HQQL4vYun-kf1KQX7r2bfVvKZLWhrhW
//       PkBhKJvjYZc4s4VC1XGZxoXV2TQAdj9e0L6W02uksizrrCLot1UWz4p2z-yac3u7C8u3pSWlXp3Ukwk8-ITx2UpgJrIUiaXnW67IK4-uFHVb0KQ8KmlOALG
//       hij4ksL1jsC9ORdj-RntZgvHyWicxM7uPSJnVfKWA-OYIxhUyoo8J38OmV1CqwD1EnUCEVIByN5m8c1uTK-0mGYM3u0Y3oeAipHaTZyK1jHjCkrY10f6aRH
//       Wsn0C61kI-Js',
//       tokenType: 'Bearer',
//       userName: 'Administrator admin',
//       session: 1
//     };
//     localStorage.setItem('token-data', JSON.stringify(user));
//     TestBed.configureTestingModule({
//       imports: [
//         SharedModule,
//         MaterialModule,
//         NotifierModule,
//         HttpClientTestingModule,
//         FormsModule,
//         ReactiveFormsModule,
//       ],
//       declarations: [ SealsCreateComponent ],
//       providers: [
//         I18nService,
//         I18nPipe,
//         {
//           provide: Router,
//           useClass: RouterStub
//         },
//         {
//           provide: ActivatedRoute,
//           useValue: ActivatedRouteStub
//         }
//       ]
//     });
//   });
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(SealsCreateComponent);
//     component = fixture.componentInstance;
//     // fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
