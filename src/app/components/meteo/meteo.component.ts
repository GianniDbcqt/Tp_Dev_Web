import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { forkJoin, Observable, throwError } from 'rxjs'; // Importer forkJoin et throwError
import { catchError, map } from 'rxjs/operators'; // Importer catchError et map

interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
}

interface WeatherInfo {
  description: string;
  icon: string;
  main: string; // ex: "Clouds", "Rain"
}

interface WindData {
  speed: number; // m/s
}

interface CoordData {
  lon: number;
  lat: number;
}

interface CurrentWeatherData {
  name: string;
  main: WeatherMain;
  weather: WeatherInfo[];
  wind: WindData;
  coord: CoordData;
  dt: number;
}

interface ForecastListItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherInfo[];
  dt_txt: string;
}

interface CityInfo {
  name: string;
  country: string;
}

interface ForecastData {
  list: ForecastListItem[];
  city: CityInfo;
}



@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MeteoComponent {
  ville: string = ''; // Initialiser la ville
  currentWeather: CurrentWeatherData | null = null;
  forecastData: ForecastData | null = null;
  apiKey = '0a29f99933045c347e8665d2aa822e02';
  error: string | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  getMeteo() {
    if (!this.ville.trim()) {
      this.error = "Veuillez entrer un nom de ville.";
      return;
    }

    this.error = null;
    this.currentWeather = null;
    this.forecastData = null;
    this.loading = true;

    const lang = 'fr';
    const units = 'metric';

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.ville}&appid=${this.apiKey}&units=${units}&lang=${lang}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${this.ville}&appid=${this.apiKey}&units=${units}&lang=${lang}`;

    forkJoin({
      current: this.http.get<CurrentWeatherData>(currentWeatherUrl),
      forecast: this.http.get<ForecastData>(forecastUrl)
    }).pipe(
      catchError(err => {
        console.error("Erreur API:", err);
        let message = "Erreur lors de la récupération des données météo.";
        if (err.status === 404) {
          message = `Ville "${this.ville}" non trouvée.`;
        } else if (err.error && err.error.message) {
          message = `Erreur API: ${err.error.message}`;
        }
        this.error = message;
        this.loading = false;
        this.currentWeather = null;
        this.forecastData = null;
        return throwError(() => new Error(message));
      })
    ).subscribe({
      next: (responses) => {
        this.currentWeather = responses.current;
        this.forecastData = {
          ...responses.forecast,
          list: responses.forecast.list.slice(0, 8)
        };
        this.loading = false; // Fin du chargement
        console.log("Current Weather:", this.currentWeather);
        console.log("Forecast Data:", this.forecastData);
      },
    });
  }

  getWeatherIconUrl(iconCode: string, size: string = "@2x"): string {
    if (!iconCode) return ''; // Sécurité si pas d'icône
    return `https://openweathermap.org/img/wn/${iconCode}${size === '@2x' ? '@2x' : ''}.png`;
  }

  getHourFromTimestamp(timestamp: number): string {
    if (!timestamp) return '--';
    const date = new Date(timestamp * 1000);
    return date.getHours().toString().padStart(2, '0') + ':00';
  }


  getWindSpeedKmH(speedMs: number | undefined): number {
    if (speedMs === undefined) return 0;
    return Math.round(speedMs * 3.6);
  }


  roundTemp(temp: number | undefined): number | string {
    if (temp === undefined) return '--';
    return Math.round(temp);
  }
}
