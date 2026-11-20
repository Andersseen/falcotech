import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import { VoltNativeButton, VoltTooltip, VoltTooltipContent } from '@voltui/components';
import { MoveEnterDirective, MoveLeaveDirective, MovePresenceForDirective, MoveTapDirective } from 'angular-movement';
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
  imports: [
    LmnChevronLeftIcon, LmnChevronRightIcon, LmnPauseIcon, LmnPlayIcon, MoveEnterDirective, MoveLeaveDirective,
    MovePresenceForDirective, MoveTapDirective, VoltNativeButton, VoltTooltip, VoltTooltipContent,
  ],
  template: `
    <section id="hero" class="group relative flex h-svh items-end justify-end overflow-hidden bg-neutral-900 text-white"
      aria-roledescription="carousel" [attr.aria-label]="t('ui.carousel')"
      (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)"
      (pointerenter)="suspended.set(true)" (pointerleave)="suspended.set(false)"
      (focusin)="suspended.set(true)" (focusout)="suspended.set(false)">
      <!-- One slide at a time; the outgoing one stays until its fade-out ends, so they cross-fade. -->
      <div *movePresenceFor="let image of currentSlide(); trackBy: trackImage; mode: 'sync'" class="absolute inset-0"
        [moveLeave]="{ opacity: [1, 0] }" moveDuration="900ms">
        <!-- The server-rendered first slide must not fade in again after hydration. -->
        <img [src]="image" alt="" class="size-full object-cover"
          [attr.fetchpriority]="image === images[0] ? 'high' : null" [attr.decoding]="image === images[0] ? null : 'async'"
          [moveEnter]="{ opacity: [0, 1], scale: [1.04, 1] }" moveDuration="900ms" [moveDisabled]="!changedSlide()">
      </div>
      <div class="absolute inset-0 bg-black/60"></div>
      <p class="sr-only" [attr.aria-live]="playing() ? 'off' : 'polite'">
        {{ t('ui.slideStatus', { current: slide() + 1, total: images.length }) }}
      </p>
      <!-- Visible at first paint, so it enters with CSS (see hero-copy below), not after hydration. -->
      <div class="hero-copy relative flex max-w-[min(100%,54rem)] flex-col items-end gap-5 p-2 md:p-12">
        <h1 class="text-2xl leading-8 font-bold tracking-[-0.02em] drop-shadow-sm md:text-5xl md:leading-12">{{ t('home.title') }}</h1>
        <p class="max-w-3xl text-left text-base tracking-[-0.02em] drop-shadow-sm md:text-xl">{{ t('home.description') }}</p>
      </div>
      <div class="absolute top-20 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100 md:right-12">
        <button voltButton type="button" variant="outline" size="icon" [class]="controlClass" moveWhileTap="press"
          [voltTooltip]="tooltip" [context]="t('ui.previous')" placement="bottom"
          [attr.aria-label]="t('ui.previous')" (click)="step(-1)"><lmn-chevron-left size="20" /></button>
        <button voltButton type="button" variant="outline" size="icon" [class]="controlClass" moveWhileTap="press"
          [voltTooltip]="tooltip" [context]="t('ui.next')" placement="bottom"
          [attr.aria-label]="t('ui.next')" (click)="step(1)"><lmn-chevron-right size="20" /></button>
        <button voltButton type="button" variant="outline" size="icon" [class]="controlClass" moveWhileTap="press"
          [voltTooltip]="tooltip" [context]="t(playing() ? 'ui.pause' : 'ui.play')" placement="bottom"
          [attr.aria-label]="t(playing() ? 'ui.pause' : 'ui.play')" (click)="toggleAutoplay()">
          @if (playing()) { <lmn-pause size="20" /> } @else { <lmn-play size="20" /> }
        </button>
      </div>
    </section>

    <ng-template #tooltip let-label>
      <volt-tooltip-content>{{ label() }}</volt-tooltip-content>
    </ng-template>
  `,
  styles: `
    @keyframes hero-copy-in {
      from { opacity: 0; translate: 0 1rem; }
    }

    @media (prefers-reduced-motion: no-preference) {
      .hero-copy { animation: hero-copy-in 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly t = injectT(i18n);
  protected readonly controlClass =
    'size-10 rounded-full border-white/60 bg-black/50 text-white data-[hover]:bg-black/70 data-[hover]:text-white';
  protected readonly images = [image1, image2, image3, image4, image5];
  protected readonly slide = signal(0);
  protected readonly trackImage = (_: number, image: string) => image;
  protected readonly currentSlide = computed(() => [this.images[this.slide()]!]);
  protected readonly changedSlide = signal(false);
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
    this.changedSlide.set(true);
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
