import { Injectable } from '@angular/core';
import { AbstractFlightService } from './abstract-flight.service';
import { Observable, of } from 'rxjs';
import { Flight } from '../../entities/flights';

@Injectable()
export class DummyFlightService implements AbstractFlightService {

    find(from: string, to: string): Observable<Flight[]> {
      return of([
        { 'id': 6, 'from': 'Wien', 'to': 'Berlin',
          'date': '2018-07-08T12:44:16.2404861+00:00', 'delayed': false },
        { 'id': 7, 'from': 'Wien', 'to': 'Berlin',
          'date': '2018-07-08T13:44:16.2404861+00:00', 'delayed': false },
        { 'id': 8, 'from': 'Wien', 'to': 'Berlin',
          'date': '2018-07-09T05:44:16.2404861+00:00', 'delayed': false }
      ]);
    }

    save(flight: Flight): Observable<Flight> {
      return of(
        {
          'id': 6, 'from': 'Wien', 'to': 'Berlin',
          'date': '2018-07-08T12:44:16.2404861+00:00', 'delayed': false
        }
      );
    }
}
