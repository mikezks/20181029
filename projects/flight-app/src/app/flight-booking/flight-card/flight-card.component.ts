import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Flight } from '../../entities/flights';


@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit {
  @Input() item: Flight;
  @Input() selected: boolean;
  @Output() itemChange = new EventEmitter<Flight>();
  @Output() selectedChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  select(): void {
    this.selected = true;
    this.selectedChange.emit(this.selected);
  }

  deselect(): void {
    this.selected = false;
    this.selectedChange.emit(this.selected);
  }

  edit(): void {
    this.itemChange.emit(this.item);
  }
}
