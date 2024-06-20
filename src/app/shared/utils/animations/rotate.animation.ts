import { trigger, state, animate, transition, style } from '@angular/animations';

export const rotate =
  trigger('rotate', [
    state('idle', style({ transform: 'rotate(0)'})),
    state('rotated', style({ transform: 'rotate(90deg)'})),
    transition('rotated => *', [
      animate(300)
    ]),
    transition('idle => *', [
      animate(300)
    ]),
  ]);

export const rotateUp =
  trigger('rotateUp', [
    state('idle', style({ transform: 'rotate(0) translateY(7px)'})),
    state('rotated', style({ transform: 'rotate(-180deg) translateY(-7px)'})),
    transition('rotated => *', [
      animate(300)
    ]),
    transition('idle => *', [
      animate(300)
    ]),
  ]);

export const rotateIcon =
  trigger('rotateIcon', [
    state('idle', style({ transform: 'rotate(0)'})),
    state('rotated', style({ transform: 'rotate(45deg)'})),
    transition('rotated => *', [
      animate(300)
    ]),
    transition('idle => *', [
      animate(300)
    ]),
  ]);
