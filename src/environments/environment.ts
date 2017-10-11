import { Environment as prodenv } from './environment.prod';
import { Environment as devenv } from './environment.dev';

export const environment = new (process.env.ENV === 'production' ? prodenv : devenv)();
export * from './ienvironment';
