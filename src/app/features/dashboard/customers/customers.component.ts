import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export default class CustomersComponent implements OnInit{
  public numberList: number[] = [];
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_container') modal_container!: ElementRef;

  constructor() {
    const start = 5;
    const end = 30;
    this.numberList = Array.from({ length: end - start + 1 }, (_, index) => start + index);
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
 
  }


}
