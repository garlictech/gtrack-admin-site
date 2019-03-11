export class Deferred {
  promise: Promise<any>;
  resolve: (data: any) => void;
  reject: (err: Error) => void;

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
