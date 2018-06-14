/* tslint:disable no-console */
/* tslint:disable no-var-requires */
const compression = require('compression');
import 'zone.js/dist/zone-node';
import './polyfills.server';
import './rxjs.imports';
import * as express from 'express';
import * as path from 'path';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModule } from './app/server.app.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { routes } from './server.routes';
import { enableProdMode } from '@angular/core';
import { UNIVERSAL_PORT } from '../constants';
enableProdMode();
const app = express();
const baseUrl = `http://localhost:${UNIVERSAL_PORT}`;

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: ServerAppModule
  })
);

app.set('view engine', 'html');
app.set('views', 'src');

app.use(compression());
app.use('/', express.static('/app/artifacts/dist', { index: false }));
app.use('/assets', express.static('/app/artifacts/dist/assets', { maxAge: 30 }));

routes.forEach(route => {
  app.get('/' + route, (req, res) => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('/app/artifacts/dist/index', {
      req: req,
      res: res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
  });
});

app.listen(UNIVERSAL_PORT, () => {
  console.log(`Listening at ${baseUrl}`);
});
/* tslint:enable no-console */
/* tslint:enable no-var-requires */
