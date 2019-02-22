import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  _courListData;
  _navFSFrame = true;

  _currentCourierId;

  constructor() {



  }

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
      rowData: this._courListData.oc_details.filter((x) => x.ocId == ocId),
      oc_checklist: this._courListData.oc_checklist,
      oc_emplist: this._courListData.oc_emplist,
      oc_filesUploaded: this._courListData.oc_filesUploaded,
      oc_filesCoverLetter: this._courListData.oc_filesCoverLetter,
      oc_map_index_checklist: this._courListData.oc_map_index_checklist
    }
  }

  getCurrentCourId() {
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

}
