import { Routes } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightTypeaheadComponent } from './flight-typeahead/flight-typeahead.component';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: 'flight-search',
    component: FlightSearchComponent
  },
  {
    path: 'flight-typeahead',
    component: FlightTypeaheadComponent
  },
  {
    path: 'flight-edit/:id',
    component: FlightTypeaheadComponent
  }
/*{
      path: 'flight-edit/:id',
      component: FlightEditComponent
  },
  {
      path: 'passenger-search',
      component: PassengerComponent
  }, */
];
