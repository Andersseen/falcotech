import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectT } from '@etyma/angular';
import { i18n } from '../../i18n/i18n';

const images = import.meta.glob('../../assets/p-*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const photos = Object.keys(images)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  .map(path => images[path]);

@Component({
  selector: 'app-portfolio',
  template: `
    <section class="container py-12 md:py-20" [attr.aria-label]="t('ui.gallery')">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        @for (photo of visiblePhotos(); track photo) {
          <button type="button" class="group relative overflow-hidden rounded-xl"
            [attr.aria-label]="t('ui.openPhoto') + ' ' + (page() * pageSize + $index + 1)"
            (click)="showPhoto(photo, dialog)">
            <img [src]="photo" alt="" loading="lazy"
              class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none">
          </button>
        }
      </div>
      <div class="mt-4 flex justify-center gap-3">
        <button type="button" class="rounded-full border px-4 py-2 disabled:opacity-40" [disabled]="page() === 0"
          [attr.aria-label]="t('ui.previous')" (click)="step(-1)">‹</button>
        <button type="button" class="rounded-full border px-4 py-2 disabled:opacity-40" [disabled]="page() === lastPage"
          [attr.aria-label]="t('ui.next')" (click)="step(1)">›</button>
      </div>
    </section>
    <dialog #dialog aria-labelledby="photo-title"
      class="w-[min(56rem,calc(100%_-_2rem))] max-w-none overflow-hidden rounded-xl bg-background text-foreground backdrop:bg-black/70">
      @if (selected(); as photo) {
        <img [src]="photo" alt="" class="max-h-[65vh] w-full bg-black object-contain">
      }
      <div class="flex items-start justify-between gap-4 p-4">
        <div>
          <h2 id="photo-title" class="font-bold">{{ t('portfolio.title') }}</h2>
          <p class="text-muted">{{ t('portfolio.description') }}</p>
        </div>
        <form method="dialog">
          <button type="submit" class="rounded border px-3 py-1" [attr.aria-label]="t('ui.close')">×</button>
        </form>
      </div>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio {
  protected readonly t = injectT(i18n);
  protected readonly pageSize = 6;
  protected readonly page = signal(0);
  protected readonly lastPage = Math.ceil(photos.length / this.pageSize) - 1;
  protected readonly visiblePhotos = computed(() => {
    const start = this.page() * this.pageSize;
    return photos.slice(start, start + this.pageSize);
  });
  protected readonly selected = signal<string | null>(null);

  protected step(offset: number): void {
    this.page.update(page => Math.max(0, Math.min(page + offset, this.lastPage)));
  }

  protected showPhoto(photo: string, dialog: HTMLDialogElement): void {
    this.selected.set(photo);
    dialog.showModal();
  }
}
