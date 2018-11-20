import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Flight } from '../../../entities/flights';
import { AbstractFlightService } from '../../services/abstract-flight.service';
import { FlightsLoadAction, FlightsLoadedAction } from '../actions/flight-booking.actions';
import { FlightBookingEffects } from './flight-booking.effects';

describe('flight-booking.effects', () => {
    let effects: FlightBookingEffects;
    let actions: Observable<any> | ReplaySubject<any>;

    const data = [
        { id: 17, from: 'Graz', to: 'Hamburg', date: '2018-07-09T12:00:00+00:00', delayed: true},
        { id: 18, from: 'Vienna', to: 'Barcelona', date: '2018-07-09T13:00:00+00:00', delayed: true },
        { id: 19, from: 'Frankfurt', to: 'Salzburg', date: '2018-07-09T14:00:00+00:00', delayed: true },
    ];

    const flightServiceMock = {
        find(from: string, to: string): Observable<Flight[]> {
            return of(data);
        },
        // The definitons below may not be needed in your
        // training scenario
        flights: [],
        load(from: string, to: string): void {
            this.find(from, to).subscribe(f => { this.flights = f; });
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({

            providers: [
                FlightBookingEffects,
                provideMockActions(() => actions),
                {
                    provide: AbstractFlightService,
                    useValue: flightServiceMock
                }
            ]
        });

        effects = TestBed.get(FlightBookingEffects);
    });

    it('should be observable of FlightsLoadedAction after FlightsLoadAction was in actions stream (Marble Testing)', () => {
        const flightsLoadAction = new FlightsLoadAction('Wien', 'Berlin');
        const flightsLoadedAction = new FlightsLoadedAction(data);

        // Refer to 'Writing Marble Tests' for details on '--a-' syntax
        actions = hot('--a-', { a: flightsLoadAction });
        const expected = cold('--b', { b: flightsLoadedAction });

        expect(effects.flightsLoad$).toBeObservable(expected);
    });

    it('should equal observable of FlightsLoadedAction after FlightsLoadAction was in actions stream (ReplaySubject)', () => {
        actions = new ReplaySubject(1);
        const flightsLoadAction = new FlightsLoadAction('Wien', 'Berlin');
        const flightsLoadedAction = new FlightsLoadedAction(data);

        (actions as ReplaySubject<any>).next(flightsLoadAction);

        effects.flightsLoad$.subscribe(result => {
            expect(result).toEqual(flightsLoadedAction);
        });
    });
});
