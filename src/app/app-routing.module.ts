import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'subrepos/authentication-api-ngx';
import { PageNotFoundComponent } from './core/components/page-not-found';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import { HikeEditComponent } from './pages/hike-edit';
import { LayoutComponent } from './core/components/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/hikes',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {
        path: 'hikes',
        component: HikeListComponent
      },
      {
        path: 'hike/new',
        component: HikeEditComponent
      },
      {
        path: 'hike/:id',
        component: HikeEditComponent
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
