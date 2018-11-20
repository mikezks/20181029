import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import * as fromFlightBooking from '../+state';
import { Flight } from '../../entities/flights';
import { AbstractFlightService } from '../services/abstract-flight.service';
import { FlightSearchComponent } from './flight-search.component';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';

const translation = TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: () => new TranslateFakeLoader()
    }
});

describe('flight-search.component', () => {
    describe('Basic Tests', () => {
        let comp: FlightSearchComponent;
        let fixture: ComponentFixture<FlightSearchComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({ 'flightBooking': fromFlightBooking.reducer }),
                    HttpClientModule,
                    translation,
                    SharedModule
                ],
                declarations: [
                    FlightSearchComponent,
                    FlightCardComponent
                ],
                providers: [
                    // Add provider from app.module.ts if necessary
                ]
            }).compileComponents();

            //translate = TestBed.get(TranslateService);
            fixture = TestBed.createComponent(FlightSearchComponent);
            comp = fixture.componentInstance;
        }));

        it('should have "from" set to "Wien" initially', () => {
            expect(comp.from).toBe('Wien');
        });

        it('should not have a selectedFlight initially', () => {
            expect(comp.selectedFlight).toBeUndefined();
        });

        it('should not have any flights loaded initially', () => {
            fixture.detectChanges();
            comp.flights$.subscribe(result =>
                expect(result).toBeFalsy
            );
        });
    });

    describe('Tests with flightServiceMock', () => {
        let comp: FlightSearchComponent;
        let fixture: ComponentFixture<FlightSearchComponent>;

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

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({ 'flightBooking': fromFlightBooking.reducer }),
                    HttpClientModule,
                    translation,
                    SharedModule
                ],
                declarations: [
                    FlightSearchComponent,
                    FlightCardComponent
                ],
                providers: [
                    // Add provider from app.module.ts if necessary
                ]
            })
            .overrideComponent(FlightSearchComponent, {
                set: {
                    providers: [
                        {
                            provide: AbstractFlightService,
                            useValue: flightServiceMock
                        }
                    ]
                }
            }).compileComponents();

            fixture = TestBed.createComponent(FlightSearchComponent);
            comp = fixture.componentInstance;
        }));

        it('should not load flights w/o from and to', () => {
            comp.from = '';
            comp.to = '';
            fixture.detectChanges();
            comp.searchWithService();

            comp.flights$.subscribe(result =>
                expect(result.length).toBe(0)
            );
        });

        it('should load flights w/ from and to', () => {
            comp.from = 'Graz';
            comp.to = 'Hamburg';
            fixture.detectChanges();
            comp.searchWithService();

            comp.flights$.subscribe(result =>
                expect(result.length).toBe(3)
            );
        });
    });

    describe('Testing a component template', () => {
        let fixture: ComponentFixture<FlightSearchComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({ 'flightBooking': fromFlightBooking.reducer }),
                    HttpClientModule,
                    translation,
                    SharedModule
                ],
                declarations: [
                    FlightSearchComponent,
                    FlightCardComponent
                ],
                providers: [
                    // Add provider from app.module.ts if necessary
                ]
            })
            .compileComponents();

            fixture = TestBed.createComponent(FlightSearchComponent);
        }));

        it('should have a disabled search button w/o params', fakeAsync(() => {
            // Intial Databinding, ngOnInit
            fixture.detectChanges();
            tick();

            // Get input field for from
            const from = fixture
                    .debugElement
                    .query(By.css('input[name=from]'))
                    .nativeElement;

            from.value = '';
            from.dispatchEvent(new Event('input'));

            // Get input field for to
            const to = fixture
                    .debugElement
                    .query(By.css('input[name=to]'))
                    .nativeElement;

            to.value = '';
            to.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            tick();

            // Get disabled button
            const disabled = fixture
                    .debugElement
                    .query(By.css('button'))
                    .properties['disabled'];

            expect(disabled).toBeTruthy();
          }));
    });

    describe('Testing the interaction with the store', () => {
        let comp: FlightSearchComponent;
        let fixture: ComponentFixture<FlightSearchComponent>;
        let store: Store<fromFlightBooking.State>;

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

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({ 'flightBooking': fromFlightBooking.reducer }),
                    EffectsModule.forRoot([ fromFlightBooking.FlightBookingEffects ]),
                    HttpClientModule,
                    translation,
                    SharedModule
                ],
                declarations: [
                    FlightSearchComponent,
                    FlightCardComponent
                ],
                providers: [
                    {
                        provide: AbstractFlightService,
                        useValue: flightServiceMock
                    }
                ]
            })
            .compileComponents();

            store = TestBed.get(Store);
            spyOn(store, 'dispatch').and.callThrough();
            fixture = TestBed.createComponent(FlightSearchComponent);
            comp = fixture.componentInstance;
        }));

        it('should dispatch an action to load flights when search() method is called', () => {
            const action = new fromFlightBooking.FlightsLoadAction('Wien', 'Berlin');
            comp.search();

            expect(store.dispatch).toHaveBeenCalledWith(action);
        });
    });
});
