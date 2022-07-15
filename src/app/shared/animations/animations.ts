import {
  animate,
  group,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const IN_OUT_ANIMATION = trigger('inOutAnimation', [
  transition(':enter', [animate('1s ease-out', style({ opacity: 1 }))]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('1s ease-in', style({ height: 0, opacity: 0 })),
  ]),
]);

export const FADE_IN_ANIMATION = trigger('fadeInAnimation', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(1500, style({ opacity: 1 })),
  ]),
]);

export const FADE_IN_ANIMATION_300 = trigger('fadeInAnimation300', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 })),
  ]),
]);

export const SLIDE_DOWN_ANIMATION = trigger('slideDownAnimation', [
  transition(
    ':enter',
    sequence([
      style({ 'max-height': '0px', opacity: '0' }),
      animate('500ms ease-in', style({ 'max-height': 550 })),
      animate('100ms ease-out', style({ opacity: 1 })),
    ])
  ),
  transition(
    ':leave',
    group([
      animate(
        '500ms ease-out',
        style({
          height: '0px',
        })
      ),
      animate(
        '400ms ease-out',
        style({
          opacity: '0',
        })
      ),
    ])
  ),
]);

export const DELAYED_RETURN_ANIMATION = [
  trigger('delayedReturnAnimation', [
    transition(
      ':enter',
      sequence([
        style({ display: 'none' }),
        animate('1ms 500ms', style({ display: 'block' })),
      ])
    ),
  ]),
];

export const ENTER_FROM_LEFT_ANIMATION = trigger('enterFromLeftAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-500px)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

export const ENTER_FROM_RIGHT_ANIMATION = trigger('enterFromRightAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(500px)' }),
    animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);
