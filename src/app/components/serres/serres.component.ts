import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-serres',
  templateUrl: './serres.component.html',
  styleUrls: ['./serres.component.css'],
  standalone: true // Assure-toi que c'est bien standalone
})
export class SerresComponent {
  @Input() name: string = "";
  @Output() supprimerSerre: EventEmitter<void> = new EventEmitter();
}
