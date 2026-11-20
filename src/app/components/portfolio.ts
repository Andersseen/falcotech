import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import {
  VoltButton, VoltDialogContent, VoltDialogDescription, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle,
} from '@voltui/components';
import { LmnChevronLeftIcon } from 'lumen-icons/chevron-left';
import { LmnChevronRightIcon } from 'lumen-icons/chevron-right';
import { LmnXIcon } from 'lumen-icons/x';
import { i18n } from '../../i18n/i18n';

const images = import.meta.glob('../../assets/p-*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const photos = Object.keys(images)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  .map(path => images[path]);

const rowSize = 3;
const pageSize = rowSize * 2;

@Component({
  selector: 'app-portfolio',
  imports: [
    LmnChevronLeftIcon, LmnChevronRightIcon, LmnXIcon,
    VoltButton, VoltDialogContent, VoltDialogDescription, VoltDialogOverlay, VoltDialogRoot, VoltDialogTitle,
  ],
  template: `
    <section class="grid h-svh grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-20 shadow-sm md:px-8"
      [attr.aria-label]="t('ui.gallery')">
      <volt-button size="icon" [class]="pageControlClass"
        [disabled]="start() === 0" [aria-label]="t('ui.previous')" (click)="step(-1)">
        <lmn-chevron-left size="20" />
      </volt-button>
      <div class="grid h-full min-h-0 grid-cols-1 grid-rows-6 gap-4 md:grid-cols-3 md:grid-rows-2 md:p-5 lg:p-10">
        @for (photo of visiblePhotos(); track photo) {
          <div class="min-h-0">
            <volt-button variant="ghost" class="group relative size-full min-h-0 overflow-hidden rounded-xl p-0"
              [aria-label]="t('ui.openPhoto') + ' ' + (start() + $index + 1)" aria-haspopup="dialog"
              (click)="selectedPhoto.set(photo)">
              <img [src]="photo" alt="" loading="lazy"
                class="size-full object-cover object-top transition-transform group-hover:scale-105 motion-reduce:transition-none">
            </volt-button>
          </div>
        }
      </div>
      <volt-button size="icon" [class]="pageControlClass"
        [disabled]="start() === lastStart" [aria-label]="t('ui.next')" (click)="step(1)">
        <lmn-chevron-right size="20" />
      </volt-button>
    </section>

    <ng-template voltDialogRoot [open]="selectedPhoto() !== null" (closed)="selectedPhoto.set(null)" let-close="close">
      <div voltDialogOverlay></div>
      <div voltDialogContent class="isolate flex min-h-[min(50svh,28rem)] w-[min(56rem,calc(100vw_-_2rem))] max-w-none flex-col justify-end overflow-hidden rounded-xl border-0 bg-black p-0 text-white">
        @if (selectedPhoto(); as photo) {
          <img [src]="photo" alt="" class="absolute inset-0 -z-10 size-full object-cover">
        }
        <div class="bg-linear-to-t from-black/90 to-black/45 px-8 pt-6 pb-4">
          <h2 voltDialogTitle class="text-xl font-bold text-white md:text-4xl">{{ t('portfolio.title') }}</h2>
          <p voltDialogDescription class="mt-3 text-base text-white">{{ t('portfolio.description') }}</p>
        </div>
        <volt-button size="icon" variant="ghost"
          class="absolute top-3 right-3 rounded-full bg-black/65 text-white data-[hover]:bg-black/85 data-[hover]:text-white"
          [aria-label]="t('ui.close')" (click)="close()">
          <lmn-x size="20" />
        </volt-button>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly t = injectT(i18n);
  protected readonly pageControlClass = 'size-10 shrink-0 rounded-full shadow-lg md:size-12';
  protected readonly selectedPhoto = signal<string | null>(null);
  protected readonly start = signal(0);
  protected readonly lastStart = Math.max(0, photos.length - pageSize);
  protected readonly visiblePhotos = computed(() => photos.slice(this.start(), this.start() + pageSize));

  protected step(offset: number): void {
    this.start.update(start => Math.max(0, Math.min(start + offset * rowSize, this.lastStart)));
  }
}
