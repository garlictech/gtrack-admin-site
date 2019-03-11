import { ErrorHandler } from '@angular/core';
import { environment } from 'environments/environment';
import * as Raven from 'raven-js';

if (environment.production) {
  Raven.config(environment.raven).install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);

    if (environment.production) {
      Raven.captureException(err);
    }
  }
}
