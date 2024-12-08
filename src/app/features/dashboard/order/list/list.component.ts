import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../../core/services/OrderService/order.service';

interface Product {
  idProducto: number;
  nombre: string;
  imagen: string;
  precio: number;
  tamano: string;
  cantidadExistente: number;
  descripcion: string;
  estado: string;
  linea_producto: string;
}

interface ProductoPedido {
  producto: Product;
  cantidad: number;
  costo_total: number;
}

interface Order {
  idPedido: number;
  empresa: string;
  cliente: string;
  fechaIngreso: string;
  fechaEntrega: string;
  total: number;
  estadoPedido: string;
  estadoProducto: string;
  productoPedido: ProductoPedido;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export default class OrderListComponent implements OnInit {
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('editModalContainer') editModalContainer!: ElementRef;
  private orderService = inject(OrderService);
  private errorMessage: string = "";

  selectedOrder: Order | null = null;
  editForm!: FormGroup;
  
  orders: Order[] = [];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.list().subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.orders = response.data;
          console.log(this.orders)
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de pedidos';
      }
    });
  }

  private initForm() {
    this.editForm = this.fb.group({
      empresa: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      fechaEntrega: ['', Validators.required],
      estadoPedido: ['', Validators.required],
      productoPedido: this.fb.group({
        cantidad: [1, [Validators.required, Validators.min(1)]],
        costo_total: [{value: 0, disabled: true}]
      })
    });
  }

  openEditModal(order: Order) {
    this.selectedOrder = order;
    this.editModalContainer.nativeElement.style.opacity = "1";
    this.editModalContainer.nativeElement.style.visibility = "visible";
    this.editModal.nativeElement.classList.remove("modal-close");
    
    this.editForm.patchValue({
      empresa: order.empresa,
      fechaIngreso: order.fechaIngreso.split('T')[0],
      fechaEntrega: order.fechaEntrega.split('T')[0],
      estadoPedido: order.estadoPedido,
      productoPedido: {
        cantidad: order.productoPedido.cantidad,
        costo_total: order.productoPedido.costo_total
      }
    });
  }

  closeModal() {
    this.editModal.nativeElement.classList.add("modal-close");
    setTimeout(() => {
      this.editModalContainer.nativeElement.style.opacity = "0";
      this.editModalContainer.nativeElement.style.visibility = "hidden";
      this.selectedOrder = null;
      this.initForm();
    }, 500);
  }

  incrementCantidad() {
    const cantidadControl = this.editForm.get('productoPedido.cantidad');
    const producto = this.selectedOrder?.productoPedido.producto;
    
    if (cantidadControl && producto) {
      const currentCantidad = cantidadControl.value;
      if (currentCantidad < producto.cantidadExistente) {
        cantidadControl.setValue(currentCantidad + 1);
        this.calculateTotal();
      }
    }
  }
  
  decrementCantidad() {
    const cantidadControl = this.editForm.get('productoPedido.cantidad');
    
    if (cantidadControl && cantidadControl.value > 1) {
      cantidadControl.setValue(cantidadControl.value - 1);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const cantidadControl = this.editForm.get('productoPedido.cantidad');
    const producto = this.selectedOrder?.productoPedido.producto;
    const costoTotalControl = this.editForm.get('productoPedido.costo_total');
    
    if (cantidadControl && producto && costoTotalControl) {
      const total = cantidadControl.value * producto.precio;
      costoTotalControl.setValue(total);
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.selectedOrder) {
      // Implement update logic here
      // You might want to call an update method in your OrderService
      this.closeModal();
    }
  }

  deleteOrder(id: number) {
    if (confirm('¿Está seguro de eliminar este pedido?')) {
      // Implement delete logic here
      // You might want to call a delete method in your OrderService
      this.orders = this.orders.filter(order => order.idPedido !== id);
    }
  }
}