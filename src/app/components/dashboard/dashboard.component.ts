import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SerresComponent } from '../serres/serres.component';
import {SerreService} from '../../services/serre.service';
import { Serre } from '../../models/serre';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, SerresComponent]
})
export class DashboardComponent implements OnInit , OnDestroy{
  serres: Serre[] = [];
  private serresSubscription!: Subscription;


  constructor(private serreService: SerreService, private router: Router) { }


  ngOnInit() {

    this.serresSubscription = this.serreService.serres$.subscribe({
      next: serres => this.serres = serres,
      error: error => console.error("Erreur lors de la récupération des serres :", error)
    });


  }

  ajouterSerre() {
    const newSerre: Serre = {
      nom: this.generateNewSerreName(),
      location: '',
      plantType: '',
      sensors: []
    };

    this.serreService.addSerre(newSerre).subscribe({
      next: () => {

      },
      error: error => {
        console.error("Erreur lors de l'ajout de la serre :", error);

      }
    });
  }



  generateNewSerreName(): string {
    return `Serre ${this.serres.length + 1}`;
  }


  supprimerSerre(serre: Serre) {

    const serreId = serre?.id
    if (serreId == undefined) {
      return
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer la serre ${serre.nom} ?`)) {
      this.serreService.deleteSerre(serreId).subscribe({
        next: () => {


        },
        error: error => console.error("Erreur lors de la suppression :", error)
      });
    }

  }


  ngOnDestroy(): void {
    if(this.serresSubscription) {
      this.serresSubscription.unsubscribe();

    }
  }


}
