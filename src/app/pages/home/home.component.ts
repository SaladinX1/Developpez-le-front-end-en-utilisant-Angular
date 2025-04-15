import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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

  constructor(private olympicService: OlympicService, private router: Router) {}

  gradient: boolean = true;
  showLabels: boolean = true;

  ngOnInit(): void {

    this.olympicService.loadInitialData();

    // Récupération data spécifiques pour 
    this.chartData$ = this.olympics$.pipe(
      map((countries: Country[] | null) => {
        if (!countries) return [];

        return countries.map(country => ({
          name: country.country,
          value: country.participations.reduce((total, p) => total + p.medalsCount, 0) || 0,
          nbJo: country.participations.length || 0, 
          nbCountries: countries.length || 0, 
        
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

  // Methode de récupération data Olympics pour selection pays choisi et redirection page country_details
  selectCountry(event: { name: string }) {
    this.olympics$.subscribe(countries => {
      const selectedCountry = countries?.find(c => c.country === event.name);
      if (selectedCountry) {
        console.log(selectedCountry);
        
        this.olympicService.setSelectedCountry(selectedCountry); 
        this.router.navigateByUrl(`/country_detail/${selectedCountry.id}`); 
      }
      else {
        console.log("no country selected !");
      }
    });
  }

}