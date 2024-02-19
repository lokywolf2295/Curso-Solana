import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';
import { ShyftApiService } from './shyft-api.service';
import { injectPublicKey } from '@heavy-duty/wallet-adapter';
import { computedAsync } from 'ngxtension/computed-async';
import { DecimalPipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    DecimalPipe,
    MatAnchor,
    HdWalletMultiButtonComponent,
  ],
  selector: 'heavy-root',
  template: `
    <header class="px-16 pt-20 pb-8 relative">
      <h1 class="text-center text-5xl mb-4">My Bank</h1>

      <div class="flex justify-center mb-4">
        <hd-wallet-multi-button></hd-wallet-multi-button>
      </div>

      @if (balance()) {
        <div class="flex justify-center items-center gap-2 absolute top-4 left-4">
          <img src="https://solscan.io/static/media/solana-sol-logo.b612f1402147c92338bed5af1879b175.svg" class="w-8 h-8"/>
          <p class="font-bold">{{ balance()?.balance }}</p>
        </div>
      }

      <nav>
        <ul class="flex justify-center items-center gap-4">
          <li>
            <a [routerLink]="['']" mat-raised-button>Home</a>
          </li>
          <li>
            <a [routerLink]="['settings']" mat-raised-button>Settings</a>
          </li>
          <li>
            <a [routerLink]="['transactions']" mat-raised-button>Transactions</a>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  private readonly _shiftApiService = inject(ShyftApiService);
  private readonly _publicKey = injectPublicKey();

  readonly balance = computedAsync(() =>
    this._shiftApiService.getBalance(this._publicKey()?.toBase58()),
  );
}
