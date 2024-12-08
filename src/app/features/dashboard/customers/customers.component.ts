import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../core/services/CustomerService/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export default class CustomersComponent implements OnInit{
  private customerService = inject(CustomerService);
  public customerList: Customer[] = [];
  public customerListFilter: Customer[] = [];
  public errorMessage: string = '';
  public search: string = '';
  
  public numberList: number[] = [];
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_container') modal_container!: ElementRef;


  constructor() {
    const start = 2;
    const end = 30;
    this.numberList = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  filterCustomers(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Garantizar que el target es un <select>
    const entries = parseInt(selectElement.value, 10); // Convertir a número entero
    if (!isNaN(entries)) {
      this.customerListFilter = this.customerList.slice(0, entries);
    } else {
        console.error('El valor seleccionado no es un número válido.');
    }
  }

  filterCustomer(): void {
    const searchId = Number(this.search); // Convertir 'search' a número
    if (!isNaN(searchId) && searchId !== 0) { // Asegúrate de que 'searchId' sea un número válido
      this.customerListFilter = this.customerList.filter(customer => customer.idCliente === searchId);
    } else {
      console.error('El valor de búsqueda no es un número válido');
    }
  }  

  openModal(){
    this.modal_container.nativeElement.style.opacity = "1";
    this.modal_container.nativeElement.style.visibility = "visible";
    this.modal.nativeElement.classList.toggle("modal-close");
  }

  closeModal(){
    this.modal.nativeElement.classList.toggle("modal-close");
    setTimeout(()=>{
      this.modal_container.nativeElement.style.opacity = "0";
      this.modal_container.nativeElement.style.visibility = "hidden";
    },500)
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(){
    this.customerService.list().subscribe({
      next: (data) => {
        if(data.data.length > 0){
          this.customerList = data.data
          this.customerListFilter = data.data
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo recibir la lista de productos'
      }
    })
  }

}
