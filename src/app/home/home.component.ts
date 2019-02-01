import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { environment as env } from '../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpService) { }
  currentData;
  ngOnInit() {
    this.httpService.postdata(env.url.server + 'FetchReportData', {}).subscribe(
      (r) => {
        console.log('r set', r);

        this.httpService.postdata(env.url.server + 'FetchReportData', {}).subscribe(
          (r) => {
            console.log('r', r);
    
            this.currentData = r;
          }, (err) => {
            console.log('err', err);
    
          });

        this.currentData = r;
      }, (err) => {
        console.log('err', err);

      });
  }

}
