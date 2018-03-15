import { Log, Level } from 'ng2-logger';
export const log = Log.create('@garlictech/deepstream-ngx');
log.color = 'green';

export function DebugLog(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    value: function(...args: any[]) {
      let result = descriptor.value.apply(this, args);
      log.d(`Call: ${target.constructor.name}.${key}`, { arguments: args });
      return result;
    }
  };
}
