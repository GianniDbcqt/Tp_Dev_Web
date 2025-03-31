import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SerreService {
  serres: any[] = [
    { id: 1, nom: 'Serre 1' },
    { id: 2, nom: 'Serre 2' }
  ];

  constructor() { }

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


}
