import { Component, computed, inject } from '@angular/core';
import { TransferFormComponent, TransferFormPayload} from './transfer-form-component';
import { injectTransactionSender, injectPublicKey } from '@heavy-duty/wallet-adapter';
import { createTransferInstructions } from '@heavy-duty/spl-utils';
import { computedAsync } from 'ngxtension/computed-async';
import { ShyftApiService } from './shyft-api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'heavy-transfer-modal',
  template: `
    <div class="px-8 pt-16 pb-8">
      <h2 class="text-3xl text-center mb-8">Transferir Fondos</h2>

      <heavy-transfer-form
        [disabled]="isRunning()"
        [tokens]="allTokens() ?? []"
        (sendTransfer)="onTransfer($event)"
        (cancelTransfer)="onCancelTransfer()"
      ></heavy-transfer-form>

      @if (isRunning()) {
        <div
          class="absolute w-full h-full top-0 left-0 bg-black bg-opacity-50 flex flex-col justify-center items-center gap-4"
        >
          <mat-progress-spinner
            color="primary"
            mode="indeterminate"
            diameter="64"
          ></mat-progress-spinner>
          <p class="capitalize text-xl">{{ transactionStatus() }}...</p>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [TransferFormComponent, MatProgressSpinner],
})
export class TransferModalComponent {
  private readonly _matDialogRef = inject(MatDialogRef);
  private readonly _matSnackBar = inject(MatSnackBar);
  private readonly _transactionSender = injectTransactionSender();
  private readonly _publicKey = injectPublicKey();
  private readonly _shyftApiService = inject(ShyftApiService);

  readonly transactionStatus = computed(() => this._transactionSender().status);
  readonly isRunning = computed(
    () =>
      this.transactionStatus() === 'sending' ||
      this.transactionStatus() === 'confirming' ||
      this.transactionStatus() === 'finalizing',
  );
  readonly allTokens = computedAsync(() =>
    this._shyftApiService.getAllTokens(this._publicKey()?.toBase58()),
  );

  onTransfer(payload: TransferFormPayload) {
    this._transactionSender
      .send(({ publicKey }) =>
        createTransferInstructions({
          amount: payload.amount * 10 ** 9,
          mintAddress: payload.mintAddress,
          receiverAddress: payload.recieverAddress,
          senderAddress: publicKey.toBase58(),
          fundReceiver: true,
          memo: payload.memo,
        }),
      )
      .subscribe({
        next: (signature) => {
          console.log(
            `✅ Transacción enviada Correctamente. Para más Información: https://explorer.solana.com/tx/${signature} 🎊`,
          );
          this._matSnackBar.open(
            '🎉 Transacción enviada Correctamente.🎉',
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'end',
            },
          );
          this._matDialogRef.close();
        },
        error: (error) => {
          console.error(error);
          this._matSnackBar.open(
            '❌ Hubo un error enviando la transacción.🕵🏻',
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'end',
            },
          );
        },
        complete: () => (this._matDialogRef.disableClose = false),
      });
  }
  onCancelTransfer() {
    this._matDialogRef.close();
  }
}