// import './img/favicon.ico';
// import './styles/card-ui.scss';

import {
  isError,
  log,
  addListener,
  removeListener,
  has,
  getUrlCombinedParams,
  toPrice,
  removeWhitespace,
  escapeHtml,
  unescapeHtml,
  getFacebookShareUrl,
  getTwitterShareUrl,
  getLineShareUrl,
  getNaverShareUrl,
  hasKey,
  gt,
  lt,
  isPositive,
  isNegative,
  touchMousePositionOperator,
  getStart$,
  getEnd$,
  getNClick$,
  getTapClick$,
  callAPIs$,
} from './utils/utils';
import { finalize } from 'rxjs/operators';

import Emitter from './utils/emitter';
import { Subscription } from 'rxjs';

(() => {
  'use strict';

  function init() {
    // TODO: callAPI$, of 등의 so-dirty 테스트 example 옮길 것.

    // getAPIs$ : call multiple cancellable APIs
    let subscribeCallAPIs: Subscription | null = callAPIs$([
      {
        url: 'https://agile-oasis-5771.herokuapp.com/data/awards',
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
        },
        timeout: 10000,
        responseType: 'json',
      },
      {
        url: 'https://dragmove.github.io/dragmove.com/data/services.json',
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
        },
        timeout: 10000,
        responseType: 'json',
      },
    ])
      .pipe(
        finalize(() => {
          console.log('[subscribeCallAPIs] finalize');
        })
      )
      .subscribe((datas) => {
        const errors = datas.filter((data: any) => isError(data));
        if (errors.length) {
          console.log('[subscribeCallAPIs] rejected :', datas);
          return;
        }

        console.log('[subscribeCallAPIs] resolved :', datas);
      });

    // cancel subscribeCallAPIs
    /*
    console.log('subscribeCallAPIs :', subscribeCallAPIs);
    if (subscribeCallAPIs) {
      subscribeCallAPIs.unsubscribe();
      subscribeCallAPIs = null;
    }
    */

    /*
    // Emitter
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

    /*
     * event
     */
    /*
    const nClick$ = getNClick$({
      ele: document,
      clickNum: 2,
      limitTime: 250,
    });

    const subscribeNClick = nClick$.subscribe((evt) => {
      console.log('nClick$ :', evt);
    });

    const limitElapsedTimeTapClick = 350, // 0.35 sec
      limitRadiusTapClick = 5; // 5 px

    const touchMouseStart$ = getStart$(document, [touchMousePositionOperator]),
      touchMouseEnd$ = getEnd$(document, [touchMousePositionOperator]),
      tapClick$ = getTapClick$(touchMouseStart$, touchMouseEnd$);

    const subscribeTouchMouseStart = touchMouseStart$.subscribe((obj) => {
      // {event, x, y, timeStamp }
      console.log('touchstart / mousedown action :', obj);
    });

    const subscribeTouchMouseEnd = touchMouseEnd$.subscribe((obj) => {
      // {event, x, y, timeStamp }
      console.log('touchend / mouseup action :', obj);
    });

    const subscribeTapClick = tapClick$.subscribe(
      (obj: { startEvent: Event; endEvent: Event; x: number; y: number; elapsedTime: number }) => {
        // {startEvent, endEvent, x, y, elapsedTime }

        if (obj.elapsedTime > limitElapsedTimeTapClick) {
          console.log('subscribeTapClick: This interaction is longer than a click or tap action.');
          return;
        }

        if (Math.abs(obj.x) > limitRadiusTapClick || Math.abs(obj.y) > limitRadiusTapClick) {
          console.log('subscribeTapClick: This interaction is close to drag or swipe action.');
          return;
        }

        console.log('subscribeTapClick: This interaction is a click or tap action.');
      }
    );
    */

    const btnEventListener = (evt: Event) => {
      evt.preventDefault();

      window.alert('foo');

      // window.open(getFacebookShareUrl(window.encodeURIComponent('https://www.google.com/')), 'windowName');

      /*
      window.open(
        getTwitterShareUrl({
          text: window.encodeURIComponent('Hello World'),
          url: window.encodeURIComponent('https://www.google.com/'),
          hashtags: 'test,share',
          via: 'firstborn_nyc',
          related: window.encodeURIComponent('code:recommendation_title_1,jetbrains:recommendation_title_2'),
          in_reply_to: -1,
        })
      );
      */

      // window.open(getLineShareUrl(window.encodeURIComponent('https://www.google.com/')));

      /*
      window.open(
        getNaverShareUrl({
          url: window.encodeURIComponent('https://www.google.com/'),
          title: window.encodeURIComponent('Hello World'),
        })
      );
      */
    };

    const testBtn: HTMLElement | null = document.querySelector('.btn-test');
    addListener(testBtn, 'click', btnEventListener);
    // removeListener(testBtn, 'click', btnEventListener);

    /*
     * number
     */
    // TODO:

    /*
     * array
     */
    const stringArr: string[] = ['foo', 'bar', 'baz'];
    log(has<string>(stringArr, 'foo'));

    const numberArr: number[] = [1, 2, 3];
    log(has<number>(numberArr, 9));

    /*
     * string
     */
    // getUrlCombinedParams // {name: 'foo', age: '99', address: 'seoul'}
    console.log(getUrlCombinedParams('http://www.google.com', { name: 'foo', age: '99', address: 'seoul' }));

    // toPrice
    log(toPrice('10000000'));

    // removeWhitespace
    log(removeWhitespace('     ok     '));
    log(removeWhitespace('\nok\r,     foo     ', true));
    log(
      removeWhitespace(
        `
    hello,
    
    foo.
    `,
        true
      )
    );

    // escapeHtml
    const escapedStr = escapeHtml('<p>foo</p>');
    log(escapedStr);

    // unescapeHtml
    const unescapedStr = unescapeHtml('&lt;p&gt;foo&lt;/p&gt;');
    log(unescapedStr);

    /*
     * object
     */
    log(
      hasKey(
        {
          name: 'foo',
        },
        'name'
      )
    );

    /*
     * math
     */
    log(isPositive(9)); // true
    log(isPositive(-9)); // false
    log(isNegative(-9)); // true
    log(isNegative(9)); // false
  }

  init();
})();
