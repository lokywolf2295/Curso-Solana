import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

export interface TransferFormModel {
  memo: string | null;
  amount: number | null;
  recieverAddress: string | null;
}

export interface TransferFormPayload {
  memo: string;
  amount: number;
  recieverAddress: string;
}

@Component({
  selector: 'heavy-transfer-form',
  template: `
    <form #form="ngForm" class="w-[400px]" (ngSubmit)="onSubmitForm(form)">
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
        />
        <mat-icon matSuffix>attach_money</mat-icon>

        @if (form.submitted && amountControl.errors) {
          <mat-error>
            @if (amountControl.errors['required']) {
              El Monto es minimo
            } @else if (amountControl.errors['min']) {
              El Monto debe ser mayor a 0
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
  imports: [FormsModule, MatFormFieldModule, MatInput, MatIcon, MatButton],
})
export class TransferFormComponent {
  readonly model: TransferFormModel = {
    memo: null,
    amount: null,
    recieverAddress: null,
  };

  @Output() readonly submitForm = new EventEmitter<TransferFormPayload>();

  onSubmitForm(form: NgForm) {
    if (
      form.invalid ||
      this.model.amount === null ||
      this.model.memo === null ||
      this.model.recieverAddress === null
    ) {
      console.log('Formulario invalido');
    } else {
      this.submitForm.emit({
        amount: this.model.amount,
        memo: this.model.memo,
        recieverAddress: this.model.recieverAddress,
      });
    }
  }
}
