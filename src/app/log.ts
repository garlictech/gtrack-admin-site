import { Log } from 'ng2-logger';

export const log = Log.create('admin-site');
log.color = 'lightgreen';

export function DebugLog(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    value: function(...args: any[]) {
      const result = descriptor.value.apply(this, args);
      log.d(`Call: ${target.constructor.name}.${key}`, { arguments: args });
      return result;
    }
  };
}
