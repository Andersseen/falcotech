import { DOCUMENT, NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import {
  MoveEnterDirective, MoveInViewDirective, MoveLeaveDirective, MovePresenceDirective, moveSpringValue, MoveStaggerDirective,
  MoveTapDirective,
} from 'angular-movement';
import {
  VoltAccordion, VoltAccordionContent, VoltAccordionItem, VoltAccordionTrigger,
  VoltButton, VoltCard, VoltCardContent, VoltCardTitle, VoltNativeButton, VoltSeparator, VoltTooltip, VoltTooltipContent,
} from '@voltui/components';
import { LmnArrowDownRightIcon } from 'lumen-icons/arrow-down-right';
import { LmnEyeIcon } from 'lumen-icons/eye';
import { LmnGlobeAltIcon } from 'lumen-icons/globe-alt';
import { LmnPaperAirplaneIcon } from 'lumen-icons/paper-airplane';
import { LmnArrowUpIcon } from 'lumen-icons/arrow-up';
import { LmnCameraIcon } from 'lumen-icons/camera';
import { LmnChatBubbleOvalLeftEllipsisIcon } from 'lumen-icons/chat-bubble-oval-left-ellipsis';
import { LmnEnvelopeIcon } from 'lumen-icons/envelope';
import { LmnPhoneIcon } from 'lumen-icons/phone';
import { ContactForm } from '../components/contact-form';
import { Hero } from '../components/hero';
import { Portfolio } from '../components/portfolio';
import { SiteHeader } from '../components/site-header';
import { i18n } from '../../i18n/i18n';
import { injectPageMeta } from '../seo/page-seo';
import { SITE } from '../seo/site';
import { imageSrcset, imageUrl, siteImage } from '../media/images';

@Component({
  imports: [
    VoltAccordion, VoltAccordionContent, VoltAccordionItem, VoltAccordionTrigger,
    VoltButton, VoltCard, VoltCardContent, VoltCardTitle, VoltNativeButton, VoltSeparator, VoltTooltip, VoltTooltipContent,
    ContactForm, Hero, LmnArrowDownRightIcon, LmnArrowUpIcon, MoveEnterDirective, MoveInViewDirective, MoveLeaveDirective,
    MovePresenceDirective, MoveStaggerDirective, MoveTapDirective, NgComponentOutlet, NgOptimizedImage, Portfolio, SiteHeader,
  ],
  templateUrl: './index.page.html',
  styleUrl: './index.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = injectI18n(i18n);
  protected readonly t = this.i18n.t;
  protected readonly homePath = computed(() => this.i18n.path('/'));
  protected readonly showBackToTop = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly site = SITE;
  protected readonly contactLinks = [
    { label: 'Instagram', href: SITE.instagram, icon: LmnCameraIcon, external: true },
    { label: 'WhatsApp', href: SITE.whatsapp, icon: LmnChatBubbleOvalLeftEllipsisIcon, external: true },
    { label: SITE.email, href: `mailto:${SITE.email}`, icon: LmnEnvelopeIcon, external: false },
    { label: SITE.telephone.replace(/^(\+34)(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4'), href: `tel:${SITE.telephone}`, icon: LmnPhoneIcon, external: false },
  ] as const;
  protected readonly services = ([
    {
      key: 'card1', section: 'section1', fragment: 'fauna', icon: LmnEyeIcon,
      illustration: siteImage('service-wildlife'), photo: siteImage('p-3'),
      paragraphs: ['about.section1.description.p1', 'about.section1.description.p2', 'about.section1.description.p3'],
    },
    {
      key: 'card2', section: 'section2', fragment: 'medio-ambiente', icon: LmnGlobeAltIcon,
      illustration: siteImage('service-consulting'), photo: siteImage('p-4'),
      paragraphs: ['about.section2.description.p1', 'about.section2.description.p2'],
    },
    {
      key: 'card3', section: 'section3', fragment: 'drones', icon: LmnPaperAirplaneIcon,
      illustration: siteImage('service-drones'), photo: siteImage('drones'),
      paragraphs: ['about.section3.description'],
    },
  ] as const).map(service => ({
    ...service,
    title: `features.${service.key}.title` as const,
    description: `features.${service.key}.description` as const,
    detailTitle: `about.${service.section}.title` as const,
    photoAlt: `about.${service.section}.photoAlt` as const,
  }));
  protected readonly imageUrl = imageUrl;
  protected readonly imageSrcset = imageSrcset;
  /** Lumen draws the round badge behind each service icon itself. */
  protected readonly serviceIconStyle = { size: 20, background: 'soft', tone: 'foreground', padding: 12, radius: '50%' } as const;
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
  private readonly chapters = viewChildren<ElementRef<HTMLElement>>('chapterCopy');
  private readonly initialPhotoStep = signal(0);
  private readonly targetPhotoStep = signal(0);
  private readonly animatedPhotoOffset = moveSpringValue(
    computed(() => this.targetPhotoStep() - this.initialPhotoStep()),
    { stiffness: 360, damping: 38, precision: 0.0005 },
  );
  protected readonly photoMotionReady = signal(false);
  protected readonly photoStep = computed(() =>
    Math.min(this.services.length - 1, Math.max(0, this.initialPhotoStep() + this.animatedPhotoOffset())),
  );
  protected readonly photoSide = computed(() => 1 - Math.abs(this.photoStep() % 2 - 1));
  protected readonly photoCrossing = computed(() =>
    Math.min(1, 1.5 * Math.sin(Math.PI * (this.photoStep() % 1))),
  );

  constructor() {
    injectPageMeta(() => ({
      title: this.t('meta.title'),
      description: this.t('meta.description'),
      path: this.homePath(),
    }));

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

        // Time the swap from the incoming text so it does not start while both chapters are far apart.
        const viewport = window.innerHeight;
        let step = 0;
        for (const chapter of this.chapters().slice(1)) {
          const top = chapter.nativeElement.getBoundingClientRect().top;
          const progress = Math.min(1, Math.max(0, (viewport * 0.92 - top) / (viewport * 0.54)));
          step += progress * progress * (3 - 2 * progress);
        }

        if (!this.photoMotionReady()) this.initialPhotoStep.set(step);
        this.targetPhotoStep.set(step);
        this.photoMotionReady.set(true);
      };
      const schedule = () => {
        if (motion.matches && photosReady && frame === undefined) frame = window.requestAnimationFrame(render);
      };
      const layout = new ResizeObserver(schedule);
      for (const chapter of this.chapters()) layout.observe(chapter.nativeElement);

      // Passive and outside the template: a template listener would schedule change detection on every scroll event.
      const scrolled = () => {
        this.showBackToTop.set(window.scrollY > 400);
        schedule();
      };
      scrolled();
      window.addEventListener('scroll', scrolled, { passive: true });
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
        window.removeEventListener('scroll', scrolled);
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
}
