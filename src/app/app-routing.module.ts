import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'CD.aspx', component: HomeComponent,
  },
  {
    path: 'CD.aspx/details/:id',
    component: DetailFormComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'CD.aspx/details',
    redirectTo: '/CD.aspx',
    pathMatch: 'full',
    canActivate: [AuthGuard],

  },
  {
    path: '',
    redirectTo: '/CD.aspx',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/CD.aspx' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
