// src/app/models/serre.ts
export interface Serre {
  id: number;
  nom: string;
  location: string;
  plantType: string;
  capteurs: {
    temperature?: number;
    humidity?: number;
    windowStatus?: string;
    waterLevel?: number;
  };
}
