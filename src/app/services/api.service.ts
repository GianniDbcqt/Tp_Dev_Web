// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Serre } from '../models/serre';
import { Sensor } from '../models/Sensor';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/serres';

  constructor(private http: HttpClient) {}

  checkPing(): Promise<boolean> {
    return new Promise(resolve => {
      this.http.get("/api/ping", { responseType: "text" })
        .subscribe({
          next: (responses: any) => {
            resolve(responses === 'pong');
          },
          error: () => {
            resolve(false);
          }
        });
    });
  }


  getSerres(): Observable<Serre[]> {
    return this.http.get<Serre[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getSerreById(id: number): Observable<Serre> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Serre>(url)
      .pipe(catchError(this.handleError));
  }

  addSerre(serre: Serre): Observable<Serre> {
    return this.http.post<Serre>(this.apiUrl, serre)
      .pipe(catchError(this.handleError));
  }

  updateSerre(serre: Serre): Observable<Serre> {
    const url = `${this.apiUrl}/${serre.id}`;
    return this.http.put<Serre>(url, serre).pipe(catchError(this.handleError));
  }

  removeSerre(serreId: number): Observable<{}> {
    const url = `${this.apiUrl}/${serreId}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  ajouterCapteur(serreId: number, capteur: Sensor): Observable<Sensor> {
    const url = `${this.apiUrl}/${serreId}/sensors`;
    return this.http.post<Sensor>(url, capteur)
      .pipe(catchError(this.handleError));
  }

  supprimerCapteur(serreId: number, capteurId: number): Observable<{}> {
    const url = `${this.apiUrl}/${serreId}/sensors/${capteurId}`;
    return this.http.delete(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
