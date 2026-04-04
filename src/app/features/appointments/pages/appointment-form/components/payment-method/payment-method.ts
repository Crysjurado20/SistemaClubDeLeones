import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-payment-method',
  imports: [CommonModule, FormsModule, ButtonModule, RadioButtonModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.scss',
})
export class PaymentMethodsComponent {
  @Input() appointmentData: any;
  @Output() onBack = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<string>();
  selectedPaymentMethod: string = '';

  goBack() {
    this.onBack.emit();
  }

  confirmCheckout() {
    if (this.selectedPaymentMethod) {
      this.onConfirm.emit(this.selectedPaymentMethod);
    }
  }
}
