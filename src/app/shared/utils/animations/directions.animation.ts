import {animate, state, style, transition, trigger} from '@angular/animations';

export const leftDirection =
  trigger('leftDirection', [
    state('void', style({transform: 'translateX(-200px)', opacity: 0})),
    transition(':enter, :leave', animate('400ms ease-in'))
  ]);

export const rightDirection =
  trigger('rightDirection', [
    state('void', style({transform: 'translateX(200px)', opacity: 0, 'z-index': 100})),
    transition(':enter, :leave', animate('400ms ease-in'))
  ]);
