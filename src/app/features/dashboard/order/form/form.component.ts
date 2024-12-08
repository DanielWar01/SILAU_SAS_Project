import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export default class OrderFormComponent {
 orderForm: FormGroup;

 constructor(private fb: FormBuilder) {
   this.orderForm = this.fb.group({
     empresa: ['', Validators.required],
     fecha_ingreso: ['', Validators.required], 
     fecha_entrega: ['', Validators.required],
     productos: this.fb.array([]),
     detalle: [''],
     estado: ['Recibido', Validators.required]
   });
 }

 get productos() {
   return this.orderForm.get('productos') as FormArray;
 }

 onSubmit() {
   if (this.orderForm.valid) {
     console.log(this.orderForm.value);
     // Aquí irá la lógica para guardar el pedido
   } else {
     this.markFormGroupTouched(this.orderForm);
   }
 }

 addProduct() {
   const product = this.fb.group({
     producto: ['', Validators.required],
     linea: ['', Validators.required],
     medida: ['', Validators.required],
     cantidad: [0, [Validators.required, Validators.min(1)]],
     precio_unit: [0, [Validators.required, Validators.min(0)]],
     costo_total: [0]
   });

   this.productos.push(product);
 }

 removeProduct(index: number) {
   this.productos.removeAt(index);
 }

 calculateTotal(index: number) {
   const product = this.productos.at(index);
   const cantidad = product.get('cantidad')?.value || 0;
   const precio = product.get('precio_unit')?.value || 0;
   product.patchValue({ costo_total: cantidad * precio });
 }

 private markFormGroupTouched(formGroup: FormGroup | FormArray) {
   Object.values(formGroup.controls).forEach(control => {
     if (control instanceof FormGroup || control instanceof FormArray) {
       this.markFormGroupTouched(control);
     }
     control.markAsTouched();
   });
 }
}