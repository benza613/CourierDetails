import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalService } from '../shared/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSelect } from '../validators/select.validator';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss']
})
export class DetailFormComponent implements OnInit {
  courierForm: FormGroup;
  submitted = false;
  courierData: any;

  constructor(private route: ActivatedRoute,
    private router: Router, private gs: GlobalService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.courierData = this.gs.getMyGV(id);
    console.log(this.courierData);

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
      ocCLReq: ['', Validators.required]
    });


    let mDate = moment(this.courierData[0].ocDate, 'DD/MM/YYYY');

    this.courierForm.patchValue({
      ocDate: {
        "year": mDate.year(),
        "month": mDate.month() + 1,
        "day": mDate.date()
      },
      courier: this.courierData[0].courier,
      empFrom: this.courierData[0].empFrom,
      cityTo: this.courierData[0].cityTo,
      mode: this.courierData[0].mode,
      pod: this.courierData[0].pod,
      ocWt: this.courierData[0].ocWt,
      // ocWtUM: this.courierData[0].ocWtUM,
      ocRecieve: this.courierData[0].ocRecieve,
      remark: this.courierData[0].remark,
      ocCLReq: this.courierData[0].ocCLReq
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.courierForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.courierForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.courierForm.value))
  }
}
