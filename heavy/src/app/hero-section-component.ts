import { Component } from '@angular/core';

@Component({
  selector: 'heavy-hero-section',
  template: `
    <section class="px-24 py-32 bg-white bg-opacity-5">
        <p class="text-center text-3xl">Este es el hero.</p>
    </section>
  `,
  standalone: true,
})
export class HeroSectionComponent {}
