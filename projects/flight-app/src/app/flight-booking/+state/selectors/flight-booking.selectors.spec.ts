import * as fromSelectors from './flight-booking.selectors';

describe('flight-booking.selectors', () => {
    const data = [
        { id: 17, from: 'Graz', to: 'Hamburg', date: '2018-07-09T12:00:00+00:00', delayed: true},
        { id: 18, from: 'Vienna', to: 'Barcelona', date: '2018-07-09T13:00:00+00:00', delayed: false },
        { id: 19, from: 'Frankfurt', to: 'Salzburg', date: '2018-07-09T14:00:00+00:00', delayed: false },
    ];

    it('should calc delayed flights', () => {
        const delayed = fromSelectors.getDelayedFlights.projector(data);
        expect(fromSelectors.getSumDelayedFlights.projector(delayed)).toBe(1);
    });

    it('should calc flights on schedule', () => {
        const onSchedule = fromSelectors.getOnScheduleFlights.projector(data);
        expect(fromSelectors.getSumOnScheduleFlights.projector(onSchedule)).toBe(2);
    });

    it('should calc total flights', () => {
        expect(fromSelectors.getTotalFlights.projector(5, 10)).toBe(15);
    });
});
