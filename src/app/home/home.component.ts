import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { GlobalService } from '../shared/global.service';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gridApi;
  frameworkComponents: any;

  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router, private gs: GlobalService,
    private _authService: AuthService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent
    };
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
        onClick: this.editDetailsForm.bind(this),
        label: 'Edit'
      },
      pinned: 'right'
    }
  ];


  rowData = [{}, {}, {}];

  ngOnInit() {
    this.spinner.show();
    this.gs.disableNav();
    this._authService.login();
    this.httpService.postdata('FetchDetails',
      {
        startDate: 'start',
        endDate: 'end1'
      }).subscribe(r => {
        this.spinner.hide();
        if (r.d.errId === '200') {
          this.rowData = r.d.oc_details;
          console.log(r.d);
          this.gs.setGV_CourierData(r.d);
        } else {
          alert(r.d.errMsg);
        }
        this.gridApi.sizeColumnsToFit();
      },
        err => {
          alert('Error Occurred. Please Check Console');
          console.log('err', err);
        }
      );
  }

  onGridReady(params) {
    this.gridApi = params.api;

    setTimeout(function () {
      // params.api.resetRowHeights();
      // params.api.setDomLayout('autoHeight');
    }, 500);
  }

  public editDetailsForm(e) {
    const id = 'e.rowData';
    const url = '/CD.aspx/details';
    const myurl = `${url}/${e.rowData.ocId}`;


    this.router.navigate([myurl]);
  }

  public addDetailsForm() {
    let myurl = `/CD.aspx/details/`;
    this.router.navigate([myurl]);
  }
}
