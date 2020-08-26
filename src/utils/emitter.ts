// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/howdoi/eventemitter.md

import { IDictionary } from '../interfaces';
import { Subject } from 'rxjs';
import { isDefined, hasOwnProp } from './utils';

const createFuncName = (name: string): string => `$${name}`;

/**
 * @class Emitter
 * @example
    const emitter = new Emitter();

    let subscription_1 = emitter.listen('data', function (data: any) {
        console.log('subscription_1_data: ' + data);
    });
    let subscription_2 = emitter.listen('data', function (data: any) {
        console.log('subscription_2_data: ' + data);
    });

    emitter.emit('data', 'foo');
    // print subscription_1_data: foo, subscription_2_data: foo

    subscription_2.unsubscribe();
    emitter.emit('data', 'foo');
    // print subscription_1_data: foo
 */
class Emitter {
  protected subjects: IDictionary<any>;

  constructor() {
    this.subjects = {};
  }

  emit(name: string, data: any): Emitter {
    const fnName: string = createFuncName(name);

    if (!isDefined(this.subjects[fnName])) this.subjects[fnName] = new Subject();

    this.subjects[fnName].next(data);

    return this;
  }

  listen(name: string, handler: Function) {
    const fnName: string = createFuncName(name);

    if (!isDefined(this.subjects[fnName])) this.subjects[fnName] = new Subject();

    return this.subjects[fnName].subscribe(handler);
  }

  dispose(): Emitter {
    const subjects = this.subjects;

    for (const prop in subjects) {
      if (hasOwnProp.call(subjects, prop)) subjects[prop].unsubscribe();
    }

    this.subjects = {};

    return this;
  }
}

export default Emitter;
