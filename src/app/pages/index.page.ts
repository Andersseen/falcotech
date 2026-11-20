import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectI18n } from '@etyma/angular';
import { MoveInViewDirective } from 'angular-movement';
import {
  VoltAccordion, VoltAccordionContent, VoltAccordionItem, VoltAccordionTrigger,
  VoltCard, VoltCardContent, VoltCardFooter, VoltCardHeader, VoltCardTitle, VoltNativeButton, VoltSeparator,
} from '@voltui/components';
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
    VoltCard, VoltCardContent, VoltCardFooter, VoltCardHeader, VoltCardTitle, VoltNativeButton, VoltSeparator,
    ContactForm, Hero, LmnArrowUpIcon, LmnCameraIcon, LmnPhoneIcon, MoveInViewDirective, Portfolio, SiteHeader,
  ],
  templateUrl: './index.page.html',
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
    { key: 'card1', image: wildlifeIcon },
    { key: 'card2', image: consultingIcon },
    { key: 'card3', image: dronesIcon },
  ] as const).map(({ key, image }) => ({
    key,
    image,
    title: `features.${key}.title` as const,
    description: `features.${key}.description` as const,
  }));
  protected readonly specialties = [
    {
      key: 'section1',
      title: 'about.section1.title',
      image: wildlifePhoto,
      paragraphs: ['about.section1.description.p1', 'about.section1.description.p2', 'about.section1.description.p3'],
    },
    {
      key: 'section2',
      title: 'about.section2.title',
      image: consultingPhoto,
      paragraphs: ['about.section2.description.p1', 'about.section2.description.p2'],
    },
    {
      key: 'section3',
      title: 'about.section3.title',
      image: dronesPhoto,
      paragraphs: ['about.section3.description'],
    },
  ] as const;
  protected readonly accordionItems = (
    ['item1', 'item2', 'item3', 'item4', 'item5'] as const
  ).map(key => ({
    key,
    trigger: `about.accordion.items.${key}.trigger` as const,
    content: `about.accordion.items.${key}.content` as const,
  }));

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
  }
}
