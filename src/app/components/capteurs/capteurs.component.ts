
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerreService } from '../../services/serre.service';
import { Serre } from '../../models/serre';

@Component({
  selector: 'app-capteurs',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CapteursComponent  {
  serreId!: number;
  serreData: Serre | null = null; // Use the Serre model
  originalSerreName = '';
  editingName = false;
  loading = true;
  notFound = false;

  constructor(private route: ActivatedRoute, private serreService: SerreService) { }

ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serreId = +params['id'];
      this.loadSerreData();
    });
  }

  loadSerreData() {
    this.loading = true;
    this.notFound = false;
    const serre = this.serreService.getSerres().find(s => s.id === this.serreId);

    if (serre) {
      this.serreData = { ...serre };
      this.originalSerreName = this.serreData.nom;
      // Now, fetch additional data if required (and merge with serreData)
      this.fetchAdditionalData(this.serreId);
    } else {
      this.notFound = true;
    }
    this.loading = false;
  }


  fetchAdditionalData(serreId: number) {
    if (this.serreData) {
      this.serreData.capteurs = {
        temperature: undefined,
        humidity: undefined,
        windowStatus: undefined,
        waterLevel: undefined
      };

      if (serreId === 1) {
        this.serreData.capteurs = {
          temperature: 25,
          humidity: 60,
          windowStatus: 'Open',
          waterLevel: 80
        };
      } else if (serreId === 2) {
        this.serreData.capteurs = {
          temperature: 22,
          humidity: 75,
          windowStatus: 'Closed',
          waterLevel: 30
        };
      }
    } else {
      console.error("Serre data is null.  Cannot fetch additional data.");
    }
  }

  saveSerreName() {
    if (this.serreData) {
      this.serreService.updateSerreName(this.serreId, this.serreData.nom);
      this.originalSerreName = this.serreData.nom;
      this.editingName = false;
    }
  }

  editSerreName() {
    this.editingName = true;
  }

  cancelNameEdit() {
    if (this.serreData) {
      this.serreData.nom = this.originalSerreName;
    }
    this.editingName = false;
  }

  updateSerre() {
    if (this.serreData) {
      // Update location and plantType in the SerreService
      this.serreService.updateSerre(this.serreId, {
        location: this.serreData.location,
        plantType: this.serreData.plantType
      });
    }
  }

  ngOnDestroy() {
    this.updateSerre()

  }
}
