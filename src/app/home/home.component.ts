import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { environment as env } from '../../environments/environment';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gridApi;
  frameworkComponents: any;
  
  constructor(private httpService: HttpService, private router: Router) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }
  currentData;

  columnDefs = [
    { headerName: 'ID', field: 'ocId' },
    { headerName: 'Date', field: 'ocDate' },
    { headerName: 'Courier', field: 'courier' },
    { headerName: 'From Emp', field: 'empFrom' },
    { headerName: 'To City', field: 'cityTo' },
    { headerName: 'Mode', field: 'mode' },
    { headerName: 'POD', field: 'pod' },
    { headerName: 'Weight', field: 'ocWt' },
    { headerName: 'Unit', field: 'ocWtUM' },
    { headerName: 'Recieve', field: 'ocRecieve' },
    { headerName: 'Remarks', field: 'remark' },
    { headerName: 'Cover Letter Reqd', field: 'ocCLReq' },
    {
      headerName: 'Edit',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.gotoDetailsForm.bind(this),
        label: 'Click 1'
      },
      pinned: 'right'
    }
  ];


  // field: 'ocId',

  rowData = [
    {},
    {},
    {}
  ];



  ngOnInit() {
    this.httpService.postdata(env.url.server + 'FetchDetails', {
      startDate: "start",
      endDate: "end1",
    }).subscribe(
      (r) => {

        if (r.d.errId == "200") {
          this.rowData = r.d.oc_details;
        } else {
          alert(r.d.errMsg);
        }
        this.gridApi.sizeColumnsToFit();

      }, (err) => {
        console.log('err', err);

      });
  }

  onGridReady(params) {
    this.gridApi = params.api;


    setTimeout(function () {
      // params.api.resetRowHeights();
      // params.api.setDomLayout('autoHeight');
    }, 500);
  }

  public gotoDetailsForm(e) {

    console.log('clicke d ', e.rowData);
    var id = 'e.rowData';
    var url = '/details';
    var myurl = `${url}/${id}`;
    // this.router.navigateByUrl(myurl).then(e => {
    //   if (e) {
    //     console.log("Navigation is successful!");
    //   } else {
    //     console.log("Navigation has failed!");
    //   }
    // });
  }
}
