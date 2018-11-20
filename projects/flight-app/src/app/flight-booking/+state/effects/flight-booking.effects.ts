import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { AbstractFlightService } from '../../services/abstract-flight.service';
import { FlightBookingActionTypes, FlightsLoadAction, FlightsLoadedAction } from '../actions/flight-booking.actions';

@Injectable()
export class FlightBookingEffects {

  constructor(
    private flightService: AbstractFlightService,
    private actions$: Actions) {
  }

  @Effect()
  flightsLoad$ =
    this.actions$
      .pipe(
        ofType(FlightBookingActionTypes.FlightsLoadAction),
        switchMap(
          (a: FlightsLoadAction) => this.flightService.find(a.from, a.to)
        ),
        map(flights => new FlightsLoadedAction(flights))
  );
}
