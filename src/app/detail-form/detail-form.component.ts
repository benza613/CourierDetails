import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from '../shared/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSelect } from '../validators/select.validator';
import * as moment from 'moment';
import { CourierType } from '../models/CourierType';
import { HttpService } from '../shared/http.service';

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
  id;

  constructor(private route: ActivatedRoute,
    private router: Router, private gs: GlobalService,
    private formBuilder: FormBuilder, private httpService: HttpService
  ) { }

  ngOnInit() {

    this.initCourierForm();

    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    let mDate;
    let gvData = this.gs.getCourierDet(this.id);
    this.chekLstData = gvData.oc_checklist;
    this.empLstData = gvData.oc_emplist;

    if (this.id != null) {

      this.courierData = gvData.rowData[0];
      mDate = moment(this.courierData.ocDate, 'DD/MM/YYYY');
      this.gs.enableNav();
    } else {
      this.courierData = new CourierType();
      this.courierData.ocId = "";
      this.courierData.ocCLReq = "0";
      mDate = moment();

    }

    this.patchValuesIntoForm(mDate);


    console.log(gvData);



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

    this.httpService.postdata('IU_CourierDetails',
      {
        formData: copy_CForm,
        selectedDocs: selectedDocs
      }).subscribe(r => {
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
}
