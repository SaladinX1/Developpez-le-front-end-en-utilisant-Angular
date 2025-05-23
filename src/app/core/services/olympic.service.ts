import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Country } from '../models/Olympic'

@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Country[] | null>(null);
  private selectedCountry$ = new BehaviorSubject<Country | null>(null);

  constructor(private http: HttpClient) {}

  // Récupération des Data Olympics pour chargement dans composant destinataire
  loadInitialData() {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((countries) => this.olympics$.next(countries)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  // Récuperation des data Olympycs
  getOlympics() {
    return this.olympics$.asObservable();
  }

  // Getter & Setter pour selection et récupération de données spéciiques à un pays
  setSelectedCountry(country: Country) {
    this.selectedCountry$.next(country);
  }

  getSelectedCountry(): Observable<Country | null> {
    return this.selectedCountry$.asObservable();
  }
}
