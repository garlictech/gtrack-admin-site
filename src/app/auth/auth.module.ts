import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LoginComponent } from './components/login';

const COMPONENTS = [LoginComponent];

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    // PrimeNG
    ButtonModule,
    CardModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class AuthModule {}
