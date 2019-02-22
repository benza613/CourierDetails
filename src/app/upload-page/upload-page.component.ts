import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent implements OnInit {

  fileServerUrl;
  c_id;
  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit() {
    //http://localhost:3001/OtwlFileServer/Explorer.aspx?dirname={{dirName}}&dirtype=2&mfttype=2

    this.c_id = this.route.snapshot.paramMap.get('id');

    if (this.c_id != null) {
      let url = "http://localhost:3001/OtwlFileServer/Explorer.aspx?dirname=OffCourier_" + this.c_id + "&dirtype=6&mfttype=23&refID=" + this.c_id;
      this.fileServerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

}
