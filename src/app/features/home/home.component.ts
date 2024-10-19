import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CardProductComponent } from '../../shared/card-product/card-product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CardProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  
}
