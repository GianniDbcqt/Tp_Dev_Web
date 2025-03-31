import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SerresComponent } from '../serres/serres.component';
import {SerreService} from '../../services/serre.service';
import { Serre } from '../../models/serre';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, SerresComponent]
})
export class DashboardComponent {
  serres: any[] = [];

  constructor(private serreService: SerreService) { }

  ngOnInit() {
    this.serres = this.serreService.getSerres();
  }

  ajouterSerre() {
    const newId = this.generateNewSerreId();
    const newSerre: Serre = {
      id: newId,
      nom: `Serre ${newId}`,
      location: '',
      plantType: '',
      capteurs: {}
    };
    this.serreService.addSerre(newSerre);
  }

  generateNewSerreId(): number {
    if (this.serreService.serres.length === 0) {
      return 1;
    } else {
      let maxId = 0;
      for (let serre of this.serreService.serres) {
        if (serre.id > maxId) {
          maxId = serre.id;
        }
      }
      return maxId + 1;
    }
  }

  supprimerSerre(index: number) {
    this.serreService.deleteSerre(index); // Use service method
  }
}
