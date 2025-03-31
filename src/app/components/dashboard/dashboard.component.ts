import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SerresComponent } from '../serres/serres.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, SerresComponent]
})
export class DashboardComponent {
  serres = [
    { id: 1, nom: 'Serre 1' },
    { id: 2, nom: 'Serre 2' }
  ];

  constructor(private router: Router) {}

  ajouterSerre() {
    const newId = this.serres.length ? this.serres[this.serres.length - 1].id + 1 : 1;
    this.serres.push({ id: newId, nom: `Serre ${newId}` });
  }

  supprimerSerre(index: number) {
    this.serres.splice(index, 1);
  }
}
