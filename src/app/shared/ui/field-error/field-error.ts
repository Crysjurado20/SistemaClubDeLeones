import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, NgModel, ValidationErrors } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [CommonModule, MessageModule],
  templateUrl: './field-error.html',
})
export class FieldError {
  @Input({ required: true }) control: NgModel | AbstractControl | null = null;
  @Input() submitted = false;
  @Input() messages: Record<string, string> | null = null;

  private get validationErrors(): ValidationErrors | null {
    const ctrl: any = this.control as any;
    return (ctrl?.errors as ValidationErrors | null) ?? null;
  }

  private get invalid(): boolean {
    const ctrl: any = this.control as any;
    return !!ctrl?.invalid;
  }

  get show(): boolean {
    if (!this.control) return false;
    return this.invalid && this.submitted;
  }

  get message(): string | null {
    const errors = this.validationErrors;
    if (!errors) return null;

    const custom = this.messages ?? {};

    if (errors['required']) return custom['required'] ?? 'Este campo es obligatorio.';
    if (errors['requiredTrue']) return custom['requiredTrue'] ?? 'Debes aceptar este campo.';
    if (errors['email']) return custom['email'] ?? 'Ingresa un correo válido.';

    if (errors['minlength']) {
      const requiredLength = (errors['minlength'] as { requiredLength?: number })?.requiredLength;
      const fallback =
        typeof requiredLength === 'number'
          ? `Debe tener al menos ${requiredLength} caracteres.`
          : 'No cumple la longitud mínima.';
      return custom['minlength'] ?? fallback;
    }

    if (errors['maxlength']) {
      const requiredLength = (errors['maxlength'] as { requiredLength?: number })?.requiredLength;
      const fallback =
        typeof requiredLength === 'number'
          ? `No debe superar ${requiredLength} caracteres.`
          : 'Supera la longitud máxima.';
      return custom['maxlength'] ?? fallback;
    }

    if (errors['pattern']) return custom['pattern'] ?? 'Formato inválido.';

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return null;
    return custom[firstKey] ?? 'Valor inválido.';
  }
}
