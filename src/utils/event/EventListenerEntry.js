/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Event Listener Entry.
 */

/**
 * Represents a single listener for a specific target.
 */
export class EventListenerEntry {
  /**
   * @param {!Window|HTMLElement|string} target
   * @param {string} type
   * @param {function(?):?|{handleEvent:function(?):?}} listener
   * @param {Object} options
   * @param {string} prefix
   */
  constructor(target, type, listener, options, prefix = '') {
    /**  @type {!Window|HTMLElement|null} */
    this.target = null;

    /** @type {string} */
    this.type = type;

    /** @type {function(?):?|{handleEvent:function(?):?}} */
    this.listener = listener;

    /** @type {Object} */
    this.options = options;

    // Try to get target element if target is a string.
    if (typeof target === 'string' || target instanceof String) {
      this.target = document.getElementById(prefix + target);
      if (!this.target) {
        throw new Error(`Unable to find element ${prefix}${target}!`);
      }
    } else {
      this.target = target;
    }

    // Verify target and listener.
    if (!this.target) {
      throw new Error(`Undefined event target: ${this.target}!`);
    }
    if (typeof listener !== 'function') {
      throw new Error(`Listener is not a function: ${listener}!`);
    }
  }
}
