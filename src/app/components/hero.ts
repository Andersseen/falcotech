import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import { MoveEnterDirective } from 'angular-movement';
import image1 from '../../assets/p-1.webp';
import image2 from '../../assets/p-10.webp';
import image3 from '../../assets/p-6.webp';
import image4 from '../../assets/p-8.webp';
import image5 from '../../assets/p-11.webp';
import { i18n } from '../../i18n/i18n';

@Component({
  selector: 'app-hero',
  imports: [MoveEnterDirective],
  template: `
    <section id="hero" class="relative flex min-h-svh items-end justify-end overflow-hidden bg-neutral-900 text-white"
      (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)">
      @for (image of images; track image) {
        @if (image === images[slide()]) {
          <img [src]="image" alt="" class="absolute inset-0 size-full object-cover">
        }
      }
      <div class="absolute inset-0 bg-black/60"></div>
      <div moveEnter="fade-up" class="relative max-w-3xl px-6 pb-24 pt-24 md:px-12">
        <h1 class="text-4xl font-bold md:text-5xl">{{ t('home.title') }}</h1>
        <p class="mt-5 text-base md:text-lg">{{ t('home.description') }}</p>
      </div>
      <div class="absolute bottom-5 right-6 flex gap-2 md:right-12">
        <button type="button" class="size-10 rounded-full border border-white/60 bg-black/40"
          [attr.aria-label]="t('ui.previous')" (click)="step(-1)">‹</button>
        <button type="button" class="size-10 rounded-full border border-white/60 bg-black/40"
          [attr.aria-label]="t('ui.next')" (click)="step(1)">›</button>
        <button type="button" class="size-10 rounded-full border border-white/60 bg-black/40"
          [attr.aria-label]="t(playing() ? 'ui.pause' : 'ui.play')" (click)="toggleAutoplay()">
          <span aria-hidden="true">{{ playing() ? 'Ⅱ' : '▷' }}</span>
        </button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly t = injectT(i18n);
  protected readonly images = [image1, image2, image3, image4, image5];
  protected readonly slide = signal(0);
  protected readonly playing = signal(false);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    afterNextRender(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.toggleAutoplay();
    });
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected step(offset: number): void {
    this.slide.update(current => (current + offset + this.images.length) % this.images.length);
  }

  protected toggleAutoplay(): void {
    if (this.playing()) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => this.step(1), 10_000);
    }
    this.playing.update(playing => !playing);
  }
}
