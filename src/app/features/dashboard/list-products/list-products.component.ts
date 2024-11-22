import { Component } from '@angular/core';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export default class ListProductsComponent {
  public numberList: number[] = [];

  constructor() {
    const start = 5;
    const end = 30;
    this.numberList = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
