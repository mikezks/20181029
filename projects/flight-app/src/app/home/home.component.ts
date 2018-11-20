import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromState from '../+state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  count$: Observable<number>;

  constructor(private store: Store<fromState.State>) {
  }

  ngOnInit() {
    this.count$ = this.store.pipe(select(fromState.getCount));
  }

  countUp() {
    this.store.dispatch(new fromState.IncreaseByAction(15));
  }
}
