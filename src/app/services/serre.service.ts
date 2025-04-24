import { Injectable } from '@angular/core';
import { Serre } from '../models/serre';
import { ApiService } from './api.service';
import { Sensor } from '../models/Sensor';
import {Observable, throwError, of, BehaviorSubject, switchMap} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SerreService {

  private apiUrl = '/api/serres';
  private serres: Serre[] = [];
  private _serres$ = new BehaviorSubject<Serre[]>([]);
  readonly serres$: Observable<Serre[]> = this._serres$.asObservable();


  constructor(private apiService: ApiService, private http: HttpClient) {
    this.refreshSerres();
  }

  private refreshSerres() {
    this.apiService.getSerres().subscribe({
      next: serres => { this._serres$.next(serres); this.serres = serres },
      error: error => console.error("Erreur lors du refresh des serres :", error)

    });
  }

  checkPing(): Promise<boolean> {
    return this.apiService.checkPing();
  }


  getSerres(): Observable<Serre[]> {
    return this.apiService.getSerres().pipe(
      tap(serres => this._serres$.next(serres)), // Met à jour le BehaviorSubject
      catchError(error => {
        console.error("Erreur lors de la récupération des serres:", error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }

  getSerreId(id: number): Observable<Serre | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Serre>(url).pipe(  // Utilise this.http
      switchMap(serre => {
        if (serre) {
          const sensorURL = `${this.apiUrl}/${id}/sensors`;
          return this.http.get<Sensor[]>(sensorURL).pipe(
            map(sensors => {
              serre.sensors = sensors;
              return serre;
            }),
            tap(serre => console.log("Serre reçue :", serre)),
            catchError(error => {
              console.error("Erreur lors du chargement des capteurs :", error);
              return of(null); // ou of(serre);
            })
          );
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error("Erreur lors de la récupération de la serre :", error);
        return of(null);
      })
    );
  }

  addSerre(serre: Serre): Observable<Serre> {
    return this.apiService.addSerre(serre).pipe(
      tap(newSerre => {
        this._serres$.next([...this.serres, newSerre]);
        this.serres = [...this.serres, newSerre];

        this.refreshSerres();
      }),
      catchError(error => {
        console.error("Erreur lors de l'ajout de la serre :", error);
        return throwError(() => error);
      })
    );
  }

  deleteSerre(serreId: number): Observable<any> {
    return this.apiService.removeSerre(serreId).pipe(
      tap(() => {
        this._serres$.next(this.serres.filter(s => s.id !== serreId))

      }),

      catchError(error => {
        console.error("Erreur lors de la suppression de la serre", error);
        return throwError(() => error);
      })
    );
  }

  updateSerre(serre: Serre): Observable<Serre> {
    return this.apiService.updateSerre(serre).pipe(
      tap(updatedSerre => {
        this.refreshSerres();
      }),
      catchError(error => {
        console.error("Erreur lors de la mise à jour de la serre :", error);
        return throwError(() => error);
      })
    );
  }

  ajouterCapteur(serreId: number, capteur: Sensor): Observable<any> {
    return this.apiService.ajouterCapteur(serreId, capteur)
      .pipe(
        tap(() => {

          this.refreshSerres();
        }),
        catchError(error => {
          console.log('Erreur lors de l\'ajout du capteur :', error);
          return throwError(() => error);
        })
      );
  }

  supprimerCapteur(serreId: number, capteurId: number): Observable<any> {
    return this.apiService.supprimerCapteur(serreId, capteurId)
      .pipe(
        tap(() => {

          this.refreshSerres();
        }),
        catchError(error => {
          console.log('Erreur lors de la suppression du capteur :', error);
          return throwError(() => error);
        })
      );
  }
}
