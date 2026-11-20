import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import {
  VoltButton, VoltDialogContent, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle, VoltNativeButton, VoltTooltip,
  VoltTooltipContent,
} from '@voltui/components';
import { MoveEnterDirective, MoveHoverDirective, MoveStaggerDirective, MoveTapDirective } from 'angular-movement';
import { LmnChevronLeftIcon } from 'lumen-icons/chevron-left';
import { LmnChevronRightIcon } from 'lumen-icons/chevron-right';
import { LmnXIcon } from 'lumen-icons/x';
import p1 from '../../assets/p-1.webp';
import p2 from '../../assets/p-2.webp';
import p3 from '../../assets/p-3.webp';
import p4 from '../../assets/p-4.webp';
import p5 from '../../assets/p-5.webp';
import p6 from '../../assets/p-6.webp';
import p7 from '../../assets/p-7.webp';
import p8 from '../../assets/p-8.webp';
import p10 from '../../assets/p-10.webp';
import p11 from '../../assets/p-11.webp';
import p12 from '../../assets/p-12.webp';
import { i18n } from '../../i18n/i18n';

// Listed explicitly so every photo has a typed, translated description.
const photos = [
  { src: p1, alt: 'portfolio.photos.p1' },
  { src: p2, alt: 'portfolio.photos.p2' },
  { src: p3, alt: 'portfolio.photos.p3' },
  { src: p4, alt: 'portfolio.photos.p4' },
  { src: p5, alt: 'portfolio.photos.p5' },
  { src: p6, alt: 'portfolio.photos.p6' },
  { src: p7, alt: 'portfolio.photos.p7' },
  { src: p8, alt: 'portfolio.photos.p8' },
  { src: p10, alt: 'portfolio.photos.p10' },
  { src: p11, alt: 'portfolio.photos.p11' },
  { src: p12, alt: 'portfolio.photos.p12' },
] as const;

type Photo = (typeof photos)[number];

const rowSize = 3;
const pageSize = rowSize * 2;

@Component({
  selector: 'app-portfolio',
  imports: [
    LmnChevronLeftIcon, LmnChevronRightIcon, LmnXIcon, MoveEnterDirective, MoveHoverDirective, MoveStaggerDirective,
    MoveTapDirective, VoltButton, VoltDialogContent, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle, VoltNativeButton,
    VoltTooltip, VoltTooltipContent,
  ],
  template: `
    <section class="grid h-svh grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-20 shadow-sm md:px-8"
      [attr.aria-label]="t('ui.gallery')">
      <button voltButton type="button" size="icon" [class]="pageControlClass" moveWhileTap="press"
        [voltTooltip]="tooltip" [context]="t('ui.previous')"
        [disabled]="start() === 0" [attr.aria-label]="t('ui.previous')" (click)="step(-1)">
        <lmn-chevron-left size="20" />
      </button>
      <!-- Each page change re-creates the items, so they enter in a short stagger. -->
      <ul class="grid h-full min-h-0 grid-cols-2 grid-rows-3 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-4 md:p-5 lg:p-10"
        moveStagger="45ms">
        @for (photo of visiblePhotos(); track photo.src) {
          <li class="min-h-0" moveEnter="fade-up" moveDuration="280ms">
            <button voltButton type="button" variant="ghost" class="relative size-full min-h-0 overflow-hidden rounded-xl p-0"
              [attr.aria-label]="t(photo.alt)" aria-haspopup="dialog" (click)="selectedPhoto.set(photo)">
              <img [src]="photo.src" alt="" loading="lazy" decoding="async" class="size-full object-cover object-top"
                [moveWhileHover]="{ scale: [1, 1.05] }">
            </button>
          </li>
        }
      </ul>
      <button voltButton type="button" size="icon" [class]="pageControlClass" moveWhileTap="press"
        [voltTooltip]="tooltip" [context]="t('ui.next')"
        [disabled]="start() === lastStart" [attr.aria-label]="t('ui.next')" (click)="step(1)">
        <lmn-chevron-right size="20" />
      </button>
      <p class="sr-only" aria-live="polite">
        {{ t('ui.galleryPage', { from: start() + 1, to: start() + visiblePhotos().length, total: photos.length }) }}
      </p>
    </section>

    <ng-template voltDialogRoot [open]="selectedPhoto() !== null" (closed)="selectedPhoto.set(null)" let-close="close">
      <div voltDialogOverlay></div>
      <div voltDialogContent class="isolate flex min-h-[min(50svh,28rem)] w-[min(56rem,calc(100vw_-_2rem))] max-w-none flex-col justify-end overflow-hidden rounded-xl border-0 bg-black p-0 text-white">
        @if (selectedPhoto(); as photo) {
          <!-- The dialog title already describes the photo; an alt would make screen readers say it twice. -->
          <img [src]="photo.src" alt="" class="absolute inset-0 -z-10 size-full object-cover">
          <div class="bg-linear-to-t from-black/90 to-black/45 px-8 pt-6 pb-4">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly t = injectT(i18n);
  protected readonly photos = photos;
  protected readonly pageControlClass = 'size-10 shrink-0 rounded-full shadow-lg md:size-12';
  protected readonly selectedPhoto = signal<Photo | null>(null);
  protected readonly start = signal(0);
  protected readonly lastStart = Math.max(0, photos.length - pageSize);
  protected readonly visiblePhotos = computed(() => photos.slice(this.start(), this.start() + pageSize));

  protected step(offset: number): void {
    this.start.update(start => Math.max(0, Math.min(start + offset * rowSize, this.lastStart)));
  }
}
