import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  _courListData;


  constructor() {



  }

  setGV_CourierData(val: any) {
    this._courListData = val;
  }

  getCourierDet(ocId: any) {
    // tslint:disable-next-line:triple-equals
    return {
      rowData: this._courListData.oc_details.filter((x) => x.ocId == ocId),
      arrChekLst: this._courListData.oc_checklist
    }
  }

}
