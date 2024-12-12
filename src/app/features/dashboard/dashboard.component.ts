import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../core/services/CustomerService/customer.service';
import { ProductService } from '../../core/services/ProductService/product.service';
import { ProductLineService } from '../../core/services/ProductLineOrder/product-line.service';
import { OrderService } from '../../core/services/OrderService/order.service';
import { Customer } from '../../core/models/customer.model';


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

interface LineProduct {
  idLineaProducto: number;
  nombreLinea: string;
}

interface OrderStatistics {
  totalOrders: number;
  ordersByStatus: {
    pendingOrders: number;
    completedOrders: number;
    inProgressOrders: number;
  };
  totalOrderValue: number;
  averageOrderValue: number;
}

interface ProductStatistics {
  totalProducts: number;
  productsByLine: { lineName: string; count: number }[];
  outOfStockProducts: number;
  lowStockProducts: number;
  averagePrice: number;
  mostExpensiveProduct: {
    nombre: string;
    precio: number;
  };
}

interface CustomerStatistics {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  customersByCompany: { [key: string]: number };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SideBarComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {
  @ViewChild('main') main!: ElementRef;
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private productLineService = inject(ProductLineService);
  private orderService = inject(OrderService);
  orderStats: OrderStatistics = {
    totalOrders: 0,
    ordersByStatus: {
      pendingOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0
    },
    totalOrderValue: 0,
    averageOrderValue: 0
  };

  productStats: ProductStatistics = {
    totalProducts: 0,
    productsByLine: [],
    outOfStockProducts: 0,
    lowStockProducts: 0,
    averagePrice: 0,
    mostExpensiveProduct: {
      nombre: '',
      precio: 0
    }
  };

  customerStats: CustomerStatistics = {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    customersByCompany: {}
  };
  public errorMessage = '';
  orders: Order[] = [];
  products: Product[] = [];
  lineProducts: LineProduct[] = [];
  public customerList: Customer[] = [];

  showDashboard: boolean = true;

  constructor(private router: Router){
    this.router.events.subscribe((val: any) =>{
      this.showDashboard = val.url === '/dashboard'
    })

  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
    this.loadLineProduct();
    this.loadCustomers();
  }

  loadOrders() {
    this.orderService.list().subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.orders = response.data;
          this.orderStats = this.getOrderStatistics()
        }
      },
      error: () => {
        this.errorMessage = '';
      }
    });
  }

  loadProducts(){
    this.productService.list().subscribe({
      next: (data) => {
        if(data.data.length > 0){
          this.products = data.data
          this.productStats = this.getProductStatistics()
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
          
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de lineas de productos'
      }
    })
  }

  loadCustomers(){
    this.customerService.list().subscribe({
      next: (data) => {
        if(data.data.length > 0){
          this.customerList = data.data
          this.customerStats = this.getCustomerStatistics()
          console.log(this.customerStats)
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de productos'
      }
    })
  }
  getOrderStatistics() {
    return {
      totalOrders: this.orders.length,
      ordersByStatus: {
        pendingOrders: this.orders.filter(order => order.estadoPedido === 'Pendiente').length,
        completedOrders: this.orders.filter(order => order.estadoPedido === 'Completado').length,
        inProgressOrders: this.orders.filter(order => order.estadoPedido === 'En Proceso').length
      },
      totalOrderValue: this.orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: this.orders.length > 0 
        ? this.orders.reduce((sum, order) => sum + order.total, 0) / this.orders.length 
        : 0
    };
  }

  getProductStatistics() {
    return {
      totalProducts: this.products.length,
      productsByLine: this.lineProducts.map(line => ({
        lineName: line.nombreLinea,
        count: this.products.filter(product => product.linea_producto === line.nombreLinea).length
      })),
      outOfStockProducts: this.products.filter(product => product.cantidadExistente === 0).length,
      lowStockProducts: this.products.filter(product => product.cantidadExistente > 0 && product.cantidadExistente < 10).length,
      averagePrice: this.products.length > 0 
        ? this.products.reduce((sum, product) => sum + product.precio, 0) / this.products.length 
        : 0,
      mostExpensiveProduct: this.products.reduce((max, product) => 
        product.precio > max.precio ? product : max, 
        this.products[0]
      )
    };
  }

  getCustomerStatistics() {
    return {
      totalCustomers: this.customerList.length,
      activeCustomers: this.customerList.filter(customer => customer.estado).length,
      inactiveCustomers: this.customerList.filter(customer => !customer.estado).length,
      customersByCompany: this.customerList.reduce((acc, customer) => {
        acc[customer.empresa] = (acc[customer.empresa] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
