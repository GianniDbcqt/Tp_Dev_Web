import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerreService } from '../../services/serre.service';
import { Serre } from '../../models/serre';
import { Sensor } from '../../models/Sensor';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-capteurs',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CapteursComponent implements OnInit, OnDestroy {
  serreId!: number;
  serreData: Serre | null = null;
  originalSerreName = '';
  editingName = false;
  loading = true;
  notFound = false;

  allPossibleSensorTypes = ["temperature", "humidity", "light", "soilMoisture", "waterLevel", "windowState"];
  selectedSensorToAdd: string | null = null;
  nouveauCapteur: any = {};
  existingSensor: Sensor | null = null;
  valeurCapteur: any; // Variable pour le two-way binding


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serreService = inject(SerreService);
  private serreSubscription!: Subscription;

  ngOnInit(): void {
    this.serreSubscription = this.route.params.pipe(
      switchMap(params => {
        this.serreId = +params['id'];
        return this.serreService.getSerreId(this.serreId);
      })
    ).subscribe({
      next: serre => {
        if (serre) {
          this.serreData = serre;
          this.originalSerreName = serre.nom;
          this.loading = false;
        } else {
          this.notFound = true;
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }
      },
      error: error => {
        console.error("Erreur chargement données serre:", error);
        this.notFound = true;
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy() {
    if (this.serreSubscription) {
      this.serreSubscription.unsubscribe();
    }
  }

  editSerreName() {
    this.editingName = true;
  }

  saveSerreName() {
    this.editingName = false;
    this.updateSerre();
  }

  cancelNameEdit() {
    if (this.serreData) {
      this.serreData.nom = this.originalSerreName;
    }
    this.editingName = false;
  }

  updateSerre() {
    if (this.serreData) {
      this.serreService.updateSerre(this.serreData).subscribe({
        next: updatedSerre => {
          this.serreData = updatedSerre;
          this.originalSerreName = updatedSerre.nom;
        },
        error: error => console.error("Erreur mise à jour:", error)
      });
    }
  }

  getExistingSensorKeys() {
    return this.serreData?.sensors?.map(s => s.type) ?? [];
  }

  getAvailableSensorsToAdd() {
    return this.allPossibleSensorTypes;
  }

  addSensor() {
    if (!this.serreData || !this.selectedSensorToAdd) {
      return;
    }

    const existingSensorType = this.serreData.sensors?.find(s => s.type === this.selectedSensorToAdd);
    if (existingSensorType && !this.existingSensor) {
      alert('Un capteur de ce type existe déjà pour cette serre.');
      this.selectedSensorToAdd = existingSensorType.type;
      this.existingSensor = existingSensorType;
      this.valeurCapteur = existingSensorType.valeur;

      return;
    }

    const newSensor: any = {
      type: this.selectedSensorToAdd,
      valeur: this.valeurCapteur,
      dateReleve: new Date()
    };

    if (this.existingSensor) {
      newSensor.id = this.existingSensor.id;
      this.serreService.updateCapteur(this.serreId, newSensor).subscribe({
        next: updatedSensor => {
          const index = this.serreData?.sensors?.findIndex(s => s.id === updatedSensor.id) ?? -1;
          if (index !== -1 && this.serreData?.sensors) {
            this.serreData.sensors[index] = updatedSensor;
          }
          this.resetForm();
        },
        error: error => console.error("Erreur mise à jour capteur :", error)
      });
    } else {
      this.serreService.ajouterCapteur(this.serreId, newSensor).subscribe({
        next: addedSensor => {
          if (this.serreData) {
            if (!this.serreData.sensors) {
              this.serreData.sensors = [];
            }
            this.serreData.sensors.push(addedSensor);
          }
        },
        error: error => console.error("Erreur ajout capteur :", error)

      });
    }
  }

  removeSensor(sensor: Sensor) {
    if (!this.serreData || !this.serreData.sensors) {
      return;
    }


    if (sensor && sensor.id !== undefined) {
      this.serreService.supprimerCapteur(this.serreId, sensor.id).subscribe({
        next: () => {
          if (this.serreData && this.serreData.sensors) {
            this.serreData.sensors = this.serreData.sensors.filter(s => s.id !== sensor.id);
          }
        },
        error: error => console.error("Erreur suppression:", error)
      });
    }
  }

  selectSensorToEdit(sensor: Sensor) {
    this.selectedSensorToAdd = sensor.type;
    this.existingSensor = sensor;
    this.valeurCapteur = sensor.valeur;
  }

  resetForm() {
    this.selectedSensorToAdd = null;
    this.nouveauCapteur = {};
    this.existingSensor = null;
    this.valeurCapteur = null;
  }



  getInputType(sensorType: string): string {
    return sensorType === 'windowState' ? 'text' : 'number';
  }

  formatSensorKey(key: string | undefined) {
    if (!key) {
      return '';
    }
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  getFormattedSensorValue(sensorType: string): any {
    const sensor = this.serreData?.sensors?.find(s => s.type === sensorType);
    if (!sensor) {
      return 'N/A';
    }
    switch (sensorType) {
      case 'temperature': return sensor.temperature ? `${sensor.temperature}°C` : 'N/A';
      case 'humidity': return sensor.humidite ? `${sensor.humidite}%` : 'N/A';
      case 'waterLevel': return sensor.waterLevel ? `${sensor.waterLevel}%` : 'N/A';
      case 'light': return sensor.valeur ? `${sensor.valeur} lux` : 'N/A';
      case 'soilMoisture': return sensor.valeur ? `${sensor.valeur}%` : 'N/A';
      case 'windowState': return sensor.windowState || 'N/A';
      default: return sensor.valeur !== undefined && sensor.valeur !== null ? sensor.valeur : 'N/A';
    }
  }


  getSensorIconClass(type: string): string {
    switch (type) {
      case 'temperature': return 'fas fa-thermometer-half';
      case 'humidity': return 'fas fa-tint';
      case 'light': return 'fas fa-sun';
      case 'soilMoisture': return 'fas fa-seedling';
      case 'waterLevel': return 'fas fa-water';
      case 'windowState': return 'fas fa-window-maximize';
      default: return 'fas fa-question';
    }
  }

  getTemperatureValue(sensor: Sensor | undefined): number {
    if (sensor && sensor.type === 'temperature' && sensor.temperature !== undefined && sensor.temperature !== null) {
      return parseFloat(sensor.temperature);
    }
    return 0;
  }

  getWaterLevelPercentage(sensor: Sensor | undefined): number {
    if (sensor && sensor.type === 'waterLevel' && sensor.waterLevel !== undefined && sensor.waterLevel !== null) {
      return parseFloat(sensor.waterLevel);
    }
    return 0;
  }

  saveChanges(): void {
    this.updateSerre();
  }
}
