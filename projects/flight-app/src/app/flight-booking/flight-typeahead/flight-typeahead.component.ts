import { Component, OnInit, OnDestroy } from '@angular/core';
import { Flight } from '../../entities/flights';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable, of, timer, Subject, Subscription, interval, combineLatest } from 'rxjs';
import { map, tap, takeUntil, take, share, switchMap, debounceTime, startWith, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.scss']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {

  control = new FormControl();
  flights: Flight[] = [
    { 'id': 6, 'from': 'Wien', 'to': 'Berlin',
      'date': '2018-07-08T12:44:16.2404861+00:00', 'delayed': false },
    { 'id': 7, 'from': 'Wien', 'to': 'Berlin',
      'date': '2018-07-08T13:44:16.2404861+00:00', 'delayed': false },
    { 'id': 8, 'from': 'Wien', 'to': 'Berlin',
      'date': '2018-07-09T05:44:16.2404861+00:00', 'delayed': false }
  ];
  flights$ = new Observable<Flight[]>();
  online$: Observable<boolean>;
  loading: boolean;
  online: boolean;
  displayedColumns: string[] = ['id', 'from', 'to', 'date', 'delayed'];
  
  /* RxJS Demo */
  number$: Observable<number>;
  timer$: Observable<number>;
  private destroySubject$: Subject<boolean> = new Subject();
  destroy$ = this.destroySubject$.asObservable();
  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.rxjsDemo();

    this.online$ = interval(2000).pipe(
      startWith(0),
      map(x => Math.random() < 0.5),
      distinctUntilChanged(),
      tap(x => this.online = x)
    );

    this.flights$ =
      combineLatest(
        this.control
          .valueChanges
          .pipe(
            debounceTime(300),
            filter(value => value.length >= 3 )
          ),
        this.online$)
        .pipe(
          filter(combine => combine[1]),
          map(combine => combine[0]),
          distinctUntilChanged(),
          tap(() => this.loading = true),
          switchMap(input => this.load(input)),
          tap(() => this.loading = false)
        );
  }

  ngOnDestroy(): void {
    // Zwei Möglichkeiten um RxJS Observable Subscriptions zu beenden bzw.
    // den Stream zu completen
    this.destroySubject$.next(true);
    this.subscription.unsubscribe();
  }

  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});

  }

  rxjsDemo(): void {
    this.number$ = of(1, 2).pipe(
      map(number => number + 1),
      tap(number => console.log(number))
    );

    this.timer$ =
      timer(0, 1000)
        .pipe(
          takeUntil(this.destroySubject$), // Per Subject ein complete des Stream auslösen; ähnlich wie ein unsubscribe
          tap(value => console.log(value)),
          //take(2),
          share() // Hot / Warm Observable
        );

    // Subscription zuweisen, um in ngOnDestroy ein unsubscribe ausführen zu können
    this.subscription = this.timer$.subscribe();

    // Nach 15 sec wird ein true Event über das Subject ausgesendet
    // Das führt zum complete des oben definierten Timer Observables
    // Ist eine Alternative zum unsubscribe
    setTimeout(() => this.destroySubject$.next(true), 15000);

    // Log Ausgabe, wenn der destroy Stream ein neues Event sendet
    this.destroy$.subscribe(
      data => console.log(data)
    );

    // API Abfrage mit switchMap alle 10 ms
    // Alter HTTP Request wird abgebrochen, falls er noch pending ist, wenn
    // der neue Request abgeschickt werden soll
    timer(0, 10)
      .pipe(
        take(10),
        switchMap(() => this.load('Berlin'))
      ).subscribe();
  }
}
