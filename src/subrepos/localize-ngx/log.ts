import { Log, Level } from 'ng2-logger';
import { Logger } from 'ng2-logger/src/logger';

export const log = Log.create('localize');
log.color = '#06a2f6';

export function DebugLog(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    value: function(...args: any[]) {
      let result = descriptor.value.apply(this, args);
      log.d(`Call: ${target.constructor.name}.${key}`, { arguments: args });
      return result;
    }
  };
}
