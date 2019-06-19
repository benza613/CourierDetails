import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from '../shared/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSelect } from '../validators/select.validator';
import * as moment from 'moment';
import { CourierType } from '../models/CourierType';
import { HttpService } from '../shared/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TallyJobModalComponent } from '../shared/tally-job-modal/tally-job-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss']
})
export class DetailFormComponent implements OnInit {
  courierForm: FormGroup;
  submitted = false;
  courierData: CourierType;
  chekLstData: any;
  empLstData: any;
  filesUploadedData: any;
  filesCoverLetterData: any;
  tallyJobData: any;

  mapChecklistData: any = [];
  mapJobData: any = [];
  id; cr_status;

  constructor(private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router, private gs: GlobalService,
    private formBuilder: FormBuilder, private httpService: HttpService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.initCourierForm();

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    let mDate;
    let gvData = this.gs.getCourierDet(this.id);
    this.cr_status = gvData.rowData[0].ocStatus;
    console.log("RowData 1:", this.cr_status);
    this.chekLstData = gvData.oc_checklist;
    this.empLstData = gvData.oc_emplist;
    this.filesUploadedData = gvData.oc_filesUploaded;
    this.filesCoverLetterData = gvData.oc_filesCoverLetter;
    this.tallyJobData = gvData.oc_tallyJobs;
      if (this.id != null) {

      this.courierData = gvData.rowData[0];
      mDate = moment(this.courierData.ocDate, 'DD/MM/YYYY');
      this.gs.enableNav();
      this.mapChecklistData = gvData.oc_map_index_checklist;
      this.mapJobData = gvData.oc_map_index_jobs.filter((x) => x.ocId == this.id);


    } else {
      this.courierData = new CourierType();
      this.courierData.ocId = "";
      this.courierData.ocCLReq = "0";
      mDate = moment();

    }

    this.patchValuesIntoForm(mDate);

    this.setCheckListValues();

    console.log(gvData);

    if (this.cr_status == "1" ) {
      this.gs.disableNav();
     }


  }

  // convenience getter for easy access to form fields
  get f() { return this.courierForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.courierForm.invalid) {
      console.log('inv', this.courierForm.invalid);

      return;
    }


    //ES6 spread operator
    const copy_CForm = { ...this.courierForm.value }
  
    //format date
    let inValidDateObj = copy_CForm.ocDate;
    let x = moment().year(inValidDateObj.year).month(inValidDateObj.month - 1).date(inValidDateObj.day);
    copy_CForm.ocDate = x.format("DD/MM/YYYY");
    copy_CForm.ocId = this.id;
    copy_CForm.ocCLReq = copy_CForm.ocCLReq == false ? "0" : "1";
    console.log(copy_CForm);

    let selectedDocs = [];
    this.chekLstData.forEach(x => {
      if (x.checked == true) {
        selectedDocs.push(x.oclId);
      }
    });

