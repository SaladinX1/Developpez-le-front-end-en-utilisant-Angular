import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/core/models/Olympic';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detail-country',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './detail-country.component.html',
  styleUrl: './detail-country.component.scss'
})
export class DetailCountryComponent implements OnInit {
  selectedCountry!: Country | null;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  constructor( private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    // recuperation du pays selectioné et reformattage des données pour les médailles et participations
    this.olympicService.getSelectedCountry().subscribe(country => {
      if (country) {
        this.selectedCountry = country;
   
        this.totalMedals = this.selectedCountry.participations.reduce(
          (total, p) => total + p.medalsCount,
          0
        );
        this.totalAthletes = this.selectedCountry.participations.reduce(
          (total, p) => total + p.athleteCount,
          0
        );

        // Formattage des données pour le chart line dans un tableau et liaison par attribut bind multi
        this.multi = [
          {
            name: country.country,
            series: country.participations.map(p => ({
              name: p.year.toString(),
              value: p.medalsCount,
            
            }))
          }
        ];
    
      }
    });

    
  }


  multi!: any[];

  // options
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = 'cool'

// Fonction retour page accueil
  goBack(): void {
    this.router.navigate(['/']); 
  }


  
  onSelect(event: any): void {
    console.log('Item sélectionné', event);
    alert(`Année: ${event.name} | Médailles totales: ${event.value}`);
  }

  onActivate(event: any): void {
    console.log('Élément activé', event);
  }

  onDeactivate(event: any): void {
    console.log('Élément désactivé', event);
  }


}
