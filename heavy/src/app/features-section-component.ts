import { Component } from '@angular/core';

@Component({
  selector: 'heavy-features-section',
  template: `
    <section class="px-16">
        <ul class="flex justify-center items-center gap-4">
          <li>Rapido</li>
          <li>Eficiente</li>
          <li>Seguro</li>
        </ul>
    </section>
  `,
  standalone: true,
})
export class FeaturesSectionComponent {}
