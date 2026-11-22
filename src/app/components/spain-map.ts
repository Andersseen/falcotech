import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MoveLoopDirective } from 'angular-movement';

type Point = readonly [lon: number, lat: number];

/* Simplified outlines (longitude, latitude), accurate enough for a dotted silhouette. */
const PENINSULA: readonly Point[] = [
  [-9.3, 43.05], [-8.85, 43.35], [-8.2, 43.55], [-7.7, 43.78], [-7.0, 43.55], [-5.85, 43.65], [-4.5, 43.4],
  [-3.8, 43.47], [-2.9, 43.42], [-1.8, 43.38], [-1.4, 43.05], [-0.7, 42.85], [0.7, 42.85], [1.45, 42.6],
  [2.2, 42.42], [3.17, 42.43], [3.2, 42.1], [2.8, 41.65], [2.17, 41.38], [1.2, 41.1], [0.85, 40.7], [0.0, 39.9],
  [-0.33, 39.45], [0.2, 38.75], [-0.5, 38.35], [-0.75, 37.65], [-1.3, 37.55], [-1.9, 36.95], [-2.2, 36.72],
  [-2.9, 36.73], [-4.4, 36.72], [-5.0, 36.45], [-5.4, 36.15], [-5.6, 36.0], [-6.0, 36.2], [-6.3, 36.53],
  [-6.4, 36.8], [-7.0, 37.2], [-7.4, 37.18], [-7.9, 37.0], [-8.6, 37.1], [-9.0, 37.0], [-8.8, 37.9],
  [-8.9, 38.5], [-9.5, 38.75], [-9.4, 39.4], [-8.9, 40.2], [-8.7, 41.2], [-8.87, 41.87], [-8.9, 42.1],
  [-9.0, 42.6],
];

/** Portugal, drawn fainter so Spain reads as the subject. */
const PORTUGAL: readonly Point[] = [
  [-7.4, 37.18], [-7.9, 37.0], [-8.6, 37.1], [-9.0, 37.0], [-8.8, 37.9], [-8.9, 38.5], [-9.5, 38.75],
  [-9.4, 39.4], [-8.9, 40.2], [-8.7, 41.2], [-8.87, 41.87], [-8.2, 42.1], [-6.6, 41.95], [-6.2, 41.6],
  [-6.9, 41.0], [-6.8, 40.3], [-7.0, 39.7], [-7.3, 39.3], [-7.0, 38.8], [-7.3, 38.3], [-7.0, 38.0], [-7.5, 37.5],
];

const ISLANDS: readonly (readonly Point[])[] = [
  [[2.35, 39.6], [2.7, 39.95], [3.2, 39.95], [3.48, 39.7], [3.25, 39.35], [2.95, 39.35], [2.7, 39.5]], // Mallorca
  [[3.8, 40.0], [4.3, 40.05], [4.3, 39.82], [3.85, 39.92]], // Menorca
  [[1.2, 38.95], [1.6, 39.1], [1.6, 38.85], [1.3, 38.85]], // Ibiza
];

const BOUNDS = { west: -9.6, east: 4.5, north: 43.9, south: 35.9 } as const;
/** Longitude degrees shrink with latitude; at Spain's centre one is about 0.77 of a latitude degree. */
const LON_SCALE = Math.cos((40 * Math.PI) / 180);
/** Distance between dots, in latitude degrees. */
const STEP = 0.21;
const UNIT = 100;

const project = ([lon, lat]: Point) => ({
  x: Math.round((lon - BOUNDS.west) * LON_SCALE * UNIT),
  y: Math.round((BOUNDS.north - lat) * UNIT),
});

function inside([lon, lat]: Point, polygon: readonly Point[]): boolean {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!;
    const [xj, yj] = polygon[j]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

interface Dot { readonly x: number; readonly y: number; readonly faint: boolean }

function dots(): readonly Dot[] {
  const result: Dot[] = [];
  // The grid is square in projected space, so dots are evenly spaced on screen.
  for (let lat = BOUNDS.north; lat >= BOUNDS.south; lat -= STEP) {
    for (let lon = BOUNDS.west; lon <= BOUNDS.east; lon += STEP / LON_SCALE) {
      const point: Point = [lon, lat];
      const land = inside(point, PENINSULA) || ISLANDS.some(island => inside(point, island));
      if (land) result.push({ ...project(point), faint: inside(point, PORTUGAL) });
    }
  }
  return result;
}

const DOTS = dots();
const SIZE = project([BOUNDS.east, BOUNDS.south]);
const BARCELONA = project([2.17, 41.39]);

/**
 * A dotted map of Spain, tilted back in perspective, with a pulsing pin on Barcelona.
 * Static SVG computed once, so it renders on the server and costs no request.
 */
@Component({
  selector: 'app-spain-map',
  imports: [MoveLoopDirective],
  template: `
    <div class="spain-map" role="img" [attr.aria-label]="label()">
      <div class="spain-plane">
        <svg [attr.viewBox]="'0 0 ' + size.x + ' ' + size.y" aria-hidden="true">
          @for (dot of dots; track $index) {
            <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="5.5" [class.faint]="dot.faint" />
          }
          <circle [attr.cx]="pin.x" [attr.cy]="pin.y" r="9" class="pin-pulse"
            [moveLoop]="{ scale: [1, 5], opacity: [0.7, 0] }" moveDuration="2000ms" />
          <circle [attr.cx]="pin.x" [attr.cy]="pin.y" r="9" class="pin-dot" />
        </svg>
        <!-- Anchored to Barcelona inside the tilted plane, then turned back upright so it stands on the pin. -->
        <span class="pin-anchor" [style.left.%]="(pin.x / size.x) * 100" [style.top.%]="(pin.y / size.y) * 100"
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
      transform: rotateX(40deg);
      transform-origin: 50% 100%;
      transform-style: preserve-3d;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      /* On the svg only: a mask on the plane would flatten the 3D label. */
      mask-image: linear-gradient(to bottom, transparent, black 35%);
    }

    circle {
      fill: color-mix(in oklab, var(--color-foreground) 38%, transparent);
    }

    circle.faint {
      fill: color-mix(in oklab, var(--color-foreground) 12%, transparent);
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
      transform: translateX(-50%) rotateX(-40deg);
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
export class SpainMap {
  readonly label = input.required<string>();
  readonly here = input.required<string>();
  readonly place = input.required<string>();
  protected readonly dots = DOTS;
  protected readonly size = SIZE;
  protected readonly pin = BARCELONA;
}
