import { Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import { CapteursComponent } from './components/capteurs/capteurs.component'
import {MeteoComponent} from './components/meteo/meteo.component';

export const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "capteurs/:id", component: CapteursComponent },
  { path: 'meteo', component: MeteoComponent },
  {path: "**", redirectTo: "dashboard"}];

