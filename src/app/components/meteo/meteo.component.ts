import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [HttpClient]
})
export class MeteoComponent {
  ville = '';
  meteoData: any;
  apiKey = '0a29f99933045c347e8665d2aa822e02'; // Replace with your actual API key
  error: string | null = null;



  constructor(private http: HttpClient) {}




  getMeteo() {

    this.error= null


    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.ville}&appid=${this.apiKey}&units=metric`;


    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.meteoData = data;


      },
      error: (err) => {
        this.error = `Error fetching weather data ${err.message}`
        this.meteoData = null;
      }
    });
  }
}
