// Ref: https://www.typescriptlang.org/docs/handbook/decorators.html
// TODO: Read https://medium.com/swlh/typescript-decorators-in-examples-c3afcd3c7ff8

// property decorators
// function propertyDecorator(...args: any[]): PropertyDecorator {
//   return function (target: Object, propertyKey: string | symbol): void {
//     //
//   };
// }

// method decorators
export function readonly(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any {
  descriptor.writable = false;
  return descriptor;
}

export function perf(title: string, enable = true): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    if (enable === false) return descriptor;

    const fn = descriptor.value;
    if (typeof fn === 'function') {
      descriptor.value = function (...args: any[]) {
        const start = performance.now();

        try {
          const result = fn.apply(this, args);
          return result;
        } catch (e) {
          console.error('e :', e);
          throw e;
        } finally {
          const end = performance.now();
          console.log(`[${title}]: ${end - start} ms`);
        }
      };
    }

    return descriptor;
  };
}
