import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routing';
import { FlightBookingModule } from './flight-booking/flight-booking.module';
import { SharedModule } from './shared/shared.module';
import * as fromState from './+state';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeAt from '@angular/common/locales/de-AT';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeDe);     // de-DE
registerLocaleData(localeDeAt);   // de-AT
registerLocaleData(localeEs);     // es-ES

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(fromState.reducers, { metaReducers: fromState.metaReducers }),
    EffectsModule.forRoot([ fromState.AppEffects ]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    RouterModule.forRoot(APP_ROUTES),
    NgbModule.forRoot(),
    HttpClientModule,
    FlightBookingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: fromState.CustomSerializer },
    { provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
