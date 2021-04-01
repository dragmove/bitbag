import { IArrayLike, IDictionary, IAddEventListenerOption, IRemoveEventListenerOption, IStorage } from '../interfaces';
import { tap, map, filter, timeInterval, switchMap, first, mergeMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { fromEvent, of, forkJoin } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/*
 * threads
 */
export function pause(milliseconds: number): void {
  const start: number = Date.now();
  while (Date.now() - start < milliseconds) {}
}

/*
 * base
 */
export const hasOwnProp = Object.prototype.hasOwnProperty;
const _slice = Array.prototype.slice;

export const curry2 = (func: Function): Function => (firstArg: any): Function => (secondArg: any): any =>
  func(firstArg, secondArg);

export const not = (func: Function): Function => {
  return function () {
    return !func.apply(null, arguments);
  };
};

export const eq = curry2((lhs: any, rhs: any): boolean => lhs === rhs);
export const gt = curry2((lhs: number, rhs: number): boolean => lhs < rhs);
export const lt = curry2((lhs: number, rhs: number): boolean => lhs > rhs);

export function isDefined(val: any): boolean {
  if (val === null || typeof val === 'undefined') return false;
  return true;
}

export function isObject(val: any): boolean {
  if (!isDefined(val)) return false;

  return val.constructor === Object;
}

export function isInteger(val: number): boolean {
  // Refer: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  return isFinite(val) && Math.floor(val) === val;
}

export function isError(val: any, errorType?: any) {
  if (!isDefined(val)) return false;

  const con = val.constructor;

  if (!isDefined(errorType)) {
    return (
      con === Error ||
      con === EvalError ||
      con === RangeError ||
      con === ReferenceError ||
      con === SyntaxError ||
      con === TypeError ||
      con === URIError
    );
  }

  return con === errorType;
}

export function toArray<T>(iterable: IArrayLike<T>): T[] {
  return _slice.call(iterable);
}

/*
 * global
 */
export function getGlobal(): any | never {
  if (isDefined(globalThis)) return globalThis;

  // Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
  if (isDefined(self)) return self;
  if (isDefined(window)) return window;
  if (isDefined(global)) return global;

  throw Error('[bitbag] getGlobal: unable to locate global object');
}

/*
 * log
 */
export const log = (any: any) => console.log(any);

/*
 * event
 */
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
export function addListener(
  ele: HTMLElement | null = null,
  type = '',
  listener: (evt: Event) => void,
  options: IAddEventListenerOption = { capture: false, once: false, passive: false }
) {
  if (ele) ele.addEventListener(type, listener, options);
}

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
export function removeListener(
  ele: HTMLElement | null = null,
  type = '',
  listener: (evt: Event) => void,
  options: IRemoveEventListenerOption = { capture: false }
) {
  if (ele) ele.removeEventListener(type, listener, options);
}

/*
 * number
 */
// TODO:

/*
 * array
 */
export function has<T>(arr: T[], val: T): boolean {
  return arr.includes(val);
}

/*
 * string
 */
export const getUrlCombinedParams = (url: string, parameters?: IDictionary<string | number>): string => {
  if (!url) return '';
  if (!parameters) return url;

  let str: string = '';
  for (let key in parameters) {
    if (hasOwnProp.call(parameters, key)) str += '&' + key + '=' + String(parameters[key]);
  }

  if (str === '') return url;

  var tmpArr = url.split('#'),
    hashStr = isDefined(tmpArr[1]) && tmpArr[1].length ? '#' + tmpArr[1] : '';

  url = tmpArr[0];
  url = (url.indexOf('?') >= 0 ? url + str : url + '?' + str.substr(1)) + hashStr;

  return url;
};

export const toPrice = (str: string): string => str.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

export const removeWhitespace = (str = '', isRemoveEscapeSequence = false): string => {
  // escape sequence is string like \n, \r, \t, ...
  // https://msdn.microsoft.com/en-us/library/h21280bw.aspx

  return isRemoveEscapeSequence ? str.replace(/\s/g, '') : str.replace(/ /g, '');
};

export const escapeHtml = (str: string): string => {
  // Refer: https://github.com/lodash/lodash/blob/master/escape.js

  const htmlEscapes: IDictionary<string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  const regexUnescapedHtml = /[&<>"']/g;
  const regexHasUnescapedHtml = RegExp(regexUnescapedHtml.source);

  return regexHasUnescapedHtml.test(str) ? str.replace(regexUnescapedHtml, (char: string) => htmlEscapes[char]) : str;
};

export const unescapeHtml = (str: string): string => {
  // Refer: https://github.com/lodash/lodash/blob/master/unescape.js
  // Note: No other HTML entities are unescaped. To unescape additional HTML entities use a third-party library like [_he_](https://mths.be/he).
  const htmlUnescapes: IDictionary<string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  const regexEscapedHtml = /&(?:amp|lt|gt|quot|#(0+)?39);/g;
  const regexHasEscapedHtml = RegExp(regexEscapedHtml.source);

  return regexHasEscapedHtml.test(str)
    ? str.replace(regexEscapedHtml, (entity: string) => htmlUnescapes[entity] || "'")
    : str;
};

export const getFacebookShareUrl = (encodedUrl: string): string => {
  // when 'share on facebook' button is clicked, call window.open(share url, window name, window features).
  // e.g: window.open(getFacebookShareUrl(window.encodeURIComponent('https://www.google.com/')), 'windowName');
  return `https://www.facebook.com/share.php?u=${encodedUrl}`;
};

// when 'share on twitter' button is clicked.
// e.g: https://twitter.com/intent/tweet?text=Hello%20World&url=https%3A%2F%2Fwww.google.com%2F&hashtags=test,share&via=firstborn_nyc&related=code%3Arecommendation_title_1,jetbrains%3Arecommendation_title_2
export const getTwitterShareUrl = (
  queryParams: IDictionary<string | number> = {
    // Pre-populated UTF-8 and URL-encoded Tweet text. The passed text will appear pre-selected for a Twitter user to delete or edit before posting. The length of your passed Tweet text should not exceed 280 characters when combined with any passed hashtags, via, or url parameters. Passed Tweet text which causes the Tweet to exceed 280 characters in length will require additional editing by a Twitter user before he or she can successfully post.
    // e.g: window.encodeURIComponent('Hello World')
    text: '',

    // A fully-qualified URL with a HTTP or HTTPS scheme, URL-encoded. The provided URL will be shortened by Twitter’s t.co to the number of characters specified by short_url_length.
    // e.g: window.encodeURIComponent('https://www.google.com/')
    url: '',

    // Allow easy discovery of Tweets by topic by including a comma-separated list of hashtag values without the preceding # character.
    // e.g: 'test,share'
    hashtags: '',

    // A Twitter username to associate with the Tweet, such as your site’s Twitter account. The provided username will be appended to the end of the Tweet with the text “via @username”. A logged-out Twitter user will be encouraged to sign-in or join Twitter to engage with the via account’s Tweets. The account may be suggested as an account to follow after the user posts a Tweet.
    // e.g: 'firstborn_nyc'
    via: '',

    // Suggest additional Twitter usernames related to the Tweet as comma-separated values. Twitter may suggest these accounts to follow after the user posts their Tweet. You may provide a brief description of how the account relates to the Tweet with a URL-encoded comma and text after the username.
    // e.g: window.encodeURIComponent('code:recommendation_title_1,jetbrains:recommendation_title_2')
    related: '',

    // The Tweet ID of a parent Tweet in a conversation, such as the initial Tweet from your site or author account.
    // e.g: 525001166233403393
    in_reply_to: -1,
  }
): string => {
  // Refer: https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
  return getUrlCombinedParams('https://twitter.com/intent/tweet', queryParams);
};

export const getLineShareUrl = (url: string): string => {
  // Refer: https://social-plugins.line.me/en/how_to_install#lineitbutton
  // e.g: https://social-plugins.line.me/lineit/share?url=https%3A%2F%2Fwww.google.com%2F
  return `https://social-plugins.line.me/lineit/share?url=${url}`;
};

export const getNaverShareUrl = (
  queryParams: IDictionary<string> = {
    url: '', // e.g: window.encodeURIComponent('https://www.google.com/')
    title: '', // e.g: window.encodeURIComponent('Hello World')
  }
): string => {
  // Refer: https://developers.naver.com/docs/share/navershare/
  return getUrlCombinedParams('https://share.naver.com/web/shareView.nhn', queryParams);
};

// TODO: KakaoTalk share url

/*
 * object
 */
export const hasKey = (obj: IDictionary<string> = {}, key: string = ''): boolean => obj.hasOwnProperty(key);

/*
 * math
 */
export const isPositive = (number: number): boolean => gt(0)(number);

export const isNegative = (number: number): boolean => lt(0)(number);

export const clamp = (number: number, min: number, max: number): number => Math.max(Math.min(number, max), min);

/*
 * with browser
 */
export const alert = (message: string | object): void => window.alert(message);

export const useConfirm = (message: string = '', okCallback: Function, cancelCallback?: Function) => {
  const _confirmFunc = () => {
    if (window.confirm(message)) {
      okCallback.call(null);
    } else {
      if (cancelCallback) cancelCallback.call(null);
    }
  };

  return _confirmFunc;
};

export const isSupportServiceWorker: boolean = 'serviceWorker' in navigator;

export const isSupportTouch: boolean = 'ontouchstart' in window;

export function isPortrait(): boolean {
  // Refer: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
  if ('matchMedia' in window) return window.matchMedia('(orientation: portrait)').matches;
  if ('orientation' in window) return eq(window.orientation)(0) || eq(window.orientation)(180);
  return false;
}

export function isLandscape(): boolean {
  // Refer: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
  if ('matchMedia' in window) return window.matchMedia('(orientation: landscape)').matches;
  if ('orientation' in window) return eq(window.orientation)(-90) || eq(window.orientation)(90);
  return false;
}

// https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
export const mqlPortrait = window.matchMedia('(orientation: portrait)');

// https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
export const mqlLandscape = window.matchMedia('(orientation: landscape)');

// sessionStorage
export const storageSession: IStorage = {
  set: (key: string, obj: object): void => {
    const str = isObject(obj) ? JSON.stringify(obj) : String(obj);
    window.sessionStorage.setItem(key, str);
  },

  get: (key: string): object | string | null => {
    const str: string | null = window.sessionStorage.getItem(key);

    if (typeof str === 'string') {
      try {
        return JSON.parse(str);
      } catch (error) {
        return str;
      }
    }

    return str;
  },

  remove: (key: string): void => {
    window.sessionStorage.removeItem(key);
  },

  clear: (): void => {
    window.sessionStorage.clear();
  },
};

// localStorage
export const storageLocal: IStorage = {
  set: (key: string, obj: object): void => {
    const str = isObject(obj) ? JSON.stringify(obj) : String(obj);
    window.localStorage.setItem(key, str);
  },

  get: (key: string): object | string | null => {
    const str = window.localStorage.getItem(key);

    if (typeof str === 'string') {
      try {
        return JSON.parse(str);
      } catch (error) {
        return str;
      }
    }

    return str;
  },

  remove: (key: string): void => {
    window.localStorage.removeItem(key);
  },

  clear: (): void => {
    window.localStorage.clear();
  },
};

/*
 * DOM
 */
export const isElement = (ele: HTMLElement): boolean => {
  return isDefined(ele) && typeof ele === 'object' && ele.nodeType === 1 && ele instanceof Node;
};

export const el = (selectors: string): HTMLElement | null => document.querySelector(selectors);

export function els(selectors: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(selectors);
}

export function getClassList(ele: HTMLElement): string[] {
  return ele.classList ? toArray<string>(ele.classList) : ele.className.split(' ');
}

export function hasClass(ele: HTMLElement, className: string): boolean {
  return ele.classList ? ele.classList.contains(className) : ele.className.split(' ').indexOf(className) >= 0;
}

export function addClass(ele: HTMLElement, className: string): void {
  // Refer: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
  if (ele.classList) {
    ele.classList.add(className);
  } else {
    if (!hasClass(ele, className)) ele.className = `${ele.className} ${className}`.replace(/\s{2,}/g, ' ');
  }
}

export function removeClass(ele: HTMLElement, className: string): void {
  // Refer: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
  if (ele.classList) {
    ele.classList.remove(className);
  } else {
    if (!hasClass(ele, className)) {
      const classes = ele.className.split(' '),
        classIndex = classes.indexOf(className);
      if (classIndex >= 0) classes.splice(classIndex, 1);

      ele.className = classes.join(' ').replace(/\s{2,}/g, ' ');
    }
  }
}

export function getRequestAnimationFrame(): Function {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
}

export function getCancelAnimationFrame(): Function {
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
}

export function getPrefixedTransform(): string {
  if (!isDefined(document)) return '';

  const headStyle: CSSStyleDeclaration = (document.head || document.getElementsByTagName('head')[0]).style;
  const transforms: string[] = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform'];
  for (let i = 0, max = transforms.length; i < max; i++) {
    if (transforms[i] in headStyle) return transforms[i];
  }

  return '';
}

/*
 * with RxJS
 */
export const TOUCH_MOUSE_EVENT: { start: string; move: string; end: string } = {
  start: isSupportTouch ? 'touchstart' : 'mousedown',
  move: isSupportTouch ? 'touchmove' : 'mousemove',
  end: isSupportTouch ? 'touchend' : 'mouseup',
};

export const hashChange$ = fromEvent(window, 'hashchange');

export const ajax$ = (option = {}) => {
  // https://rxjs-dev.firebaseapp.com/api/ajax/AjaxRequest
  /*
  url?: string
  body?: any
  user?: string
  async?: boolean
  method?: string
  headers?: Object
  timeout?: number
  password?: string
  hasContent?: boolean
  crossDomain?: boolean
  withCredentials?: boolean
  createXHR?: () => XMLHttpRequest
  progressSubscriber?: Subscriber<any>
  responseType?: string
  */

  return ajax(option).pipe(
    catchError((err: Error) => {
      let error: any = new Error('[ajax$] Error');
      error.error = err;

      return of(error);
    })
  );
};

export const callAPI$ = (option = {}) => ajax$(option);

export const callAPIs$ = (requestOptions: {}[] = []) => {
  return of(requestOptions).pipe(mergeMap((options) => forkJoin(...options.map((option) => callAPI$(option)))));
};

export const preventDefaultOperator = (observable$: any) => {
  return observable$.pipe(
    map((evt: Event) => {
      evt.preventDefault();

      return evt;
    })
  );
};

export const stopPropagationOperator = (observable$: any) => {
  return observable$.pipe(
    map((evt: Event) => {
      evt.stopPropagation();

      return evt;
    })
  );
};

export const touchMousePositionOperator = (observable$: any) => {
  return observable$.pipe(
    map((evt: MouseEvent | TouchEvent) => {
      let event, obj;

      if (isSupportTouch) {
        event = evt as TouchEvent;
        obj = {
          event,
          x: event.changedTouches[0].pageX,
          y: event.changedTouches[0].pageY,
          timeStamp: event.timeStamp,
        };
      } else {
        event = evt as MouseEvent;
        obj = {
          event,
          x: event.pageX,
          y: event.pageY,
          timeStamp: evt.timeStamp,
        };
      }

      return obj;
    })
  );
};

// mouse click event
export const getClick$ = (ele: HTMLElement | Document) => {
  return fromEvent(ele, 'click');
};

// mouse N click (one, double, triple, ...) event
export const getNClick$ = ({
  ele,
  clickNum = 1,
  limitTime = Number.MAX_VALUE,
}: {
  ele: HTMLElement | Document;
  clickNum?: number;
  limitTime?: number;
}) => {
  if (!isInteger(clickNum) || clickNum <= 0)
    throw new TypeError('[getNClick$] clickNum parameter type must be Integer. (bigger than 0)');

  if (limitTime <= 0) throw new TypeError('[getNClick$] limitTime parameter must be bigger than 0.');

  if (eq(clickNum)(1)) return getClick$(ele);

  let _intervals: number[] = [];

  return getClick$(ele).pipe(
    timeInterval(),
    tap((obj) => _intervals.push(obj.interval)),
    map((obj) => {
      const lastIntervals = _intervals.slice(-(clickNum - 1));
      if (_intervals.length < clickNum) return null;

      const sum = lastIntervals.reduce((acc, cur) => acc + cur);
      if (sum <= limitTime) return obj.value;

      return null;
    }),
    filter((event) => event !== null),
    tap(() => (_intervals = []))
  );
};

// mousedown, mouseup / touchstart, touchend event
// TODO: Specify any types
export const getStart$ = (ele: HTMLElement | Document, operators: any[] = []) => {
  let observable = fromEvent(ele, TOUCH_MOUSE_EVENT.start);
  operators.map((operator) => (observable = observable.pipe(operator)));

  return observable;
};

// TODO: Specify any types
export const getEnd$ = (ele: HTMLElement | Document, operators: any[] = []) => {
  let observable = fromEvent(ele, TOUCH_MOUSE_EVENT.end);
  operators.map((operator) => (observable = observable.pipe(operator)));

  return observable;
};

// TODO: Specify any types
export const getTapClick$ = (start$: any, end$: any) => {
  return start$.pipe(
    switchMap((startPos: { event: Event; x: number; y: number; timeStamp: number }) =>
      end$.pipe(
        map((endPos: { event: Event; x: number; y: number; timeStamp: number }) => {
          return {
            startEvent: startPos.event,
            endEvent: endPos.event,
            x: endPos.x - startPos.x,
            y: endPos.y - startPos.y,
            elapsedTime: endPos.timeStamp - startPos.timeStamp,
          };
        }),
        first()
      )
    )
  );
};

export const snakeToCamel = (str: string, includeDash: boolean = true) => {
  // FIXME: ing
  if (includeDash) {
    // _ 도 포함하여 변경
  } else {
    // _ 만 변경
  }

  /*
  // Ref: https://hisk.io/javascript-snake-to-camel/ 참고
  const snakeToCamel = (str) => str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
                    .replace('-', '')
                    .replace('_', '')
  );
  */
};

// TODO: so-dirty 의 코드를 옮기는 중.
