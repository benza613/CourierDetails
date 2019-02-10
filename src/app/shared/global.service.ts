import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  myGlobalVar;


  constructor() {



  }

  setMyGV(val: any) {
    this.myGlobalVar = val;
  }

  getMyGV(ocId: any) {
    // tslint:disable-next-line:triple-equals
    return this.myGlobalVar.filter((x) => x.ocId == ocId);
  }
}
