import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  lang: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  get flightCount$(): Observable<number> {
    return this.eventService.selectedFlightCount$;
  }

  get nextLang() {
    return this.lang === 'de' ? 'en' : 'de';
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private eventService: EventService,
    private translate: TranslateService) {
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    this.lang = lang;
  }

  toggleLang(): void {
    this.setLang(this.nextLang);
  }
}
