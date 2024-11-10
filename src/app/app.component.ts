import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SliderComponent } from "./shared/slider/slider.component";
import { FooterComponent } from './shared/footer/footer.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SliderComponent,
    CommonModule,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SILAU-Project';

  showSlider: boolean = true;
  showHeader: boolean = true;
  showFooter: boolean = true;


  constructor(private router: Router) {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        this.showSlider = val.url !== '/login' && val.url !== '/dashboard' && val.url !== '/dashboard/users' && val.url !== '/dashboard/customers';
        this.showHeader = val.url !== '/dashboard' && val.url !== '/dashboard/users' && val.url !== '/dashboard/customers';
        this.showFooter = val.url !== '/dashboard' && val.url !== '/dashboard/users' && val.url !== '/dashboard/customers';
      }
    });
  }
}
