import { Component } from '@angular/core';
import { GlobalService } from './shared/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'CourierDetails';

  constructor(private gs: GlobalService) {
  }

}

