export class Deferred {
  public promise: Promise<any>;
  public resolve: Function;
  public reject: Function;

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
