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
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter } from './validators/dateformat';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailFormComponent,
    ButtonRendererComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [GlobalService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  entryComponents: [ButtonRendererComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
