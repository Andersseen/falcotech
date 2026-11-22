import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MoveLoopDirective } from 'angular-movement';

import { EUROPE_MAP } from './europe-map.data';

/**
 * A dotted map of Europe, tilted back in perspective, with Spain lit and a pulsing pin on it.
 * The dots are two prebuilt SVG paths (see scripts/europe-map.mjs): no request, rendered on the server.
 */
@Component({
  selector: 'app-europe-map',
  imports: [MoveLoopDirective],
  template: `
    <div class="spain-map" role="img" [attr.aria-label]="label()">
      <div class="spain-plane">
        <svg [attr.viewBox]="'0 0 ' + map.width + ' ' + map.height" aria-hidden="true">
          <!-- Each dot is a zero-length segment with a round cap. -->
          <path class="europe" [attr.d]="map.europe" />
          <path class="spain" [attr.d]="map.spain" />
          <circle [attr.cx]="map.pin.x" [attr.cy]="map.pin.y" r="1.4" class="pin-pulse"
            [moveLoop]="{ scale: [1, 6], opacity: [0.7, 0] }" moveDuration="2200ms" />
          <circle [attr.cx]="map.pin.x" [attr.cy]="map.pin.y" r="1.4" class="pin-dot" />
        </svg>
        <!-- Anchored to Spain inside the tilted plane, then turned back upright so it stands on the pin. -->
        <span class="pin-anchor" [style.left.%]="(map.pin.x / map.width) * 100" [style.top.%]="(map.pin.y / map.height) * 100"
          aria-hidden="true">
          <span class="pin-label">
            <span class="font-semibold">{{ here() }}</span>
            <span class="text-muted-foreground">{{ place() }}</span>
          </span>
        </span>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }

    .spain-map {
      perspective: 1000px;
      padding-top: 2.5rem;
    }

    .spain-plane {
      position: relative;
      transform: rotateX(34deg);
      transform-origin: 50% 100%;
      transform-style: preserve-3d;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      /* On the svg only: a mask on the plane would flatten the 3D label. */
      mask-image: linear-gradient(to bottom, transparent, black 25%);
    }

    path {
      fill: none;
      stroke-linecap: round;
      stroke-width: 2.1;
    }

    .europe {
      stroke: color-mix(in oklab, var(--color-foreground) 16%, transparent);
    }

    .spain {
      stroke: var(--color-foreground);
    }

    .pin-dot,
    .pin-pulse {
      fill: var(--color-foreground);
    }

    .pin-pulse {
      transform-box: fill-box;
      transform-origin: center;
    }

    .pin-anchor {
      position: absolute;
      width: 0;
      height: 0;
      transform-style: preserve-3d;
    }

    .pin-label {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.125rem;
      margin-bottom: 2.75rem;
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      background: var(--color-background);
      font-size: 0.75rem;
      line-height: 1.2;
      white-space: nowrap;
      box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.4);
      transform: translateX(-50%) rotateX(-34deg);
      transform-origin: 50% calc(100% + 2.75rem);
    }

    .pin-label::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 1px;
      height: 2.75rem;
      background: linear-gradient(var(--color-foreground), transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EuropeMap {
  readonly label = input.required<string>();
  readonly here = input.required<string>();
  readonly place = input.required<string>();
  protected readonly map = EUROPE_MAP;
}
