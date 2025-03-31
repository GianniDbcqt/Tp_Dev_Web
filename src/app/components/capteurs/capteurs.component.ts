import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SerreService} from '../../services/serre.service';


@Component({
  selector: 'app-capteurs',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CapteursComponent implements OnInit {
  serreId!: number;

  constructor(private route: ActivatedRoute, private serreService: SerreService) { }

  saveSerreName() {
    this.serreService.updateSerreName(this.serreId, this.serreData.name);
    this.editingName = false;
  }

  serreData: any = {
    temperature: null,
    humidity: null,
    windowStatus: null,
    waterLevel: null,
    location: 'Default Location',
    plantType: 'Default Plant',
    name: ''
  };
  originalSerreName: string = '';
  editingName: boolean = false;



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
        waterLevel: 80,
        location: 'Green House A',
        plantType: 'Tomatoes',
        name: 'Serre 1'
      };
    } else if (serreId === 2) {
      this.serreData = {
        temperature: 22,
        humidity: 75,
        windowStatus: 'Closed',
        waterLevel: 30,
        location: 'Green House B',
        plantType: 'Lettuce',
        name: 'Serre 2'
      };
    }
    this.originalSerreName = this.serreData.name;

  }

  editSerreName() {
    this.editingName = true;
  }


  cancelNameEdit() {
    this.serreData.name = this.originalSerreName;
    this.editingName = false;
  }
}
