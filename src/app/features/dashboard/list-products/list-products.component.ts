// list-products.component.ts
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/ProductService/product.service';
import { ProductLineService } from '../../../core/services/ProductLineOrder/product-line.service';

export interface Product {
  idProducto: string;
  nombre: string;
  linea_producto: string;
  tamano: string;
  cantidadExistente: number;
  precio: number;
  estado: string;
  imagen: string;
  descripcion: string;
}

interface LineProduct {
  idLineaProducto: number;
  nombreLinea: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export default class ProductListComponent {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('editModalContainer') editModalContainer!: ElementRef;
  private productService = inject(ProductService);
  private productLineService = inject(ProductLineService);
  public errorMessage: string = "";


  selectedProduct: Product | null = null;
  editForm!: FormGroup;
  
  products: Product[] = [];
  lineProducts: LineProduct[] = [];

  constructor(private fb: FormBuilder) {
    this.initForm();
    this.loadProducts();
    this.loadLineProduct();
  }

  loadProducts(){
    this.productService.list().subscribe({
      next: (data) => {
        if(data.data.length > 0){
          this.products = data.data
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de productos'
      }
    })
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

  private initForm() {
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      linea_producto: ['', Validators.required],
      tamano: ['', Validators.required],
      cantidadExistente: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
      imagen: [''],
      descripcion: ['', Validators.required]
    });
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.editModalContainer.nativeElement.style.opacity = "1";
    this.editModalContainer.nativeElement.style.visibility = "visible";
    this.editModal.nativeElement.classList.remove("modal-close");
    
    this.editForm.patchValue({
      nombre: product.nombre,
      linea_producto: product.linea_producto,
      tamano: product.tamano,
      cantidadExistente: product.cantidadExistente,
      precio: product.precio,
      estado: product.estado,
      descripcion: product.descripcion
    });
  }

  closeModal() {
    this.editModal.nativeElement.classList.add("modal-close");
    setTimeout(() => {
      this.editModalContainer.nativeElement.style.opacity = "0";
      this.editModalContainer.nativeElement.style.visibility = "hidden";
      this.selectedProduct = null;
      this.initForm();
    }, 500);
  }

  onSubmit() {
    if (this.editForm.valid && this.selectedProduct) {
      const updatedProduct = {
        ...this.selectedProduct,
        ...this.editForm.value
      };
      
      const index = this.products.findIndex(p => p.idProducto === this.selectedProduct?.idProducto);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
      
      this.closeModal();
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.products = this.products.filter(product => product.idProducto !== id);
    }
  }
}