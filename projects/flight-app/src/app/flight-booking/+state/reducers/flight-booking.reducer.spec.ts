import { reducer, initialState } from './flight-booking.reducer';
import { FlightsLoadedAction } from '../actions/flight-booking.actions';

describe('flight-booking.reducer', () => {

    const data = [
        { id: 17, from: 'Graz', to: 'Hamburg', date: '2018-07-09T12:00:00+00:00', delayed: true},
        { id: 18, from: 'Vienna', to: 'Barcelona', date: '2018-07-09T13:00:00+00:00', delayed: true },
        { id: 19, from: 'Frankfurt', to: 'Salzburg', date: '2018-07-09T14:00:00+00:00', delayed: true },
    ];

    it('should return the initial state', () => {
        const action = {} as any;
        const result = reducer(initialState, action);

        expect(result).toBe(initialState);
    });

    it('should add flights form action payload and return state', () => {
        const action = new FlightsLoadedAction(data);
        const result = reducer(initialState, action);

        expect(result.flights).toBe(data);
    });
});
