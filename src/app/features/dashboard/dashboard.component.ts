import { Component, ElementRef, ViewChild } from '@angular/core';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SideBarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {
  @ViewChild('main') main!: ElementRef;
}
