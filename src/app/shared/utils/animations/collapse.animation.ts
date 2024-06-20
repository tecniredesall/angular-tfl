import { trigger, state, style, transition, animate } from '@angular/animations';

export const collapse =
trigger('collapse', [
    state('void', style({transform: 'scaleY(0.001)', height: '1%', 'transform-origin': 'top'})),
    transition(':enter, :leave', animate('400ms ease-in'))
]);

export const sonCollapse =
trigger('sonCollapse', [
    state('void', style({transform: 'scaleY(0.001)', height: '1px'})),
    transition(':enter, :leave', animate('400ms ease-in'))
]);
