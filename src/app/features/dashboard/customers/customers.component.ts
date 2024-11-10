import { Component } from '@angular/core';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export default class CustomersComponent {
  public numberList: number[] = [];

  constructor() {
    const start = 5;
    const end = 30;
    this.numberList = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
