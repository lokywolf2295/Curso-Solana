import { Component } from '@angular/core';
import { BalanceSectionComponent } from './balance-section.component';

@Component({
  selector: 'heavy-hero-section',
  template: `
    <div class="flex justify-center items-center">
    <section class="px-24 py-32 bg-white bg-opacity-5">
      <heavy-balance-section></heavy-balance-section>
    </section>
    </div>
  `,
  standalone: true,
  imports: [BalanceSectionComponent],
})
export class HeroSectionComponent {}
