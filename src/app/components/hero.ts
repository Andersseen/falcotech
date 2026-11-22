import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import {
  VoltBadge, VoltNativeButton, VoltToggleGroup, VoltToggleGroupItem, VoltTooltip, VoltTooltipContent,
} from '@voltui/components';
import {
  MoveEnterDirective, MoveHoverDirective, MoveLeaveDirective, MovePresenceForDirective, MoveTapDirective,
} from 'angular-movement';
import { LmnArrowRightIcon } from 'lumen-icons/arrow-right';
import { LmnPauseIcon } from 'lumen-icons/pause';
import { LmnPlayIcon } from 'lumen-icons/play';
import { i18n } from '../../i18n/i18n';
import { siteImage } from '../media/images';
import { SITE } from '../seo/site';

/** `focus` is the CSS object-position that keeps the subject in view when the photo is cropped. */
const slides = [
  { image: siteImage('p-1'), alt: 'portfolio.photos.p1', focus: '50% 50%' },
  { image: siteImage('p-10'), alt: 'portfolio.photos.p10', focus: '45% 50%' },
  { image: siteImage('p-6'), alt: 'portfolio.photos.p6', focus: '40% 50%' },
  { image: siteImage('p-8'), alt: 'portfolio.photos.p8', focus: '55% 50%' },
  { image: siteImage('p-11'), alt: 'portfolio.photos.p11', focus: '20% 50%' },
] as const;

type Slide = (typeof slides)[number];

/**
 * Split hero: the message on one side, a tall photo on the other with a strip of thumbnails cut
 * into its edge. The thumbnails pick the photo; autoplay moves through them and can be paused.
 */
