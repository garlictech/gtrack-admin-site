import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { NotFound404Component } from './not-found404.component';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import { HikeEditComponent } from './pages/hike-edit';
import { LayoutComponent } from './core/components/layout';
import { RouteRedirectGuard } from './auth/auth.guard';
import { EAuthRoles } from 'subrepos/provider-client';

const fallbackRoute: Route = { path: '**', component: NotFound404Component };

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
    canActivate: [RouteRedirectGuard],
    data: { enabledRole: EAuthRoles.admin }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LoginComponent
  },
  fallbackRoute
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
