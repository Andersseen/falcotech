import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';

const GAP = 16;
const RADIUS = 1;
/** Share of dots that glow; the rest stay a quiet grid. */
const GLOW_SHARE = 0.16;
/** How often the theme colour is read again, so a theme switch shows up without a reload. */
const COLOR_REFRESH_MS = 1000;

interface Dot {
  readonly x: number;
  readonly y: number;
  readonly base: number;
  readonly glow: boolean;
  readonly speed: number;
  readonly phase: number;
}

/**
 * A grid of dots where some slowly brighten and fade, drawn on a canvas behind its container.
 *
 * Canvas rather than Movement: these are thousands of pixels, not elements. It draws one still frame
 * with reduced motion, and stops drawing while it is off screen or the tab is hidden.
 */
@Component({
  selector: 'app-dotted-glow',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      color: var(--color-foreground);
      pointer-events: none;
      mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 100%);
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DottedGlow {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const context = canvas.getContext('2d');
      const window = canvas.ownerDocument.defaultView;
      if (!context || !window) return;

      const still = window.matchMedia('(prefers-reduced-motion: reduce)');
      let dots: Dot[] = [];
      let color = '';
      let colorReadAt = 0;
      let frame: number | undefined;
      let visible = false;

      const layout = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        dots = [];
        for (let y = GAP / 2; y < height; y += GAP) {
          for (let x = GAP / 2; x < width; x += GAP) {
            dots.push({
              x, y,
              base: 0.12 + Math.random() * 0.12,
              glow: Math.random() < GLOW_SHARE,
              speed: 0.4 + Math.random() * 0.9,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      };

      const draw = (time: number) => {
        if (time - colorReadAt > COLOR_REFRESH_MS || !color) {
          color = window.getComputedStyle(canvas).color;
          colorReadAt = time;
        }
        const { width, height } = canvas.getBoundingClientRect();
        context.clearRect(0, 0, width, height);
        context.fillStyle = color;
        const seconds = time / 1000;
        for (const dot of dots) {
          if (!dot.glow) {
            context.globalAlpha = dot.base;
            context.fillRect(dot.x - RADIUS, dot.y - RADIUS, RADIUS * 2, RADIUS * 2);
            continue;
          }
          // A glowing dot swells and brightens, with a soft halo at its peak.
          const pulse = still.matches ? 0.5 : (Math.sin(seconds * dot.speed + dot.phase) + 1) / 2;
          const strength = pulse * pulse;
          context.globalAlpha = 0.06 * strength;
          context.beginPath();
          context.arc(dot.x, dot.y, RADIUS * 5, 0, Math.PI * 2);
          context.fill();
          context.globalAlpha = dot.base + 0.7 * strength;
          context.beginPath();
          context.arc(dot.x, dot.y, RADIUS * (1 + 0.6 * strength), 0, Math.PI * 2);
          context.fill();
        }
        context.globalAlpha = 1;
      };

      const loop = (time: number) => {
        frame = undefined;
        draw(time);
        if (visible && !still.matches && !canvas.ownerDocument.hidden) frame = window.requestAnimationFrame(loop);
      };
      const start = () => {
        if (frame === undefined) frame = window.requestAnimationFrame(loop);
      };

      const resize = new ResizeObserver(() => {
        layout();
        start();
      });
      resize.observe(canvas);
      const view = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) start();
      });
      view.observe(canvas);
      const onVisibility = () => start();
      canvas.ownerDocument.addEventListener('visibilitychange', onVisibility);
      still.addEventListener('change', start);

      destroyRef.onDestroy(() => {
        if (frame !== undefined) window.cancelAnimationFrame(frame);
        resize.disconnect();
        view.disconnect();
        canvas.ownerDocument.removeEventListener('visibilitychange', onVisibility);
        still.removeEventListener('change', start);
      });
    });
  }
}
