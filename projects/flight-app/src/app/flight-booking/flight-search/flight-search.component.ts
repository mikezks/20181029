import { Component, OnInit } from '@angular/core';
import { Store, select, } from '@ngrx/store';
import { Observable, empty } from 'rxjs';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as fromFlightBooking from '../+state';
import { Flight } from '../../entities/flights';
import { AbstractFlightService } from '../services/abstract-flight.service';
import { EventService } from '../../event.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {
  from = 'Wien';
  to = 'Berlin';
  // flights: Flight[] = [];
  selectedFlight: Flight;
  message: string;
  displayedColumns: string[] = ['id', 'from', 'to', 'date', 'select'];
  numberFlights: number;
  flights$: Observable<Flight[]>;
  sumDelayedFlights$: Observable<number>;
  totalFlights$: Observable<number>;
  delayedRxJSOperator$: Observable<Flight[]>;
  router$: Observable<any>;

  basket: { [key: string]: boolean } = {};

  constructor(
    private flightService: AbstractFlightService,
    private eventService: EventService,
    private store: Store<fromFlightBooking.State>,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.flights$ = this.store
      .pipe(
        select(fromFlightBooking.getFlights)
      );
    this.sumDelayedFlights$ = this.store.pipe(select(fromFlightBooking.getSumDelayedFlights));
    this.totalFlights$ = this.store.pipe(select(fromFlightBooking.getTotalFlights));
    this.delayedRxJSOperator$ = this.store.pipe(fromFlightBooking.getDelayedRxJSOperator());

    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }

  search(): void {
/*     this.flightService
      .find(this.from, this.to)
      .subscribe(
        (flights: Flight[]) => {
          this.flights = flights;
        },
        (errResp) => {
          console.error('Error loading flights', errResp);
        }
      ); */

/*     this.flightService
      .find(this.from, this.to)
      .subscribe(
        flights => {
          this.store.dispatch(new FlightsLoadedAction(flights));
        },
        error => {
          console.error('error', error);
        }
      ); */

    this.store.dispatch(new fromFlightBooking.FlightsLoadAction(this.from, this.to));
  }

  searchWithService(): void {
    if (!this.from || !this.to) {
       return;
    }

    this.flights$ =
      this.flightService
        .find(this.from, this.to);
  }

  save(): void {
    this.flightService
      .save(this.selectedFlight)
      .subscribe(
        flight => {
          this.selectedFlight = flight;
          this.message = 'Erfolgreich gespeichert!';
        },
        errResponse => {
          console.error('Fehler beim Speichern', errResponse);
          this.message = 'Fehler beim Speichern: ' + errResponse;
        }
      );
  }

  edit(f: Flight): void {
    this.selectedFlight = f;
    delete this.message;
  }

  selectedChange(f: Flight, selected: boolean): void {
    this.basket[f.id] = selected;
    const flightCount = Object.keys(this.basket)
          .map((key, index) => this.basket[key])
          .filter(value => value)
          .length;

    this.eventService.setSelectedFlightCount(flightCount);
  }

  delay(): void {
    this.flights$
    .pipe(
      take(1)
    )
    .subscribe(flights => {
          const flight = flights[0];

          const oldDate = new Date(flight.date);
          const newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
          const newFlight = { ...flight, date: newDate.toISOString(), delayed: true };

          this.store.dispatch(new fromFlightBooking.FlightUpdateAction(newFlight));
        }
      );
  }
}
