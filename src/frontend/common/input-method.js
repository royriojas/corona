/**
 * input-method
 *
 * ```
 * [data-input="keyboard"] {
 *   button:focus {
 *     background: #eee;
 *   }
 * }
 * ```
 */
import { observable, autorun, action } from 'mobx';
import debounce from 'debouncy';
import { doc } from './globals';

const { body } = doc;
// create an observable to keep track of the last input method
const state = observable({ lastInputMethod: 'mouse' });

const THRESHOLD_TO_SET_INPUT_METHOD = 16;

// set the value of lastInputMethod
const handler = debounce(
  action(e => {
    const eventType = e.type === 'keydown';
    state.lastInputMethod = eventType ? 'keyboard' : 'mouse';
  }),
  THRESHOLD_TO_SET_INPUT_METHOD,
);

// if lastInputMethod changes change the attibute in the body element
// autorun is only executed when the value changes so setting lastInputMethod
// to the same value won't cause the DOM to be modified
autorun(() => body.setAttribute('data-input', state.lastInputMethod));

// listen to keydown and mousedown using capture to make sure that
// we always get the event even when something might interfere with it
doc.addEventListener('keydown', handler, true);
doc.addEventListener('mousedown', handler, true);
