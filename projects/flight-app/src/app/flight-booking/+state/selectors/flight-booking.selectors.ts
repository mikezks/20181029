import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../reducers/flight-booking.reducer';

// Selector to get Feature State
export let getFlightBookingState = createFeatureSelector<State>('flightBooking');

// Create Memoized Selectors which can use other Selector Functions
// to transform the result in a Projector Funtion.
// Memoized Selectors cache the result until they recalculate because of
// relevant store changes.
export const getFlights = createSelector(
  // Selector
  getFlightBookingState,
  // Projector
  (state: State) => state.flights
);

export const getDelayedFlights = createSelector(
  getFlights,
  (flights) => flights.filter(f => f.delayed)
);

export const getSumDelayedFlights = createSelector(
  getDelayedFlights,
  (flights) => flights.length
);

export const getOnScheduleFlights = createSelector(
  getFlights,
  (flights) => flights.filter(f => !f.delayed)
);

export const getSumOnScheduleFlights = createSelector(
  getOnScheduleFlights,
  (flights) => flights.length
);

export const getTotalFlights = createSelector(
  getSumDelayedFlights,
  getSumOnScheduleFlights,
  (sumDelayed, sumOnSchedule) => sumDelayed + sumOnSchedule
);


// Custom RxJS Operator which uses a Store Selector Function
// and additional standard RxJS Operators.
export const getDelayedRxJSOperator = () =>
  pipe(
    // RxJS Operstor to select state from store
    select(getFlights),
    // RxJS Map Operator
    map(flights =>
      // Array Filter Function
      flights.filter(f =>
          f.delayed)
      )
  );
