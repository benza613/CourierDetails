import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { GlobalService } from '../shared/global.service';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gridApi;
  public rowClassRules;
  frameworkComponents: any;

  _map_idx_chklist;

  inpFromDate;
  inpToDate;
  selectedStatus = { stId: "1", stName: "PENDING" };

  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router, private gs: GlobalService,
    private _authService: AuthService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent
    };
    let that = this;

    this.rowClassRules = {
      "courier-pending": function (params) {

        var ocId = params.data.ocId;
        console.log(ocId)
        return that.ValidateCourierPending(ocId);
      },
      "courier-complete": function (params) {

        var ocId = params.data.ocId;
        return that.ValidateCourierComplete(ocId);
      },
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

  rowData = [];

  statusList = [
    { stId: "1", stName: "PENDING" },
    { stId: "2", stName: "COMPLETE" },
    { stId: "3", stName: "ALL" }
  ];

  ngOnInit() {
    this.spinner.show();
    this.gs.disableNav();
    this._authService.login();

    let dateService = this.gs.getDetailsRange();
    this.inpFromDate = dateService.from;
    this.inpToDate = dateService.to;

    this.fetchNewDetails();
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

  public fetchNewDetails() {
    this.spinner.show();

    this.httpService.postdata('FetchDetails',
      {
        startDate: this.DateObjToSqlString(this.inpFromDate),
        endDate: this.DateObjToSqlString(this.inpToDate),
        selectedStatus: this.selectedStatus.stId
      }).subscribe(r => {
        this.spinner.hide();
        if (r.d.errId === '200') {
          this.rowData = r.d.oc_details;
          console.log(r.d);
          this.gs.setGV_CourierData(r.d);

          this._map_idx_chklist = r.d.oc_map_index_checklist;
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

  public addDetailsForm() {
    let myurl = `/CD.aspx/details/`;
    this.router.navigate([myurl]);
  }

  public onModelChange_From($event) {

    this.gs.updateFromDate($event);
  }

  public onModelChange_To($event) {

    this.gs.updateToDate($event);

  }

  private DateObjToSqlString(dateObj) {
    return moment().year(dateObj.year).month(dateObj.month - 1).date(dateObj.day).format("YYYY/MM/DD");
  }

  public ValidateCourierPending(ocId: any) {
    //type 1-> pending 2->complete 
    let arr = this._map_idx_chklist.filter(x => x.ocId == ocId);

    if (arr.length == 0) {
      return true;
    } else {
      let res = false;
      for (let ix = 0; ix < arr.length; ix++) {
        const e = arr[ix];
        if (e.oclStatus == "PENDING") {
          res = true;
          break;
        }
      }

      return res;
    }
  }

  public ValidateCourierComplete(ocId: any) {
    //type 1-> pending 2->complete 
    let arr = this._map_idx_chklist.filter(x => x.ocId == ocId);

    if (arr.length == 0) {
      return false;
    } else {
      let res = true;
      for (let ix = 0; ix < arr.length; ix++) {
        const e = arr[ix];
        if (e.oclStatus == "PENDING") {
          res = false;
          break;
        }
      }

      return res;
    }
  }
}
