import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-capteurs',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CapteursComponent implements OnInit {
  serreId!: number;
  serreData: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serreId = +params['id'];

      this.fetchSerreData(this.serreId);
    });
  }


  fetchSerreData(serreId: number) {
    if (serreId === 1) {
      this.serreData = {
        temperature: 25,
        humidity: 60,
        windowStatus: 'Open',
        waterLevel: 80
      };
    } else if (serreId === 2) {
      this.serreData = {
        temperature: 22,
        humidity: 75,
        windowStatus: 'Closed',
        waterLevel: 30
      };
    }
  }
}
