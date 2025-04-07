import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  apiState: boolean = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.checkApiState();
    setInterval(() => this.checkApiState(), 1000);
  }

  checkApiState(): void {
    this.api.checkPing().then(state => this.apiState = state);
  }
}
