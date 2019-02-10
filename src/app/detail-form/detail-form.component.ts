import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from '../shared/global.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss']
})
export class DetailFormComponent implements OnInit {

  courierData: any;
  constructor(private route: ActivatedRoute,
    private router: Router, private gs: GlobalService) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.courierData = this.gs.getMyGV(id);
    console.log(this.courierData);
    // this.courierData = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.gs.getMyGV(params.get('id'))
    //   )
    // );


  }

}
