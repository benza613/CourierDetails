import { Injectable } from "@angular/core";
import { DateType } from "../models/date-type.model";

@Injectable({
  providedIn: "root"
})
export class GlobalService {
  _courListData;
  _navFSFrame = true;

  _currentCourierId;

  private _details_FromDate: DateType;
  private _details_ToDate: DateType;

  private _jobfilter_FromDate: DateType;
  private _jobfilter_ToDate: DateType;

  private _jobfilter_Data: any = [];
  constructor() {}

  setGV_CourierData(val: any) {
    this._courListData = val;
  }

  setGV_AddCourRow(val: any) {
    this._courListData.oc_details.push(val);
  }

  getCourierDet(ocId: any) {
    this._currentCourierId = ocId;
    // tslint:disable-next-line:triple-equals
    return {
      rowData: this._courListData.oc_details.filter(x => x.ocId == ocId),
      oc_checklist: this._courListData.oc_checklist,
      oc_emplist: this._courListData.oc_emplist,
      oc_filesUploaded: this._courListData.oc_filesUploaded,
      oc_filesCoverLetter: this._courListData.oc_filesCoverLetter,
      oc_map_index_checklist: this._courListData.oc_map_index_checklist,
      oc_tallyJobs: this._courListData.oc_tallyJobs,
      oc_map_index_jobs: this._courListData.oc_map_index_jobs,
      oc_orglist: this._courListData.oc_orglist,
      ToLoc_org: this._courListData.ToLoc_org,
      FrmLoc: this._courListData.FrmLoc
    };
  }

  setDetailsRange_Initial(today: any) {
    this._details_FromDate = {
      year: today.year(),
      month: today.month(),
      day: today.date()
    };

    //add 1 since moment months are from 0-11
    this._details_ToDate = {
      year: today.year(),
      month: today.month() + 1,
      day: today.date()
    };

    this._jobfilter_FromDate = {
      year: today.year(),
      month: today.month(),
      day: today.date()
    };

    //add 1 since moment months are from 0-11
    this._jobfilter_ToDate = {
      year: today.year(),
      month: today.month() + 1,
      day: today.date()
    };

    console.log("Date Set");
  }

  getDetailsRange() {
    return {
      from: this._details_FromDate,
      to: this._details_ToDate
    };
  }

  getCurrentCourId() {
    if (      this._currentCourierId === undefined ||
      this._currentCourierId === null
    ) {
      return "";
    }
    
    return this._currentCourierId;
  }

  isNavDisabled() {
    return this._navFSFrame;
  }

  enableNav() {
    this._navFSFrame = false;
    return true;
  }

  disableNav() {
    this._navFSFrame = true;
    return true;
  }

  updateFromDate(newDate: any) {
    this._details_FromDate = {
      year: newDate.year,
      month: newDate.month,
      day: newDate.day
    };
  }

  updateToDate(newDate: any) {
    this._details_ToDate.year = newDate.year;
    this._details_ToDate.month = newDate.month;
    this._details_ToDate.day = newDate.day;
  }

  removeJobMapping(objJob) {
    let ix = this._courListData.oc_map_index_jobs.indexOf(objJob);
    this._courListData.oc_map_index_jobs.splice(ix, 1);
  }

  addJobMapping(objJob) {
    this._courListData.oc_map_index_jobs.push(objJob);
  }

  updateCourier_Checklist(objCl, resId, newStatus) {
    this._courListData.oc_map_index_checklist;

    //update
    if (resId == "1") {
      this._courListData.oc_map_index_checklist.forEach(x => {
        if (x.ocId == objCl.ocId && x.oclId == objCl.oclId) {
          x.oclStatus = newStatus;
        }
      });
    } else {
      //add new
      this._courListData.oc_map_index_checklist.push({
        ocId: objCl.ocId,
        oclId: objCl.oclId,
        oclStatus: newStatus
      });
    }

    return {
      oc_checklist: this._courListData.oc_checklist,
      oc_map_index_checklist: this._courListData.oc_map_index_checklist
    };
  }

  getJobFilterFrom() {
    return this._jobfilter_FromDate;
  }

  getJobFilterTo() {
    return this._jobfilter_ToDate;
  }

  setGV_FilterJobData(data, rangeData) {
    this._jobfilter_Data = data;

    this._jobfilter_FromDate = rangeData.from;
    this._jobfilter_ToDate = rangeData.to;
  }

  getFilteredJobData() {
    return this._jobfilter_Data;
  }

  getHtmlLinkPath(id) {
    if (id != null) {
    }
  }
}
