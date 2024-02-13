import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';
import { ShyftApiService } from './shyft-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { computedAsync } from 'ngxtension/computed-async';
import { WalletStore } from '@heavy-duty/wallet-adapter';
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

      @if (account()) {
        <div class="absolute top-4 left-4 flex items-center grap-2">
          <img [src]="account()?.info?.image" class="w-8 h-8" alt="Profile picture"/>
          <p class="text-2xl font-bold">
            {{ account()?.balance | number }}
          </p>
        </div>
      }
      <div class="flex justify-center mb-4">
        <hd-wallet-multi-button></hd-wallet-multi-button>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  private readonly _shiftApiService = inject(ShyftApiService);
  private readonly _walletStore = inject(WalletStore);
  private readonly _publiKey = toSignal(this._walletStore.publicKey$);

  readonly account = computedAsync(
    () => this._shiftApiService.getAccount({ publicKey: this._publiKey()?.toBase58() }),
    { requireSync: true },
  );
}
