import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { EAuthRoles } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MarkerIconsResolver } from '@bit/garlictech.angular-features.common.marker-icons';

import { RouteRedirectGuard } from './auth';
import { LoginComponent } from './auth/components/login';
import { LayoutComponent } from './core/components/layout';
import { NotFound404Component } from './not-found404.component';
import { HikeEditComponent } from './pages/hike-edit';
import { HikeListComponent } from './pages/hike-list';

const fallbackRoute: Route = { path: '**', component: NotFound404Component };

// Trick for compodoc build
const roles = {
  enabledRoles: EAuthRoles.admin
};

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
        component: HikeEditComponent,
        resolve: { hike: MarkerIconsResolver }
      },
      {
        path: 'hike/:id',
        component: HikeEditComponent,
        resolve: { hike: MarkerIconsResolver }
      }
    ],
    // canActivate: [RouteRedirectGuard],
    data: { enabledRole: roles.enabledRoles }
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
