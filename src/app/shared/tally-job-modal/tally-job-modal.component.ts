import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tally-job-modal',
  templateUrl: './tally-job-modal.component.html',
  styleUrls: ['./tally-job-modal.component.scss']
})
export class TallyJobModalComponent implements OnInit {
  @Input() courId: number;
  @Input() tallyJobList: any;

  selectedTallyJob: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  submitJobList() {
    if (this.selectedTallyJob != undefined) {
      this.activeModal.close({
        action: 'submit',
        data: this.selectedTallyJob
      });
    } else {
      alert('Minimum 1 Job Selection Required');
    }
  }
}
