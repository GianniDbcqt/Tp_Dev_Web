import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-serres',
  templateUrl: './serres.component.html',
  styleUrls: ['./serres.component.css'],
  standalone: true
})
export class SerresComponent {
  @Input() name: string = "";
  @Input() id: number | undefined;
  @Output() supprimerSerre: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router) {}


  navigateToSerreDetails(): void {
    if (this.id !== undefined) {
      this.router.navigate(['/capteurs', this.id]);
    }
     else {
      console.error("ID de la serre non défini !");

    }
  }
}

