import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import { injectT } from '@etyma/angular';
import {
  VoltButton, VoltDialogContent, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle, VoltNativeButton, VoltTabs,
  VoltTabsContent, VoltTabsList, VoltTabsTrigger, VoltToggleGroup, VoltToggleGroupItem, VoltTooltip, VoltTooltipContent,
} from '@voltui/components';
import {
  MoveEnterDirective, MoveHoverDirective, MoveInViewDirective, MoveLeaveDirective, MovePresenceForDirective,
  MoveTapDirective,
} from 'angular-movement';
import { LmnArrowsPointingOutIcon } from 'lumen-icons/arrows-pointing-out';
import { LmnPauseIcon } from 'lumen-icons/pause';
import { LmnPlayIcon } from 'lumen-icons/play';
import { LmnXIcon } from 'lumen-icons/x';
import { i18n } from '../../i18n/i18n';
import { siteImage } from '../media/images';

/** `focus` is the CSS object-position that keeps the subject in view when the photo is cropped. */
const categories = [
  {
    key: 'falconry',
    label: 'portfolio.tabs.falconry',
    photos: [
      { image: siteImage('p-8'), alt: 'portfolio.photos.p8', focus: '60% 40%' },
      { image: siteImage('p-5'), alt: 'portfolio.photos.p5', focus: '50% 35%' },
      { image: siteImage('p-1'), alt: 'portfolio.photos.p1', focus: '65% 50%' },
      { image: siteImage('p-2'), alt: 'portfolio.photos.p2', focus: '30% 30%' },
    ],
  },
  {
    key: 'airports',
    label: 'portfolio.tabs.airports',
    photos: [
      { image: siteImage('p-12'), alt: 'portfolio.photos.p12', focus: '60% 50%' },
      { image: siteImage('p-3'), alt: 'portfolio.photos.p3', focus: '70% 60%' },
      { image: siteImage('p-6'), alt: 'portfolio.photos.p6', focus: '40% 50%' },
      { image: siteImage('p-4'), alt: 'portfolio.photos.p4', focus: '50% 50%' },
    ],
  },
  {
    key: 'wildlife',
    label: 'portfolio.tabs.wildlife',
    photos: [
      { image: siteImage('p-10'), alt: 'portfolio.photos.p10', focus: '45% 50%' },
      { image: siteImage('p-11'), alt: 'portfolio.photos.p11', focus: '20% 50%' },
      { image: siteImage('p-7'), alt: 'portfolio.photos.p7', focus: '78% 40%' },
    ],
  },
] as const;

type Category = (typeof categories)[number];
type CategoryKey = Category['key'];
type Photo = Category['photos'][number];

/**
 * The gallery: one tab per kind of work, a featured photo and half-colour thumbnails that stay quiet
 * until chosen, so the featured photo keeps the attention. The featured photo opens full size.
 *
 * Autoplay walks through every photo and then on to the next tab. It waits while the pointer or
 * focus is in the gallery, while the gallery is off screen or a photo is open, and can be paused.
 */
