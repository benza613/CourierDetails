import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateType } from 'src/app/models/date-type.model';

@Component({
  selector: 'app-filter-job-modal',
  templateUrl: './filter-job-modal.component.html',
  styleUrls: ['./filter-job-modal.component.scss']
})
export class FilterJobModalComponent implements OnInit {

  @Input() jobFromDate: DateType;
  @Input() jobToDate: DateType;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  submitDateToHome() {
    this.activeModal.close({
      action: 'submit',
      data: {
        from: this.jobFromDate,
        to: this.jobToDate
      }
    });
  }
}
