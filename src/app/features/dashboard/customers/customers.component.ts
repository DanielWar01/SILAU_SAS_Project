import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../core/services/CustomerService/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerSave } from '../../../core/models/CustomerSave.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export default class CustomersComponent implements OnInit{
  private customerService = inject(CustomerService);
  public customerList: Customer[] = [];
  public customerListFilter: Customer[] = [];
  public errorMessage: string = '';
  public search: string = '';
  private formBuild = inject(FormBuilder);
  private currentId: string | undefined = '';

  public message: string = '';
  public isEditMode: boolean = false;
  public modalTitle: string = 'Agregar cliente';
  public modalButtonText: string = 'Agregar';
  
  public numberList: number[] = [];
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_container') modal_container!: ElementRef;

  public formCusotmer: FormGroup = this.formBuild.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    celular: ['', Validators.required],
    correo: ['', Validators.required],
    empresa: ['', Validators.required],
    codigo: ['', Validators.required],
    direccion: ['', Validators.required],
  });

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

  openModal(isEdit: boolean = false, customer?: Customer){
    this.modal_container.nativeElement.style.opacity = "1";
    this.modal_container.nativeElement.style.visibility = "visible";
    this.modal.nativeElement.classList.toggle("modal-close");
    this.currentId = customer?.idCliente.toString()

    this.isEditMode = isEdit;
    this.modalTitle = isEdit ? 'Editar cliente' : 'Agregar cliente';
    this.modalButtonText = isEdit ? 'Actualizar' : 'Agregar';
    if (isEdit && customer) {
      this.currentId = customer.idCliente.toString();
      this.formCusotmer.setValue({
        nombre: customer.nombre.split(' ').slice(0, customer.nombre.split(' ').length/2).join(' '),
        apellido: customer.nombre.split(' ').slice(customer.nombre.split(' ').length/2, customer.nombre.split(' ').length+1).join(' '),
        celular: customer.celular,
        correo: customer.correo,
        empresa: customer.empresa,
        codigo: customer.codigo,
        direccion: customer.direccion
      });
    }else{
      this.formCusotmer.reset();
    }
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

  saveCustomer(){

    const customer: CustomerSave = {
      nombreCliente: this.formCusotmer.value.nombre,
      apellidoCliente: this.formCusotmer.value.apellido,
      celularCliente: this.formCusotmer.value.celular,
      correoCliente: this.formCusotmer.value.correo,
      nombreEmpresa: this.formCusotmer.value.empresa,
      codigoEmpresa: this.formCusotmer.value.codigo,
      direccionEmpresa: this.formCusotmer.value.direccion,
    };

    if (this.isEditMode) {
      // Update existing customer
      this.customerService.updateCustomer(this.currentId, customer).subscribe({
        next: (data) => {
          if (data) {
            this.showMessage('Cliente actualizado correctamente.');
            this.loadCustomers();
            this.closeModal();
          }
        },
        error: () => {
          this.showError('No fue posible actualizar el cliente.');
        },
      });
    } else {
      // Create new customer
      this.customerService.createCustomer(customer).subscribe({
        next: (data) => {
          if (data) {
            this.showMessage('Cliente agregado correctamente.');
            this.loadCustomers(); // Reload the customer list
            this.closeModal();
          }
        },
        error: () => {
          this.showError('No fue posible agregar el cliente.');
        },
      });
    }
  }

  private showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = ''), 10000); // Ocultar mensaje después de 10s
  }

  private showError(error: string) {
    this.errorMessage = error;
    setTimeout(() => (this.errorMessage = ''), 10000); // Ocultar error después de 10s
  }

}
