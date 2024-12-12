import { Component, inject } from '@angular/core';
import { EmailService } from '../../core/services/EmailService/email.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../../core/models/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'] // Nota: Aquí faltaba la "s" en "styleUrls"
})
export default class ContactComponent {
  private contactService = inject(EmailService);
  private formBuild = inject(FormBuilder);

  public error: string = '';
  public message: string = '';

  public formContact: FormGroup = this.formBuild.group({
    email: ['', Validators.required],
    nombre: ['', Validators.required],
    numeroContacto: ['', Validators.required],
    comentario: ['', Validators.required],
  });

  sendEmail() {
    if (this.formContact.invalid) {
      this.showError('Por favor completa todos los campos.');
      return;
    }

    const contact: Contact = {
      email: this.formContact.value.email,
      nombre: this.formContact.value.nombre,
      numeroContacto: this.formContact.value.numeroContacto,
      comentario: this.formContact.value.comentario,
    };

    this.contactService.login(contact).subscribe({
      next: (data) => {
        if (data) {
          this.showMessage('Gracias por comunicarte con nosotros, te enviaremos una respuesta pronto.');
          this.formContact.reset();
        }
      },
      error: () => {
        this.showError('No fue posible enviar el mensaje correctamente.');
      },
    });
  }

  private showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = ''), 10000); // Ocultar mensaje después de 10s
  }

  private showError(error: string) {
    this.error = error;
    setTimeout(() => (this.error = ''), 10000); // Ocultar error después de 10s
  }
}
