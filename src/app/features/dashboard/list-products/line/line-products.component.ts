import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductLineService } from '../../../../core/services/ProductLineOrder/product-line.service';

interface LineaProducto {
  idLineaProducto: number;
  nombreLinea: string;
}

interface LineProduct {
  idLineaProducto: number;
  nombreLinea: string;
}

@Component({
  selector: 'app-line-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './line-products.component.html',
  styleUrls: ['./line-products.component.css']
})
export default class LineProductsComponent {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  private productLineService = inject(ProductLineService);

  errorMessage: string = '';
  lineProducts: LineProduct[] = [];
  lineaForm!: FormGroup;
  selectedLinea: LineaProducto | null = null;
  isEditing = false;
  
  lineas: LineaProducto[] = [
    { idLineaProducto: 1, nombreLinea: 'Línea 1' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
    this.loadLineProduct();
  }

  private initForm() {
    this.lineaForm = this.fb.group({
      nombreLinea: ['', Validators.required]
    });
  }

  openModal(linea?: LineaProducto) {
    this.isEditing = !!linea;
    if (linea) {
      this.selectedLinea = linea;
      this.lineaForm.patchValue({
        nombreLinea: linea.nombreLinea
      });
    } else {
      this.selectedLinea = null;
      this.lineaForm.reset();
    }
    
    this.modalContainer.nativeElement.style.opacity = "1";
    this.modalContainer.nativeElement.style.visibility = "visible";
    this.modal.nativeElement.classList.remove("modal-close");
  }

  closeModal() {
    this.modal.nativeElement.classList.add("modal-close");
    setTimeout(() => {
      this.modalContainer.nativeElement.style.opacity = "0";
      this.modalContainer.nativeElement.style.visibility = "hidden";
      this.selectedLinea = null;
      this.lineaForm.reset();
    }, 500);
  }

  onSubmit() {
    if (this.lineaForm.valid) {
      if (this.isEditing && this.selectedLinea) {
        // Actualizar línea existente
        const index = this.lineas.findIndex(l => l.idLineaProducto === this.selectedLinea?.idLineaProducto);
        if (index !== -1) {
          this.lineas[index] = {
            ...this.selectedLinea,
            ...this.lineaForm.value
          };
        }
      } else {
        // Crear nueva línea
        const newLinea: LineaProducto = {
          idLineaProducto: this.lineas.length + 1,
          ...this.lineaForm.value
        };
        this.lineas.push(newLinea);
      }
      this.closeModal();
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

  deleteLinea(id: number) {
    if (confirm('¿Está seguro de eliminar esta línea de producto?')) {
      this.lineProducts = this.lineProducts.filter(linea => linea.idLineaProducto !== id);
    }
  }
}