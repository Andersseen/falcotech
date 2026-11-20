import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import { VoltButton } from '@voltui/components';
import { MoveEnterDirective } from 'angular-movement';
import { LmnChevronLeftIcon } from 'lumen-icons/chevron-left';
import { LmnChevronRightIcon } from 'lumen-icons/chevron-right';
import { LmnPauseIcon } from 'lumen-icons/pause';
import { LmnPlayIcon } from 'lumen-icons/play';
import image1 from '../../assets/p-1.webp';
import image2 from '../../assets/p-10.webp';
import image3 from '../../assets/p-6.webp';
import image4 from '../../assets/p-8.webp';
import image5 from '../../assets/p-11.webp';
import { i18n } from '../../i18n/i18n';

@Component({
  selector: 'app-hero',
  imports: [LmnChevronLeftIcon, LmnChevronRightIcon, LmnPauseIcon, LmnPlayIcon, MoveEnterDirective, VoltButton],
  template: `
    <section id="hero" class="group relative flex h-svh items-end justify-end overflow-hidden bg-neutral-900 text-white"
      aria-roledescription="carousel" [attr.aria-label]="t('ui.carousel')"
      (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)"
      (pointerenter)="suspended.set(true)" (pointerleave)="suspended.set(false)"
      (focusin)="suspended.set(true)" (focusout)="suspended.set(false)">
      @for (image of images; track image) {
        @if (image === images[slide()]) {
          <img [src]="image" alt="" class="absolute inset-0 size-full object-cover">
        }
      }
      <div class="absolute inset-0 bg-black/60"></div>
      <p class="sr-only" [attr.aria-live]="playing() ? 'off' : 'polite'">
        {{ t('ui.slideStatus', { current: slide() + 1, total: images.length }) }}
      </p>
      <div moveEnter="fade-up" class="relative flex max-w-[min(100%,54rem)] flex-col items-end gap-5 p-2 md:p-12">
        <h1 class="text-2xl leading-8 font-bold tracking-[-0.02em] drop-shadow-sm md:text-5xl md:leading-12">{{ t('home.title') }}</h1>
        <p class="max-w-3xl text-left text-base tracking-[-0.02em] drop-shadow-sm md:text-xl">{{ t('home.description') }}</p>
      </div>
      <div class="absolute top-20 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100 md:right-12">
        <volt-button variant="outline" size="icon" [class]="controlClass"
          [aria-label]="t('ui.previous')" (click)="step(-1)"><lmn-chevron-left size="20" /></volt-button>
        <volt-button variant="outline" size="icon" [class]="controlClass"
          [aria-label]="t('ui.next')" (click)="step(1)"><lmn-chevron-right size="20" /></volt-button>
        <volt-button variant="outline" size="icon" [class]="controlClass"
          [aria-label]="t(playing() ? 'ui.pause' : 'ui.play')" (click)="toggleAutoplay()">
          @if (playing()) { <lmn-pause size="20" /> } @else { <lmn-play size="20" /> }
        </volt-button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly t = injectT(i18n);
  protected readonly controlClass =
    'size-10 rounded-full border-white/60 bg-black/50 text-white data-[hover]:bg-black/70 data-[hover]:text-white';
  protected readonly images = [image1, image2, image3, image4, image5];
  protected readonly slide = signal(0);
  protected readonly playing = signal(false);
  /** Autoplay waits while the pointer or keyboard focus is on the carousel. */
  protected readonly suspended = signal(false);
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
      this.timer = setInterval(() => {
        if (!this.suspended()) this.step(1);
      }, 10_000);
    }
    this.playing.update(playing => !playing);
  }
}
