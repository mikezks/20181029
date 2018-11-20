import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { FLIGHT_BOOKING_ROUTES } from './flight-booking.routing';
import { SharedModule } from '../shared/shared.module';
import * as fromFlightBooking from './+state';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { FlightTypeaheadComponent } from './flight-typeahead/flight-typeahead.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('flightBooking', fromFlightBooking.reducer),
    EffectsModule.forFeature([fromFlightBooking.FlightBookingEffects]),
    RouterModule.forChild(FLIGHT_BOOKING_ROUTES),
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    FlightSearchComponent,
    FlightCardComponent,
    FlightTypeaheadComponent
  ],
  exports: []
})
export class FlightBookingModule { }
