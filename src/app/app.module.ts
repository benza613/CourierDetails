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
    AgGridModule.withComponents([])
  ],
  providers: [GlobalService],
  entryComponents: [ButtonRendererComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
