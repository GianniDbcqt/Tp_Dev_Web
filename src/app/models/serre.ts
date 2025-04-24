import { Sensor } from './Sensor';

export interface Serre {
  id?: number; // Optionnel si l'ID est généré par le backend
  nom: string;
  location: string;
  plantType: string;
  sensors?: Sensor[]; // Liste des capteurs de la serre
}
