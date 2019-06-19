import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { GlobalService } from '../shared/global.service';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterJobModalComponent } from '../shared/filter-job-modal/filter-job-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gridApi;
  public rowClassRules;
  frameworkComponents: any;
  _get_emp_dtlist;
  _map_idx_chklist;

  inpFromDate;
  inpToDate;
  selectedStatus = { stId: "1", stName: "PENDING" };
  selectedJob;
  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router, private gs: GlobalService,
    private _authService: AuthService,
    private modalService: NgbModal) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
     // deltaIndicator : deltaIndicator,
    };
    let that = this;

    this.rowClassRules = {
      "courier-pending": function (params) {

        var ocId = params.data.ocId;
        return that.ValidateCourierPending(ocId);
      },
      "courier-complete": function (params) {
        var ocId = params.data.ocId;
        return that.ValidateCourierComplete(ocId);
      },
      "courier-cancel": function (params) {
        var ocId = params.data.ocId;
        return that.ValidateCourierCancel(ocId);
      },
    };
  }
  // deltaIndicator () {
  //   console.log("this._get_emp_dtlist:", this.get_emp_dtlist);
  //  //  console.log(params);
  //   return null;
  // }
  currentData;

  columnDefs = [
    { headerName: 'ID', field: 'ocId' },
    { headerName: 'Date', field: 'ocDate' },
    { headerName: 'Courier', field: 'courier' },
    {
      headerName: 'From Emp',
      field: 'empFrom',
     valueFormatter: function(params) {
    //  console.log("params.empFrom:", that._get_emp_dtlist);
        let arr = that._get_emp_dtlist.filter(x => x.empId ==  params.data.empFrom);
          console.log("arr:",arr);
         if (arr.length == 0) {
          return null; y
        } else {
        return arr[0].empName;
        }
      },
    },
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
  //12.17 c.op
  //16.16 c.op
  //17.36 c.op
  //18.27 c.op
  rowData = [];

  jobList = [];
  statusList = [
    { stId: "1", stName: "PENDING" },
    { stId: "2", stName: "COMPLETE" },
    { stId: "3", stName: "ALL" },
    { stId: "4", stName: "CANCEL" }
  ];

  ngOnInit() {
    this.spinner.show();
    this.gs.disableNav();
    this._authService.login();

    let dateService = this.gs.getDetailsRange();
    this.inpFromDate = dateService.from;
    this.inpToDate = dateService.to;

    this.jobList = this.gs.getFilteredJobData();
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

    if (this.selectedStatus != null) {
      this.spinner.show();

      this.httpService.postdata('FetchDetails',
        {
          startDate: this.DateObjToSqlString(this.inpFromDate),
          endDate: this.DateObjToSqlString(this.inpToDate),
          selectedStatus: this.selectedStatus.stId,
          selectedJob: (this.selectedJob == null || this.selectedJob == undefined) ? "0" : this.selectedJob.jobId
        }).subscribe(r => {
          this.spinner.hide();
          if (r.d.errId === '200') {
            this.rowData = r.d.oc_details;
            this._get_emp_dtlist = r.d.oc_emplist;
            console.log("this._get_emp_dtlist:", this._get_emp_dtlist);

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

    } else {
      alert('Please Select Status of Courier Details to Fetch');
    }
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

  public ValidateCourierCancel(ocId: any) {
    //type 1-> pending 2->complete
    let arr = this.rowData.filter(x => x.ocId == ocId);
    if (arr.length == 0) {
      return true;
    } else {
      let res = false;
      for (let ix = 0; ix < arr.length; ix++) {
        const e = arr[ix];
        if (e.ocStatus == "1") {
          res = true;
          break;
        }
      }

      return res;
    }
  }

  refreshJobList() {
    const modalRef = this.modalService.open(FilterJobModalComponent);

    modalRef.componentInstance.jobFromDate = this.gs.getJobFilterFrom(); // should be the id
    modalRef.componentInstance.jobToDate = this.gs.getJobFilterTo(); // should be the id

    modalRef.result.then((result) => {

      if (result.action == "submit") {

        this.spinner.show();

        this.httpService.postdata('FetchFilterJobsList',
          {
            startDate: this.DateObjToSqlString(result.data.from),
            endDate: this.DateObjToSqlString(result.data.to),
          }).subscribe(
            r => {
              this.spinner.hide();
              if (r.d.errId === '200') {
                console.log(r.d);
                if (r.d.resId == "1") {
                  this.gs.setGV_FilterJobData(r.d.filteredJobList, result.data);
                  this.jobList = this.gs.getFilteredJobData();
                }
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
    }).catch((error) => {
      console.log('dismiss');
    });
  }
}
