import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-serres',
  templateUrl: './serres.component.html',
  styleUrls: ['./serres.component.css'],
  standalone: true // Assure-toi que c'est bien standalone
})
export class SerresComponent {
  @Input() name: string = "";
  @Input() id!: number;
  @Output() supprimerSerre: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router) {}


  navigateToSerreDetails() {
    this.router.navigate(['/capteurs', this.id]);
  }
}
