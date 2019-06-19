import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonRendererComponent } from './renderer/button-renderer/button-renderer.component';
import { GlobalService } from './shared/global.service';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter } from './validators/dateformat';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { TallyJobModalComponent } from './shared/tally-job-modal/tally-job-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterJobModalComponent } from './shared/filter-job-modal/filter-job-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailFormComponent,
    ButtonRendererComponent,
    UploadPageComponent,
    TallyJobModalComponent,
    FilterJobModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [GlobalService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  entryComponents: [ButtonRendererComponent, TallyJobModalComponent, FilterJobModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
