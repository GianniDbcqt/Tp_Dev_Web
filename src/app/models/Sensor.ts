export interface Sensor {
  id?: number;
  serreId: number;
  type: string;
  valeur?: number;
  windowState?: string;
  temperature?: string;
  waterLevel?: string;
  humidite?: string;
  dateReleve?: string;
}
