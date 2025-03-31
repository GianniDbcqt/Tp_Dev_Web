import { Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GestionComponent} from './components/gestion/gestion.component';
import { CapteursComponent } from './components/capteurs/capteurs.component'

export const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "gestion", component: GestionComponent},
  {path: "capteurs/:id", component: CapteursComponent },
  {path: "**", redirectTo: "dashboard"}];

