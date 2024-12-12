// list-products/form/form.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductLineService } from '../../../../core/services/ProductLineOrder/product-line.service';

interface LineProduct {
  idLineaProducto: number;
  nombreLinea: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-products.component.html'
})
export default class ProductFormComponent {
  private productLineService = inject(ProductLineService);
  productForm: FormGroup;
  errorMessage: string = '';
  lineProducts: LineProduct[] = [];

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
    this.loadLineProduct()
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
    }
  }

  loadLineProduct(){
    this.productLineService.list().subscribe({
      next: (data) => {
        if(data.data.length > 0){
          this.lineProducts = data.data
          console.log(this.lineProducts)
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de lineas de productos'
      }
    })
  }
}