@Component({
  selector: 'app-hero',
  imports: [
    LmnArrowRightIcon, LmnPauseIcon, LmnPlayIcon, MoveEnterDirective, MoveHoverDirective, MoveLeaveDirective,
    MovePresenceForDirective, MoveTapDirective, NgOptimizedImage, VoltBadge, VoltNativeButton, VoltToggleGroup,
    VoltToggleGroupItem, VoltTooltip, VoltTooltipContent,
  ],
  template: `
    <section id="hero" class="container grid min-h-svh content-center gap-10 pt-24 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:pb-12">
      <!-- Visible at first paint, so it enters with CSS (see hero-enter below), not after hydration. -->
      <div class="flex flex-col items-start gap-6 lg:py-8">
        <p class="hero-enter flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase"
          style="--hero-delay: 60ms">
          <span class="h-px w-8 bg-current" aria-hidden="true"></span>{{ site.name }}
        </p>
        <h1 class="hero-enter text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl xl:text-6xl"
          style="--hero-delay: 120ms">{{ t('home.title') }}</h1>
        <p class="hero-enter max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
          style="--hero-delay: 200ms">{{ t('home.description') }}</p>
        <div class="hero-enter flex flex-wrap gap-3 pt-2" style="--hero-delay: 280ms">
          <a voltButton size="lg" class="rounded-full" [href]="homePath() + '#contact'" moveWhileTap="press">
            {{ t('home.primaryCta') }} <lmn-arrow-right size="16" />
          </a>
          <a voltButton size="lg" variant="outline" class="rounded-full" [href]="homePath() + '#about'" moveWhileTap="press">
            {{ t('home.secondaryCta') }}
          </a>
        </div>
        <ul class="hero-enter flex flex-wrap gap-2 pt-4" style="--hero-delay: 360ms" [attr.aria-label]="t('nav.features')">
          @for (service of services; track service) {
            <li><volt-badge variant="outline" class="rounded-full px-3 py-1 font-medium">{{ t(service) }}</volt-badge></li>
          }
        </ul>
      </div>

      <div class="hero-enter flex min-w-0 flex-col gap-3" style="--hero-delay: 160ms"
        aria-roledescription="carousel" [attr.aria-label]="t('ui.carousel')"
        (pointerenter)="suspended.set(true)" (pointerleave)="suspended.set(false)"
        (focusin)="suspended.set(isKeyboardFocus($event))" (focusout)="suspended.set(false)">
        <div class="hero-frame relative isolate overflow-hidden rounded-[2rem] bg-muted">
          <!-- One slide at a time; the outgoing one stays until its fade-out ends, so they cross-fade. -->
          <div *movePresenceFor="let current of currentSlide(); trackBy: trackSlide; mode: 'sync'" class="absolute inset-0"
            [moveLeave]="{ opacity: [1, 0] }" moveDuration="900ms">
            <!-- The server-rendered first slide must not fade in again after hydration. -->
            <!-- The first slide is the LCP element: priority preloads it from the server-rendered head. -->
            <img [ngSrc]="current.image.name" [ngSrcset]="current.image.srcset" fill [priority]="current === slides[0]"
              sizes="(min-width: 64rem) 55vw, 100vw" [alt]="t(current.alt)" class="object-cover"
              [style.object-position]="current.focus"
              [moveEnter]="{ opacity: [0, 1], scale: [1.06, 1] }" moveDuration="1100ms" [moveDisabled]="!changedSlide()">
          </div>
          <!-- A Volt toggle group: one photo chosen at a time, arrow keys move between them. -->
          <volt-toggle-group class="hero-rail" type="single" [allowDeselection]="false" [orientation]="railOrientation()"
            [value]="selectedValue()" (valueChange)="showValue($event)" [attr.aria-label]="t('ui.gallery')">
            @for (item of slides; track item.image.name; let index = $index) {
              <volt-toggle-group-item [value]="item.image.name" [aria-label]="t(item.alt)" moveWhileTap="press"
                class="photo-option size-12 shrink-0 rounded-xl sm:size-14 lg:size-16">
                <img [ngSrc]="item.image.name" [ngSrcset]="item.image.srcset" fill sizes="64px" alt=""
                  class="object-cover" [style.object-position]="item.focus"
                  [moveWhileHover]="{ scale: [1, 1.08] }">
                @if (index === slide() && playing()) {
                  <!-- The bar is the autoplay clock: it restarts with each slide, pauses with the carousel and
                       moves to the next photo when it fills, so what you see and what happens never drift. -->
                  <span class="hero-progress" aria-hidden="true" [class.paused]="suspended()" (animationend)="step(1)"></span>
                }
              </volt-toggle-group-item>
            }
          </volt-toggle-group>
        </div>
        <div class="flex items-center justify-between gap-4 px-1 text-sm">
          <p class="flex min-w-0 items-baseline gap-3">
            <span class="font-semibold tabular-nums">{{ pad(slide() + 1) }}<span class="text-muted-foreground"> / {{ pad(slides.length) }}</span></span>
            <span class="relative min-w-0 flex-1 overflow-hidden">
              <span *movePresenceFor="let current of currentSlide(); trackBy: trackSlide; mode: 'wait'"
                class="block truncate text-muted-foreground" aria-hidden="true"
                [moveEnter]="{ opacity: [0, 1], y: [6, 0] }" [moveLeave]="{ opacity: [1, 0], y: [0, -6] }"
                moveDuration="220ms" [moveDisabled]="!changedSlide()">{{ t(current.alt) }}</span>
            </span>
          </p>
          <button voltButton type="button" variant="ghost" size="icon" class="size-9 shrink-0 rounded-full"
            moveWhileTap="press" [voltTooltip]="tooltip" [context]="t(playing() ? 'ui.pause' : 'ui.play')" placement="top"
            [attr.aria-label]="t(playing() ? 'ui.pause' : 'ui.play')" (click)="toggleAutoplay()">
            @if (playing()) { <lmn-pause size="16" /> } @else { <lmn-play size="16" /> }
          </button>
        </div>
        <p class="sr-only" [attr.aria-live]="playing() ? 'off' : 'polite'">
          {{ t('ui.slideStatus', { current: slide() + 1, total: slides.length }) }}
        </p>
      </div>
    </section>

    <ng-template #tooltip let-label>
      <volt-tooltip-content>{{ label() }}</volt-tooltip-content>
    </ng-template>
  `,
  styles: `
    .hero-frame {
      height: min(68svh, 36rem);
    }

    @media (min-width: 64rem) {
      .hero-frame { height: min(calc(100svh - 11rem), 52rem); }
    }

    /*
     * The thumbnail strip sits in a notch cut out of the photo. The notch is painted in the page
     * background, and the two pseudo-elements round the photo's edge into it (inverted corners).
     * Below lg the strip runs along the bottom edge; from lg it runs down the right edge.
     */
    /* Volt's toggle group draws a bordered pill; here it is the notch, so its own surface goes. */
    .hero-rail {
      border: 0;
      box-shadow: none;
      align-items: center;
      --notch: 1.25rem;
      --cut: var(--color-background);
      position: absolute;
      bottom: 0;
      left: 50%;
      translate: -50% 0;
      display: flex;
      gap: 0.375rem;
      padding: 0.375rem 0.375rem 0;
      border-radius: var(--notch) var(--notch) 0 0;
      background: var(--cut);
    }

    .hero-rail::before,
    .hero-rail::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: var(--notch);
      height: var(--notch);
      pointer-events: none;
    }

    .hero-rail::before {
      right: 100%;
      background: radial-gradient(circle at 0 0, transparent var(--notch), var(--cut) calc(var(--notch) + 0.5px));
    }

    .hero-rail::after {
      left: 100%;
      background: radial-gradient(circle at 100% 0, transparent var(--notch), var(--cut) calc(var(--notch) + 0.5px));
    }

    @media (min-width: 64rem) {
      .hero-rail {
        --notch: 1.5rem;
        top: 50%;
        right: 0;
        bottom: auto;
        left: auto;
        translate: 0 -50%;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem 0 0.5rem 0.5rem;
        border-radius: var(--notch) 0 0 var(--notch);
      }

      .hero-rail::before,
      .hero-rail::after {
        right: 0;
        left: auto;
      }

      .hero-rail::before {
        top: auto;
        bottom: 100%;
        background: radial-gradient(circle at 0 0, transparent var(--notch), var(--cut) calc(var(--notch) + 0.5px));
      }

      .hero-rail::after {
        top: 100%;
        bottom: auto;
        background: radial-gradient(circle at 0 100%, transparent var(--notch), var(--cut) calc(var(--notch) + 0.5px));
      }
    }

    .hero-progress {
      position: absolute;
      inset: auto 0 0;
      height: 3px;
      background: var(--color-foreground);
      transform-origin: left;
      animation: hero-progress 8s linear both;
    }

    .hero-progress.paused {
      animation-play-state: paused;
    }

    @keyframes hero-progress {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

    @keyframes hero-enter {
      from { opacity: 0; translate: 0 1rem; }
    }

    @media (prefers-reduced-motion: no-preference) {
      .hero-enter { animation: hero-enter 800ms cubic-bezier(0.16, 1, 0.3, 1) var(--hero-delay, 0ms) both; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly homePath = computed(() => this.i18n.path('/'));
  protected readonly site = SITE;
  protected readonly slides = slides;
  protected readonly services = ['features.card1.title', 'features.card2.title', 'features.card3.title'] as const;
  protected readonly slide = signal(0);
  protected readonly trackSlide = (_: number, item: Slide) => item.image.name;
  protected readonly currentSlide = computed(() => [slides[this.slide()]!]);
  protected readonly changedSlide = signal(false);
  protected readonly playing = signal(false);
  /** Autoplay waits while the pointer or keyboard focus is on the carousel. */
  protected readonly suspended = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.playing.set(true);
      const wide = window.matchMedia('(min-width: 64rem)');
      const orient = () => this.railOrientation.set(wide.matches ? 'vertical' : 'horizontal');
      orient();
      wide.addEventListener('change', orient);
      destroyRef.onDestroy(() => wide.removeEventListener('change', orient));
    });
  }

  /** Keyboard focus pauses autoplay; a mouse click on a thumbnail must not stop it for good. */
  protected isKeyboardFocus(event: FocusEvent): boolean {
    return event.target instanceof Element && event.target.matches(':focus-visible');
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected step(offset: number): void {
    this.show((this.slide() + offset + slides.length) % slides.length);
  }

  protected readonly selectedValue = computed(() => [slides[this.slide()]!.image.name]);
  /** The strip runs down the photo from lg and along its bottom edge below that; arrow keys follow it. */
  protected readonly railOrientation = signal<'horizontal' | 'vertical'>('horizontal');

  protected showValue(value: readonly string[]): void {
    const index = slides.findIndex(item => item.image.name === value[0]);
    if (index >= 0) this.show(index);
  }

  protected show(index: number): void {
    if (index === this.slide()) return;
    this.changedSlide.set(true);
    this.slide.set(index);
  }

  protected toggleAutoplay(): void {
    this.playing.update(playing => !playing);
  }
}