@Component({
  selector: 'app-portfolio',
  imports: [
    LmnArrowsPointingOutIcon, LmnPauseIcon, LmnPlayIcon, LmnXIcon, MoveEnterDirective, MoveHoverDirective,
    MoveInViewDirective, MoveLeaveDirective, MovePresenceForDirective, MoveTapDirective, NgOptimizedImage, VoltButton,
    VoltDialogContent, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle, VoltNativeButton, VoltTabs, VoltTabsContent,
    VoltTabsList, VoltTabsTrigger, VoltToggleGroup, VoltToggleGroupItem, VoltTooltip, VoltTooltipContent,
  ],
  template: `
    <section #gallery id="gallery" class="container py-20 sm:py-28" aria-labelledby="gallery-title"
      (pointerenter)="hovered.set(true)" (pointerleave)="hovered.set(false)"
      (focusin)="focused.set(isKeyboardFocus($event))" (focusout)="focused.set(false)">
      <header moveInView="fade-up" moveDuration="360" class="max-w-3xl">
        <h2 id="gallery-title" class="text-3xl font-bold tracking-tight text-balance sm:text-5xl">{{ t('portfolio.heading') }}</h2>
        <p class="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{{ t('portfolio.description') }}</p>
      </header>

      <volt-tabs class="mt-8 block" [value]="category()" (valueChange)="selectCategory($event)">
        <volt-tabs-list class="h-auto max-w-full flex-wrap justify-start rounded-3xl p-1">
          @for (item of categories; track item.key) {
            <volt-tabs-trigger [value]="item.key" class="rounded-full px-4 py-2">{{ t(item.label) }}</volt-tabs-trigger>
          }
        </volt-tabs-list>

        @for (item of categories; track item.key) {
          <volt-tabs-content [value]="item.key" class="mt-8">
            @if (item.key === category()) {
              @let photo = featured();
              <div class="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-8">
                <div class="flex min-w-0 flex-col gap-3">
                <button voltButton type="button" variant="ghost" aria-haspopup="dialog"
                  class="group relative aspect-[4/3] h-auto w-full overflow-hidden rounded-3xl bg-muted p-0 lg:aspect-[3/2]"
                  [attr.aria-label]="t('ui.openPhoto') + ': ' + t(photo.alt)" (click)="open.set(photo)">
                  <!-- The outgoing photo stays until its fade-out ends, so they cross-fade. -->
                  <div *movePresenceFor="let current of featuredList(); trackBy: trackPhoto; mode: 'sync'"
                    class="absolute inset-0" [moveLeave]="{ opacity: [1, 0] }" moveDuration="600ms">
                    <img [ngSrc]="current.image.name" [ngSrcset]="current.image.srcset" fill alt="" class="object-cover"
                      sizes="(min-width: 64rem) 60vw, 100vw" [style.object-position]="current.focus"
                      [moveEnter]="{ opacity: [0, 1], scale: [1.04, 1] }" moveDuration="700ms" [moveDisabled]="!changed()">
                  </div>
                  <span class="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden="true"><lmn-arrows-pointing-out size="20" /></span>
                </button>
                <div class="flex items-center gap-3">
                  <!-- One segment per photo, like stories. The running segment is the autoplay clock: it pauses
                       with the gallery and moves on when it fills, so the bar and the photos never drift apart. -->
                  <div class="flex flex-1 gap-1.5" aria-hidden="true">
                    @for (thumb of item.photos; track thumb.image.name; let index = $index) {
                      <span class="gallery-segment" [class.done]="index < selected()">
                        @if (index === selected() && playing()) {
                          <span class="gallery-segment-run" [class.paused]="paused()" (animationend)="advance()"></span>
                        }
                      </span>
                    }
                  </div>
                  <button voltButton type="button" variant="ghost" size="icon" class="size-9 shrink-0 rounded-full"
                    moveWhileTap="press" [voltTooltip]="tooltip" [context]="t(playing() ? 'ui.pause' : 'ui.play')"
                    placement="top" [attr.aria-label]="t(playing() ? 'ui.pause' : 'ui.play')" (click)="playing.set(!playing())">
                    @if (playing()) { <lmn-pause size="16" /> } @else { <lmn-play size="16" /> }
                  </button>
                </div>
                </div>

                <div class="flex flex-col gap-6">
                  <!-- Announced only when the visitor drives the gallery; autoplay would talk every few seconds. -->
                  <div class="min-h-24" [attr.aria-live]="playing() ? 'off' : 'polite'">
                    <p class="text-sm font-semibold tabular-nums">
                      {{ pad(selected() + 1) }}<span class="text-muted-foreground"> / {{ pad(item.photos.length) }}</span>
                      <span class="ms-2 font-normal text-muted-foreground">{{ t(item.label) }}</span>
                    </p>
                    <div class="relative mt-3">
                      <h3 *movePresenceFor="let current of featuredList(); trackBy: trackPhoto; mode: 'wait'"
                        class="text-xl leading-snug font-semibold text-balance sm:text-2xl"
                        [moveEnter]="{ opacity: [0, 1], y: [8, 0] }" [moveLeave]="{ opacity: [1, 0], y: [0, -8] }"
                        moveDuration="220ms" [moveDisabled]="!changed()">{{ t(current.alt) }}</h3>
                    </div>
                  </div>
                  <!-- A Volt toggle group: one photo chosen at a time, arrow keys move between them. -->
                  <volt-toggle-group type="single" [allowDeselection]="false" [value]="selectedValue()"
                    (valueChange)="selectValue($event)" [attr.aria-label]="t(item.label)"
                    class="mt-auto grid grid-cols-4 gap-3 border-0 bg-transparent p-0 shadow-none lg:grid-cols-2 lg:gap-4">
                    @for (thumb of item.photos; track thumb.image.name) {
                      <volt-toggle-group-item [value]="thumb.image.name" [aria-label]="t(thumb.alt)" moveWhileTap="press"
                        class="photo-option aspect-[4/3] w-full rounded-xl lg:rounded-2xl">
                        <img [ngSrc]="thumb.image.name" [ngSrcset]="thumb.image.srcset" fill alt="" class="object-cover"
                          sizes="(min-width: 64rem) 14rem, 22vw" [style.object-position]="thumb.focus"
                          [moveWhileHover]="{ scale: [1, 1.06] }">
                      </volt-toggle-group-item>
                    }
                  </volt-toggle-group>
                </div>
              </div>
            }
          </volt-tabs-content>
        }
      </volt-tabs>
    </section>

    <ng-template voltDialogRoot [open]="open() !== null" (closed)="open.set(null)" let-close="close">
      <div voltDialogOverlay></div>
      <div voltDialogContent class="isolate flex min-h-[min(60svh,34rem)] w-[min(64rem,calc(100vw_-_2rem))] max-w-none flex-col justify-end overflow-hidden rounded-2xl border-0 bg-black p-0 text-white">
        @if (open(); as photo) {
          <!-- The dialog title already describes the photo; an alt would make screen readers say it twice. -->
          <img [ngSrc]="photo.image.name" [ngSrcset]="photo.image.srcset" fill alt="" class="-z-10 object-cover"
            sizes="min(64rem, 100vw)" [style.object-position]="photo.focus">
          <div class="bg-linear-to-t from-black/90 to-black/0 px-8 pt-16 pb-5">
            <h2 voltDialogTitle class="text-lg font-bold text-white md:text-2xl">{{ t(photo.alt) }}</h2>
          </div>
        }
        <volt-button size="icon" variant="ghost"
          class="absolute top-3 right-3 rounded-full bg-black/65 text-white data-[hover]:bg-black/85 data-[hover]:text-white"
          [aria-label]="t('ui.close')" (click)="close()">
          <lmn-x size="20" />
        </volt-button>
      </div>
    </ng-template>

    <ng-template #tooltip let-label>
      <volt-tooltip-content>{{ label() }}</volt-tooltip-content>
    </ng-template>
  `,
  styles: `
    .gallery-segment {
      position: relative;
      flex: 1;
      height: 3px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in oklab, var(--color-foreground) 16%, transparent);
    }

    .gallery-segment.done {
      background: var(--color-foreground);
    }

    .gallery-segment-run {
      position: absolute;
      inset: 0;
      background: var(--color-foreground);
      transform-origin: left;
      animation: gallery-segment 6s linear both;
    }

    .gallery-segment-run.paused {
      animation-play-state: paused;
    }

    @keyframes gallery-segment {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly t = injectT(i18n);
  protected readonly categories = categories;
  protected readonly category = signal<CategoryKey>(categories[0].key);
  protected readonly selected = signal(0);
  /** False until the visitor picks a photo, so the server-rendered one does not fade in again. */
  protected readonly changed = signal(false);
  protected readonly open = signal<Photo | null>(null);
  private readonly current = computed(() => categories.find(item => item.key === this.category()) ?? categories[0]);
  protected readonly featured = computed<Photo>(() => this.current().photos[this.selected()] ?? this.current().photos[0]);
  protected readonly featuredList = computed(() => [this.featured()]);
  protected readonly trackPhoto = (_: number, photo: Photo) => photo.image.name;
  protected readonly playing = signal(false);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  private readonly visible = signal(false);
  protected readonly paused = computed(() => this.hovered() || this.focused() || !this.visible() || this.open() !== null);
  private readonly gallery = viewChild.required<ElementRef<HTMLElement>>('gallery');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => this.visible.set(entry?.isIntersecting ?? false), {
        threshold: 0.35,
      });
      observer.observe(this.gallery().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.playing.set(true);
    });
  }

  /** Keyboard focus pauses autoplay; a mouse click on a thumbnail must not stop it for good. */
  protected isKeyboardFocus(event: FocusEvent): boolean {
    return event.target instanceof Element && event.target.matches(':focus-visible');
  }

  /** The next photo, or the first photo of the next tab once this one is done. */
  protected advance(): void {
    const photos = this.current().photos;
    if (this.selected() < photos.length - 1) {
      this.select(this.selected() + 1);
      return;
    }
    const next = categories[(categories.indexOf(this.current()) + 1) % categories.length]!;
    this.selectCategory(next.key);
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected readonly selectedValue = computed(() => [this.featured().image.name]);

  protected selectValue(value: readonly string[]): void {
    const index = this.current().photos.findIndex(photo => photo.image.name === value[0]);
    if (index >= 0) this.select(index);
  }

  protected selectCategory(value: unknown): void {
    const next = categories.find(item => item.key === value);
    if (!next || next.key === this.category()) return;
    this.changed.set(true);
    this.category.set(next.key);
    this.selected.set(0);
  }

  protected select(index: number): void {
    if (index === this.selected()) return;
    this.changed.set(true);
    this.selected.set(index);
  }
}
