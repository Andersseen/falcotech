import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import {
  VoltAccordion, VoltAccordionContent, VoltAccordionItem, VoltAccordionTrigger,
  VoltButton, VoltCard, VoltCardContent, VoltCardTitle, VoltNativeButton, VoltSeparator,
} from '@voltui/components';
import { LmnArrowDownRightIcon } from 'lumen-icons/arrow-down-right';
import { LmnEyeIcon } from 'lumen-icons/eye';
import { LmnGlobeAltIcon } from 'lumen-icons/globe-alt';
import { LmnPaperAirplaneIcon } from 'lumen-icons/paper-airplane';
import { LmnArrowUpIcon } from 'lumen-icons/arrow-up';
import { LmnCameraIcon } from 'lumen-icons/camera';
import { LmnPhoneIcon } from 'lumen-icons/phone';
import { ContactForm } from '../components/contact-form';
import { Hero } from '../components/hero';
import { Portfolio } from '../components/portfolio';
import { SiteHeader } from '../components/site-header';
import { i18n } from '../../i18n/i18n';
import wildlifeIcon from '../../assets/3.png';
import consultingIcon from '../../assets/2.png';
import dronesIcon from '../../assets/1.png';
import wildlifePhoto from '../../assets/p-3.webp';
import consultingPhoto from '../../assets/p-4.webp';
import dronesPhoto from '../../assets/4.webp';

@Component({
  imports: [
    VoltAccordion, VoltAccordionContent, VoltAccordionItem, VoltAccordionTrigger,
    VoltButton, VoltCard, VoltCardContent, VoltCardTitle, VoltNativeButton, VoltSeparator,
    ContactForm, Hero, LmnArrowDownRightIcon, LmnArrowUpIcon, LmnCameraIcon,
    LmnPhoneIcon, NgComponentOutlet, Portfolio, SiteHeader,
  ],
  templateUrl: './index.page.html',
  styleUrl: './index.page.css',
  host: { '(window:scroll)': 'updateScroll()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly homePath = computed(() => this.i18n.path('/'));
  protected readonly showBackToTop = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly services = ([
    {
      key: 'card1', section: 'section1', fragment: 'fauna', icon: LmnEyeIcon,
      illustration: wildlifeIcon, photo: wildlifePhoto, photoWidth: 3372, photoHeight: 2251,
      paragraphs: ['about.section1.description.p1', 'about.section1.description.p2', 'about.section1.description.p3'],
    },
    {
      key: 'card2', section: 'section2', fragment: 'medio-ambiente', icon: LmnGlobeAltIcon,
      illustration: consultingIcon, photo: consultingPhoto, photoWidth: 800, photoHeight: 600,
      paragraphs: ['about.section2.description.p1', 'about.section2.description.p2'],
    },
    {
      key: 'card3', section: 'section3', fragment: 'drones', icon: LmnPaperAirplaneIcon,
      illustration: dronesIcon, photo: dronesPhoto, photoWidth: 5915, photoHeight: 3949,
      paragraphs: ['about.section3.description'],
    },
  ] as const).map(service => ({
    ...service,
    title: `features.${service.key}.title` as const,
    description: `features.${service.key}.description` as const,
    detailTitle: `about.${service.section}.title` as const,
    photoAlt: `about.${service.section}.photoAlt` as const,
  }));
  protected readonly activeService = signal(0);
  protected readonly serviceColumns = computed(() =>
    this.services.map((_, index) => index === this.activeService() ? 'minmax(0, 2.65fr)' : 'minmax(0, 1fr)').join(' '),
  );
  protected readonly accordionItems = (
    ['item1', 'item2', 'item3', 'item4', 'item5'] as const
  ).map(key => ({
    key,
    trigger: `about.accordion.items.${key}.trigger` as const,
    content: `about.accordion.items.${key}.content` as const,
  }));

  private readonly photoStage = viewChild<ElementRef<HTMLElement>>('photoStage');
  private readonly chapters = viewChildren<ElementRef<HTMLElement>>('chapter');
  private scrollChanged?: () => void;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const window = this.document.defaultView;
      const stage = this.photoStage()?.nativeElement;
      if (!window || !stage) return;

      const motion = window.matchMedia('(min-width: 64rem) and (prefers-reduced-motion: no-preference)');
      let frame: number | undefined;
      let photosReady = false;
      const render = () => {
        frame = undefined;
        if (!motion.matches || !photosReady) return;

        // The next chapter moves the frame and fades in its photo as it enters the viewport.
        const viewport = window.innerHeight;
        let step = 0;
        for (const chapter of this.chapters().slice(1)) {
          const top = chapter.nativeElement.getBoundingClientRect().top;
          const progress = Math.min(1, Math.max(0, (viewport * 0.84 - top) / (viewport * 0.42)));
          step += progress * progress * (3 - 2 * progress);
        }

        const side = 1 - Math.abs(step - 1);
        stage.style.setProperty('--photo-step', String(step));
        stage.style.setProperty('--photo-side', String(side));
        stage.style.setProperty('--photo-swap', String(Math.sin(Math.PI * (step % 1))));
        stage.setAttribute('data-ready', '');
      };
      const schedule = () => {
        if (motion.matches && photosReady && frame === undefined) frame = window.requestAnimationFrame(render);
      };
      const layout = new ResizeObserver(schedule);
      for (const chapter of this.chapters()) layout.observe(chapter.nativeElement);

      this.scrollChanged = schedule;
      window.addEventListener('resize', schedule);
      motion.addEventListener('change', schedule);
      void Promise.allSettled(Array.from(stage.querySelectorAll('img'), image => image.decode())).then(results => {
        if (destroyRef.destroyed || results.some(result => result.status === 'rejected')) return;
        photosReady = true;
        schedule();
      });

      destroyRef.onDestroy(() => {
        if (frame !== undefined) window.cancelAnimationFrame(frame);
        layout.disconnect();
        motion.removeEventListener('change', schedule);
        window.removeEventListener('resize', schedule);
      });
    });
  }

  protected selectService(index: number): void {
    this.activeService.set(index);
  }

  protected focusAccordionTrigger(event: Event, direction: number): void {
    const accordion = event.currentTarget as HTMLElement;
    const triggers = Array.from(accordion.querySelectorAll<HTMLButtonElement>('volt-accordion-trigger button:not(:disabled)'));
    const focused = triggers.findIndex(trigger => trigger === event.target);
    if (focused < 0) return;

    event.preventDefault();
    triggers[(focused + direction + triggers.length) % triggers.length]?.focus();
  }

  protected updateScroll(): void {
    this.showBackToTop.set((this.document.defaultView?.scrollY ?? 0) > 400);
    this.scrollChanged?.();
  }
}
