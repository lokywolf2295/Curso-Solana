import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section-component';
import { FeaturesSectionComponent } from './features-section-component';
import { TransactionsSectionComponent } from './transaction-section.component';

@Component({
    selector: 'heavy-home-page',
    template: `
        <heavy-hero-section></heavy-hero-section>
        <heavy-features-section></heavy-features-section>
    `,
    standalone: true,

    imports: [HeroSectionComponent, FeaturesSectionComponent, TransactionsSectionComponent]
})

export class HomePageComponent {}
