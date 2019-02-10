import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { GlobalService } from '../shared/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private gridApi;
  frameworkComponents: any;

  constructor(private httpService: HttpService, private router: Router, private gs: GlobalService) {
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
        onClick: this.gotoDetailsForm.bind(this),
        label: 'Edit'
      },
      pinned: 'right'
    }
  ];


  rowData = [{}, {}, {}];

  ngOnInit() {
    this.httpService.postdata('FetchDetails',
      {
        startDate: 'start',
        endDate: 'end1'
      }).subscribe(r => {
        if (r.d.errId === '200') {
          this.rowData = r.d.oc_details;

          this.gs.setMyGV(r.d.oc_details);
        } else {
          alert(r.d.errMsg);
        }
        this.gridApi.sizeColumnsToFit();
      },
        err => {
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

  public gotoDetailsForm(e) {
    const id = 'e.rowData';
    const url = '/CD.aspx/details';
    const myurl = `${url}/${e.rowData.ocId}`;


    this.router.navigate([myurl]);
  }
}
