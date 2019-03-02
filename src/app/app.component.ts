import { Component, ChangeDetectorRef } from '@angular/core';
import { GlobalService } from './shared/global.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'CourierDetails';

  constructor(public gs: GlobalService, private cdref: ChangeDetectorRef) {

  }

  ngOnInit() {

    let today = moment();
    console.log(today);
    this.gs.setDetailsRange_Initial(today);
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }

}

