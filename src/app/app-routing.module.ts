import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'authentication-api-ngx';

import { HomeComponent } from './pages/home';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard],
    },
    /*{ path: '**', component: NotFoundPageComponent }*/
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
