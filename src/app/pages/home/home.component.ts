import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<Country[] | null> = this.olympicService.getOlympics();
  public chartData$: Observable<{ name: string, value: number, nbJo: number, nbCountries: number }[]> | null = null;

  public nbJo: number = 0;  
  public nbCountries: number = 0;  

  constructor(private olympicService: OlympicService) {}

  gradient: boolean = true;
  showLabels: boolean = true;

  ngOnInit(): void {
    this.olympicService.loadInitialData();

    this.chartData$ = this.olympics$.pipe(
      map((countries: Country[] | null) => {
        if (!countries) return [];

        return countries.map(country => ({
          name: country.country,
          value: country.participations.reduce((total, p) => total + p.medalsCount, 0) || 0, // Évite undefined
          nbJo: country.participations.length || 0,  // Assure une valeur correcte
          nbCountries: countries.length || 0 // Assure une valeur correcte
        }));
      })
    );

    // Mettre à jour nbJo et nbCountries séparément
    this.olympics$.subscribe(countries => {
      if (countries) {
        this.nbJo = countries.reduce((total, country) => total + country.participations.length, 0);
        this.nbCountries = countries.length;
      }
    });
  }
}