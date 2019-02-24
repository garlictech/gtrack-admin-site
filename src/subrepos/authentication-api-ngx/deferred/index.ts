export class Deferred {
  promise: Promise<any>;
  resolve: Function;
  reject: Function;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (data: any) => {
        resolve(data);
      };

      this.reject = (err: Error) => {
        reject(err);
      };
    });
  }
}
