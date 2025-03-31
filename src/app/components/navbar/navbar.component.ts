import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';
import {ApiService} from '../../../../../../OneDrive/Documents/Alternance Unilasalle/dev_web/TD_DevWebAvance2025-main/src/app/services/api.service';

@Component({
  selector: 'app-navbar',
	imports: [
		RouterLink,
		RouterLinkActive,
	],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
