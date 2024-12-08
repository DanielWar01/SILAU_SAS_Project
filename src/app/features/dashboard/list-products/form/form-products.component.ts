// list-products/form/form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-products.component.html'
})
export default class ProductFormComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      linea_producto: ['', Validators.required],
      tamanio: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      imagen: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
    }
  }
}