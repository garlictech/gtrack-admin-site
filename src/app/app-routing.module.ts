import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication-api-ngx';
import { HomeComponent } from './pages/home';
import { LayoutComponent } from './core/components/layout';
import { PageNotFoundComponent } from './core/components/page-not-found';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import { HikeEditComponent } from './pages/hike-edit';

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
        path: 'hike/add',
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

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
