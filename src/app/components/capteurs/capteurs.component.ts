import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerreService } from '../../services/serre.service';
import { Serre } from '../../models/serre';
import { Sensor} from '../../models/Sensor';
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
          console.log("SerreData dans le composant :", this.serreData); // <-- Ajoute ce console.log
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

  getExistingSensorKeys(): string[] {
    return this.serreData?.sensors ? this.serreData.sensors.map(s => s.type) : [];
  }

  getAvailableSensorsToAdd(): string[] {
    return this.allPossibleSensorTypes.filter(type => !this.getExistingSensorKeys().includes(type));
  }

  addSensor() {
    if (!this.serreData || !this.selectedSensorToAdd) return;

    if (!this.serreData.sensors) {
      this.serreData.sensors = [];
    }

    const newSensor: any = {
      serreId: this.serreId,
      type: this.selectedSensorToAdd,
      valeur: this.nouveauCapteur[this.selectedSensorToAdd] || 0,
      dateReleve: new Date()
    };

    newSensor[this.selectedSensorToAdd] = this.nouveauCapteur[this.selectedSensorToAdd] || 0;

    this.serreService.ajouterCapteur(this.serreId, newSensor).subscribe({
      next: addedSensor => {
        this.serreData!.sensors = [...this.serreData!.sensors ?? [], addedSensor];
        this.selectedSensorToAdd = null;
        this.nouveauCapteur = {};
      },
      error: error => console.error("Erreur ajout capteur :", error)
    });
  }

  removeSensor(sensorType: string) {
    if (!this.serreData || !this.serreData.sensors) return;
    const sensorToRemove = this.serreData.sensors.find(s => s.type === sensorType);

    if (sensorToRemove && sensorToRemove.id !== undefined) {
      this.serreService.supprimerCapteur(this.serreId, sensorToRemove.id).subscribe({
        next: () => {
          if (this.serreData && this.serreData.sensors) {
            this.serreData.sensors = this.serreData.sensors.filter(s => s.id !== sensorToRemove.id);
          }
        },
        error: error => console.error("Erreur suppression:", error)
      });
    }
  }

  getInputType(sensorType: string): string {
    if (sensorType === 'windowState') {
      return 'text';
    } else {
      return 'number';
    }
  }

  formatSensorKey(key: string | undefined): string {
    if (!key) {
      return '';
    }
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  getFormattedSensorValue(sensorType: string): any {
    const sensor = this.serreData?.sensors?.find(s => s.type === sensorType);

    console.log("Sensor dans getFormattedSensorValue :", sensor);
    if (!sensor) {
      return 'N/A';
    }

    switch (sensorType) {
      case 'temperature':
        return sensor.temperature ? `${sensor.temperature}°C` : 'N/A';
      case 'humidity':
        return sensor.humidite ? `${sensor.humidite}%` : 'N/A';
      case 'waterLevel':
        return sensor.waterLevel ? `${sensor.waterLevel}%` : 'N/A';
      case 'light':
        return sensor.valeur ? `${sensor.valeur} lux` : 'N/A';
      case 'soilMoisture':
        return sensor.valeur ? `${sensor.valeur}%` : 'N/A';
      case 'windowState':
        return sensor.windowState || 'N/A';
      default:
        return 'N/A';
    }
  }



  getWaterLevelPercentage(): number {
    const waterLevelSensor = this.serreData?.sensors?.find(s => s.type === 'waterLevel');

    return waterLevelSensor && waterLevelSensor.waterLevel ? parseFloat(waterLevelSensor.waterLevel) : 0;
  }

  saveChanges(): void {
    this.updateSerre();
  }


  ngOnDestroy() {
    if (this.serreSubscription) {
      this.serreSubscription.unsubscribe();
    }
  }
}
