import { Environment as stagingenv } from './environment.staging';
import { Environment as masterenv } from './environment.master';
import { Environment as devenv } from './environment.dev';

export const environment = new (process.env.ENV === 'production'
  ? process.env.BRANCH === 'master'
    ? masterenv
    : stagingenv
  : devenv)();

export * from './ienvironment';
