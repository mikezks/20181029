import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../../entities/flights';
import { HttpClient } from '@angular/common/http';
import { FlightService } from './flight.service';
import { DummyFlightService } from './dummy-flight.service';

const DEBUG = false;

@Injectable({
  providedIn: 'root',
  useFactory: (http: HttpClient) => {
    if (DEBUG) {
      return new DummyFlightService();
    } else {
      return new FlightService(http);
    }
  },
  deps: [HttpClient]
})
export abstract class AbstractFlightService {
  abstract find(from: string, to: string): Observable<Flight[]>;
  abstract save(flight: Flight): Observable<Flight>;
}
