import { Log, Level } from 'ng2-logger'

export const log = Log.create('@garlictech/gtrack-admin-site')
log.color = 'lightgreen'

export function DebugLog(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  return {
    value: function (...args: any[]) {
      // let a = args.map(aa => JSON.stringify(aa)).join();
      let result = descriptor.value.apply(this, args);
      log.d(`Call: ${target.constructor.name}.${key}`, {arguments: args});
      return result;
    }
  };
}
