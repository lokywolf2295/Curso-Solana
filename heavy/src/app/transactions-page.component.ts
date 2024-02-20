import { Component } from '@angular/core';
import { TransactionsSectionComponent } from './transaction-section.component';

@Component({
  selector: 'heavy-transactions-page',
  template: `
    <div class="flex justify-center items-center">
      <section class="px-24 py-32 bg-white bg-opacity-5">
        <heavy-transactions-section></heavy-transactions-section>
      </section>
    </div>
  `,
  standalone: true,
  imports: [TransactionsSectionComponent],
})
export class TransactionsPageComponent {}
