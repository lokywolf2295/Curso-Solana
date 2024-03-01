import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TransferFormModel {
  memo: string | null;
  amount: number | null;
  recieverAddress: string | null;
  token: {
    address: string;
    balance: number;
    info: { name: string; symbol: string; image: string };
  } | null;
}

export interface TransferFormPayload {
  memo: string;
  amount: number;
  recieverAddress: string;
  mintAddress: string;
}

@Component({
  selector: 'heavy-transfer-form',
  template: `
    <form class="w-[400px]" #form="ngForm" (ngSubmit)="onSubmit(form)">
    <mat-form-field class="w-full mb-4">
        <mat-label>Moneda</mat-label>
        <mat-select
          [(ngModel)]="model.token"
          name="token"
          required
          [disabled]="disabled()"
          #tokenControl="ngModel"
        >
          @for (token of tokens(); track token) {
            <mat-option [value]="token">
              <div class="flex items-center gap-2">
                <img [src]="token.info.image" class="rounded-full w-8 h-8" />
                <span>{{ token.info.symbol }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
        @if (form.submitted && tokenControl.errors) {
          <mat-error>
            @if (tokenControl.errors['required']) {
              La moneda es obligatoria.
            }
          </mat-error>
        } @else {
          <mat-hint>La moneda que deseas transferir.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Concepto</mat-label>
        <input
          name="memo"
          matInput
          type="text"
          placeholder="Ejemplo: Pagar el recibo de electricidad."
          [(ngModel)]="model.memo"
          required
          #memoControl="ngModel"
        />
        <mat-icon matSuffix>description</mat-icon>

        @if (form.submitted && memoControl.errors) {
          <mat-error>
            @if (memoControl.errors['required']) {
              El motivo es obligatorio
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser un Motivo real</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Monto</mat-label>
        <input
          name="amount"
          matInput
          type="number"
          min="0"
          placeholder="Ingresa el Monto a transferir"
          [(ngModel)]="model.amount"
          required
          #amountControl="ngModel"
          [disabled]="disabled()"
          [max]="tokenControl.value?.balance ?? undefined"
        />
        <mat-icon matSuffix>attach_money</mat-icon>

        @if (form.submitted && amountControl.errors) {
          <mat-error>
            @if (amountControl.errors['required']) {
              El Monto es minimo
            } @else if (amountControl.errors['min']) {
              El Monto debe ser mayor a 0
            } @else if (amountControl.errors['max']) {
              El monto debe ser menor a {{ tokenControl.value.balance }}.
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser Un monto mayor a 0</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Destinatario</mat-label>
        <input
          name="reciverAdress"
          matInput
          type="text"
          placeholder="Public Key de la wallet del destinatario"
          [(ngModel)]="model.recieverAddress"
          required
          #recieverAddress="ngModel"
        />
        <mat-icon matSuffix>key</mat-icon>

        @if (form.submitted && recieverAddress.errors) {
          <mat-error>
            @if (recieverAddress.errors['required']) {
              El Destinatario es obligatorio
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser una wallet de Solana</mat-hint>
        }
      </mat-form-field>

      <footer class="flex justify-center">
        <button type="submit" mat-raised-button color="primary">Enviar</button>
      </footer>
    </form>
  `,
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInput, MatIcon, MatButton, MatOption, MatSelect],
})
export class TransferFormComponent {
  private readonly _matSnackBar = inject(MatSnackBar);

  readonly tokens = input<
    {
      address: string;
      balance: number;
      info: { name: string; symbol: string; image: string };
    }[]
  >([]);
  readonly disabled = input<boolean>(false);

  @Output() readonly sendTransfer = new EventEmitter<TransferFormPayload>();
  @Output() readonly cancelTransfer = new EventEmitter();

  readonly model: TransferFormModel = {
    memo: null,
    recieverAddress: null,
    amount: null,
    token: null,
  };

  onSubmit(form: NgForm) {
    if (
      form.invalid ||
      this.model.memo === null ||
      this.model.recieverAddress === null ||
      this.model.amount === null ||
      this.model.token === null
    ) {
      this._matSnackBar.open('⚠️ El formulario es inválido.', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'end',
      });
    } else {
      this.sendTransfer.emit({
        amount: this.model.amount * 10 ** 9,
        recieverAddress: this.model.recieverAddress,
        memo: this.model.memo,
        mintAddress: this.model.token.address,
      });
    }
  }
  onCancel() {
    this.cancelTransfer.emit();
  }
}