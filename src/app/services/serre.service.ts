import { Injectable } from '@angular/core';
import {Serre} from '../models/serre';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class SerreService {
  serres: Serre[] = [
    {
      id: 1,
      nom: 'Serre 1',
      location: 'Emplacement A',
      plantType: 'Tomates',
      capteurs: {
        temperature: 25,
        humidity: 60,
        windowStatus: 'Open',
        waterLevel: 80
      }
    },
    {
      id: 2,
      nom: 'Serre 2',
      location: 'Emplacement B',
      plantType: 'Laitue',
      capteurs: {
        temperature: 22,
        humidity: 75,
        windowStatus: 'Closed',
        waterLevel: 30
      }
    }
  ];

  constructor(private apiService: ApiService) {}

  checkPing(): Promise<boolean> {
    return this.apiService.checkPing();
  }

  getSerres() {
    return this.serres;
  }

  addSerre(serre: any) {
    this.serres.push(serre);
  }


  deleteSerre(index: number) {
    this.serres.splice(index, 1);
  }

  updateSerreName(serreId: number, newName: string) {
    const serreIndex = this.serres.findIndex(s => s.id === serreId);
    if (serreIndex !== -1) {
      this.serres[serreIndex].nom = newName;
    }
  }

  updateSerre(serreId: number, updatedSerreData: Partial<Serre>): void {
    const index = this.serres.findIndex(serre => serre.id === serreId);

    if (index !== -1) {
      this.serres[index] = { ...this.serres[index], ...updatedSerreData };
    } else {
      console.error(`Serre with ID ${serreId} not found`);
    }
  }


}
