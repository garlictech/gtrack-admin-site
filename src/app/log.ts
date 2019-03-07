import { Log } from 'ng2-logger';

export const log = Log.create('admin-site');
log.color = 'lightgreen';

// tslint:disable:only-arrow-functions no-invalid-this
export function DebugLog(target: object, key: string, descriptor: TypedPropertyDescriptor<any>): any {
  return {
    value(...args: Array<any>): any {
      const result = descriptor.value.apply(this, args);
      log.data(`Call: ${target.constructor.name}.${key}`, { arguments: args });

      return result;
    }
  };
}
