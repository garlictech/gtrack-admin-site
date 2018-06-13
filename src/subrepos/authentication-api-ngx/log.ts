import { Log } from 'ng2-logger';

export const log = Log.create('@garlictech/authentication-api');
log.color = 'blue';

export function DebugLog(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    value: function(...args: any[]) {
      let result = descriptor.value.apply(this, args);
      log.d(`Call: ${target.constructor.name}.${key}`, { arguments: args });
      return result;
    }
  };
}