    this.spinner.show();
    this.httpService.postdata('IU_CourierDetails',
      {
        formData: copy_CForm,
        selectedDocs: selectedDocs
      }).subscribe(r => {
        this.spinner.hide();

        console.log(r);
        if (r.d.errId === '200') {

          //Insert Success 
          if (this.id == null) {
            copy_CForm.ocId = r.d.misc[0];
            this.gs.setGV_AddCourRow(copy_CForm);
            alert(r.d.resMsg);

            const url = '/CD.aspx/details';
            const myurl = `${url}/${r.d.misc[0]}`;
            this.router.navigate([myurl]);

          } else {

          }

        } else {
          alert(r.d.errMsg);
        }
      },
        err => {
          this.spinner.hide();

          console.log('err', err);
        }
      );


  }

  initCourierForm() {

    this.courierForm = this.formBuilder.group({
      ocDate: ['', Validators.required],
      courier: ['', Validators.required],
      empFrom: ['', Validators.required],
      cityTo: ['', Validators.required],
      mode: ['', Validators.required],
      pod: ['', Validators.required],
      ocWt: ['', Validators.required],
      ocWtUM: ['', [Validators.required, ValidateSelect]],
      ocRecieve: ['', Validators.required],
      remark: ['', Validators.required],
      ocCLReq: [false]
    });
  }

  patchValuesIntoForm(mDate) {
    this.courierForm.patchValue({
      ocDate: {
        "year": mDate.year(),
        "month": mDate.month() + 1,
        "day": mDate.date()
      },
      courier: this.courierData.courier,
      empFrom: this.courierData.empFrom,
      cityTo: this.courierData.cityTo,
      mode: this.courierData.mode,
      pod: this.courierData.pod,
      ocWt: this.courierData.ocWt,
      ocWtUM: this.courierData.ocWtUM,
      ocRecieve: this.courierData.ocRecieve,
      remark: this.courierData.remark,
      ocCLReq: this.courierData.ocCLReq == "0" ? false : true
    });
  }

  getFilesCount(_oclId) {

    if (this.id != null) {
      let arrC = this.filesUploadedData.filter((x) => x.oclId == _oclId && x.ocId == this.id);
      if (arrC.length > 0)
        return arrC[0].countFiles;
      else
        return "0";
    } else {
      return "0";

    }
  }

  getCLCount() {

    if (this.id != null) {
      let arrC = this.filesCoverLetterData.filter((x) => x.ocId == this.id);
      if (arrC.length > 0)
        return arrC[0].countFiles;
      else
        return "0";
    } else {
      return "0";

    }
  }

  setCheckListValues() {


    this.chekLstData.forEach(x => {
      if (this.id != null) {
        let arrCMap = this.mapChecklistData.filter((y) => y.oclId == x.oclId && y.ocId == this.id);

        if (arrCMap.length > 0) {
          x["checked"] = true;
          x["oclStatus"] = arrCMap[0].oclStatus;
        } else {
          x["checked"] = false;
          x["oclStatus"] = "PENDING";
        }
      } else {
        x["checked"] = false;
        x["oclStatus"] = "NOT VALID";

      }
    });

    console.log(this.chekLstData);

  }

  getJobNoFromID(_jobId) {
    let arrJ = this.tallyJobData.filter((x) => x.jobId == _jobId);
    if (arrJ.length > 0) {
      return arrJ[0].jobNo;
    }
    else {
      return "ID: " + _jobId;

    }
  }

  openJobMapping() {
    if (this.id != null) {
      const modalRef = this.modalService.open(TallyJobModalComponent);
      modalRef.componentInstance.courId = this.id; // should be the id

      let arrJ = JSON.parse(JSON.stringify(this.tallyJobData)); //Es6 deep copy

      for (let idx = 0; idx < this.mapJobData.length; idx++) {
        const element = this.mapJobData[idx];

        arrJ.map((x) => {

          if (x.jobId == element.jobId)
            x['disabled'] = true;
        });
      }

      modalRef.componentInstance.tallyJobList = arrJ;

      modalRef.result.then((result) => {
        console.log(result);

        if (result.action == "submit" && result.data.length > 0) {

          this.httpService.postdata('addIndexJobMapping',
            {
              tallyJobs: result.data,
              ocId: this.id
            }).subscribe(r => {
              console.log(r);
              if (r.d.errId === '200') {
                //TO DO 

                for (let idx_j = 0; idx_j < result.data.length; idx_j++) {
                  const o = result.data[idx_j];

                  let objMap_idx_job = {
                    ocId: this.id,
                    jobId: o.jobId
                  };
                  this.mapJobData.push(objMap_idx_job);
                  this.gs.addJobMapping(objMap_idx_job);
                }
                alert(r.d.resMsg);

              } else {
                alert(r.d.errMsg);
              }

            },
              err => {
                console.log('err', err);
              }
            );
        }
      }).catch((error) => {
        console.log('dismiss');
      });

    } else {
      alert('Please Save this Courier Detail First');
    }
  }

  unlinkJobMapping(objJob) {
    console.log(objJob);
    this.httpService.postdata('unlinkJob',
      {
        jobId: objJob.jobId,
        ocId: objJob.ocId
      }).subscribe(r => {
        console.log(r);
        if (r.d.errId === '200') {
          //TO DO 

          let ix = this.mapJobData.indexOf(objJob);
          this.mapJobData.splice(ix, 1);

          this.gs.removeJobMapping(objJob);
          alert(r.d.resMsg);
        } else {
          alert(r.d.errMsg);
        }
      },
        err => {
          console.log('err', err);
        }
      );
  }

  updateCheckListStatus(item) {
    if (this.id != null) {
      this.spinner.show();

      let clObj = {
        ocId: this.id,
        oclId: item.oclId,
        oclStatus: item.oclStatus
      };

      this.httpService.postdata('updateCheckListStatus', clObj)
        .subscribe(r => {
          console.log(r);
          if (r.d.errId === '200') {

            let refreshedChkLstData = this.gs.updateCourier_Checklist(clObj, r.d.resId, r.d.misc[0]);
            this.chekLstData = refreshedChkLstData.oc_checklist;
            this.mapChecklistData = refreshedChkLstData.oc_map_index_checklist;
            this.setCheckListValues();
            this.spinner.hide();

            alert(r.d.resMsg);
          } else {
            alert(r.d.errMsg);
          }
        },
          err => {
            console.log('err', err);
          }
        );

    }
  }

  delCourierData(item) {
    console.log('Deleted Status :', item);
    if (this.id != null)  {
      this.httpService.postdata('delCourierData',
      {
        cr_st_id : item,
        ocId: this.id
      }).subscribe(r => {
        console.log(r);
        if (r.d.errId === '200') {
           alert(r.d.resMsg);
           let myurl = `/CD.aspx/`;
           this.router.navigate([myurl]);
        } else {
          alert(r.d.errMsg);
        }
      },
        err => {
          console.log('err', err);
        }
      );
    }
   }


}
