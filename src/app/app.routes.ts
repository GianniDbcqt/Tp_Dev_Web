import { Routes } from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GestionComponent} from './components/gestion/gestion.component';

export const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "gestion", component: GestionComponent},
  {path: "**", redirectTo: "dashboard"}];
