import { DOCUMENT, NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild, viewChildren } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import {
  MoveEnterDirective, MoveInViewDirective, MoveLeaveDirective, MovePresenceDirective, moveSpringValue, MoveStaggerDirective,
  MoveTapDirective, MoveVariantsDirective,
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
import { LmnMapPinIcon } from 'lumen-icons/map-pin';
import { LmnPhoneIcon } from 'lumen-icons/phone';
import logoLight from '../../assets/logo-black.svg';
import logoDark from '../../assets/logo-white.svg';
import { ContactForm } from '../components/contact-form';
import { DottedGlow } from '../components/dotted-glow';
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
    ContactForm, DottedGlow, Hero, LmnMapPinIcon, LmnArrowDownRightIcon, LmnArrowUpIcon, MoveEnterDirective, MoveInViewDirective, MoveLeaveDirective,
    MovePresenceDirective, MoveStaggerDirective, MoveTapDirective, MoveVariantsDirective, NgComponentOutlet, NgOptimizedImage,
    Portfolio, SiteHeader,
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
  protected readonly socialLinks = [
    { label: 'Instagram', href: SITE.instagram, icon: LmnCameraIcon },
    { label: 'WhatsApp', href: SITE.whatsapp, icon: LmnChatBubbleOvalLeftEllipsisIcon },
  ] as const;
  protected readonly directLinks = [
    { label: SITE.email, href: `mailto:${SITE.email}`, icon: LmnEnvelopeIcon },
    {
      label: SITE.telephone.replace(/^(\+34)(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5'),
      href: `tel:${SITE.telephone}`,
      icon: LmnPhoneIcon,
    },
  ] as const;
  protected readonly footerSections = [
    { id: 'about', label: 'nav.about' },
    { id: 'features', label: 'nav.features' },
    { id: 'gallery', label: 'nav.gallery' },
    { id: 'contact', label: 'nav.contact' },
  ] as const;
  protected readonly logoLight = logoLight;
  protected readonly logoDark = logoDark;
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
  /** The specialty whose photo is on show; it changes in the gap between two chapters' texts. */
  protected readonly activeChapter = signal(0);
  protected readonly photoMotionReady = signal(false);
  /**
   * 0 with the photo on the left, 1 on the right. The chapter switches discretely and a spring
   * carries the photo across, instead of the photo tracking every pixel of scroll.
   */
  protected readonly photoSide = moveSpringValue(
    computed(() => this.activeChapter() % 2),
    { stiffness: 230, damping: 30, precision: 0.001 },
  );
  /** 0 at rest and 1 halfway across: the photo shrinks a little while it travels, like a card being moved. */
  protected readonly photoTravel = computed(() => Math.sin(Math.PI * Math.min(1, Math.max(0, this.photoSide()))));
  protected readonly photoVariants = {
    shown: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 1.06 },
  } as const;

  constructor() {
    injectPageMeta(() => ({
      title: this.t('meta.title'),
      description: this.t('meta.description'),
      path: this.homePath(),
    }));

    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const window = this.document.defaultView;
      if (!window) return;

      // Passive and outside the template: a template listener would schedule change detection on every scroll event.
      const scrolled = () => this.showBackToTop.set(window.scrollY > 400);
      scrolled();
      window.addEventListener('scroll', scrolled, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', scrolled));

      const stage = this.photoStage()?.nativeElement;
      if (!stage) return;

      // The photo crosses over while the gap between two chapters' texts passes behind it. The gap is at
      // least as tall as the photo (see index.page.css), so it never covers either text while it moves.
      const frame = stage.querySelector<HTMLElement>('.specialty-frame')!;
      let pending: number | undefined;
      const measure = () => {
        pending = undefined;
        const box = frame.getBoundingClientRect();
        const centre = box.top + box.height / 2;
        const copies = this.chapters().map(chapter => chapter.nativeElement.getBoundingClientRect());
        let active = 0;
        for (let index = 1; index < copies.length; index++) {
          if ((copies[index - 1]!.bottom + copies[index]!.top) / 2 < centre) active = index;
        }
        this.activeChapter.set(active);
      };
      const schedule = () => {
        if (pending === undefined) pending = window.requestAnimationFrame(measure);
      };
      measure();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);

      // The sticky photo replaces the inline ones only on wide screens with motion allowed, once its photos are decoded.
      const motion = window.matchMedia('(min-width: 64rem) and (prefers-reduced-motion: no-preference)');
      let photosReady = false;
      const update = () => this.photoMotionReady.set(photosReady && motion.matches);
      motion.addEventListener('change', update);
      void Promise.allSettled(Array.from(stage.querySelectorAll('img'), image => image.decode())).then(results => {
        if (destroyRef.destroyed || results.some(result => result.status === 'rejected')) return;
        photosReady = true;
        update();
      });

      destroyRef.onDestroy(() => {
        if (pending !== undefined) window.cancelAnimationFrame(pending);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        motion.removeEventListener('change', update);
      });
    });
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
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
