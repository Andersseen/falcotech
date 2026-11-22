import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { VoltBadge } from '@voltui/components';
import { MoveLoopDirective } from 'angular-movement';

import { EUROPE_MAP } from './europe-map.data';

/**
 * A dotted map of Europe, tilted back in perspective, with Spain lit and a pulsing pin on it.
 * The dots are two prebuilt SVG paths (see scripts/europe-map.mjs): no request, rendered on the server.
 */
@Component({
  selector: 'app-europe-map',
  imports: [MoveLoopDirective, VoltBadge],
  template: `
    <div class="europe-map" role="img" [attr.aria-label]="label()">
      <div class="europe-plane">
        <svg [attr.viewBox]="'0 0 ' + map.width + ' ' + map.height" aria-hidden="true">
          <!-- Each dot is a zero-length segment with a round cap. -->
          <path class="europe" [attr.d]="map.europe" />
          <path class="spain" [attr.d]="map.spain" />
          <circle [attr.cx]="map.pin.x" [attr.cy]="map.pin.y" r="1.5" class="pin-pulse"
            [moveLoop]="{ scale: [1, 6], opacity: [0.7, 0] }" moveDuration="2200ms" />
          <circle [attr.cx]="map.pin.x" [attr.cy]="map.pin.y" r="1.5" class="pin-dot" />
        </svg>
        <!-- Anchored to Spain inside the tilted plane, then turned back upright so it stands on the pin. -->
        <span class="pin-anchor" [style.left.%]="(map.pin.x / map.width) * 100" [style.top.%]="(map.pin.y / map.height) * 100"
          aria-hidden="true">
          <volt-badge variant="outline" class="pin-label">
            <span class="font-semibold">{{ here() }}</span>
            <span class="font-normal text-muted-foreground">{{ place() }}</span>
          </volt-badge>
        </span>
      </div>
    </div>
  `,
  styles: `
    /* Decorative: it may slide under the form above it, so it must never take its clicks. */
    :host { display: block; pointer-events: none; }

    .europe-map {
      perspective: 1400px;
      /* Tilting back shortens the map, but its box keeps the full height: pull it up by the
         difference (a percentage margin follows the width, as the height does). */
      margin-top: -24%;
      padding-top: 3.5rem;
    }

    /* On narrow screens the whole of Europe would be a smudge: keep it at a readable size, centred
       on Spain (about 30% from the left edge), and let the sides run off the screen. */
    @media (max-width: 40rem) {
      :host { overflow: clip; }

      .europe-map {
        width: 44rem;
        margin-top: calc(-0.24 * 44rem);
        margin-left: calc(50% - 0.3 * 44rem);
      }
    }

    .europe-plane {
      position: relative;
      transform: rotateX(42deg);
      transform-origin: 50% 100%;
      transform-style: preserve-3d;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      /* On the svg only: a mask on the plane would flatten the 3D label. Fades out at the top and
         the sides; the bottom edge stays solid so the dots run on into the footer's. */
      mask-image:
        linear-gradient(to bottom, transparent, black 30%),
        linear-gradient(to right, transparent, black 12%, black 88%, transparent);
      mask-composite: intersect;
    }

    path {
      fill: none;
      stroke-linecap: round;
      stroke-width: 0.9;
    }

    /* The same quiet grey as the footer's dots, so the map reads as the start of the footer. */
    .europe {
      stroke: color-mix(in oklab, var(--color-foreground) 20%, transparent);
    }

    .spain {
      stroke: color-mix(in oklab, var(--color-foreground) 85%, transparent);
      stroke-width: 1.15;
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

    /* A Volt badge, stood upright on the pin. */
    .pin-label {
      position: absolute;
      bottom: 0;
      left: 0;
      flex-direction: column;
      gap: 0.125rem;
      margin-bottom: 2.75rem;
      padding: 0.375rem 0.75rem;
      background: var(--color-background);
      line-height: 1.2;
      white-space: nowrap;
      transform: translateX(-50%) rotateX(-42deg);
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
