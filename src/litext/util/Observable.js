// @ts-nocheck
import Event from "./Event.js";

/**
 * Starts capture on the specified Observable. All events will be passed
 * to the supplied function with the event name + standard signature of the event
 * <b>before</b> the event is fired. If the supplied function returns false,
 * the event will not fire.
 * @param {Observable} o The Observable to capture
 * @param {Function} fn The function to call
 * @param {Object} scope (optional) The scope (this object) for the fn
 * @static
 */
export default class Observable {
  constructor(listeners) {
    this.events = {};
    this.eventsSuspended = false;
    this.methodEvents = {};
    // private
    this.filterOptRe = /^(?:scope|delay|buffer|single)$/;

    if (listeners) {
      this.on(listeners);
    }
  }

  /**
   * Fires the specified event with the passed parameters (minus the event name).
   * @param {String} eventName
   * @param {...Object} args Variable number of parameters are passed to handlers
   * @return {Boolean} returns false if any of the handlers return false otherwise it returns true
   */
  fireEvent(eventName, ...args) {
    if (this.eventsSuspended !== true) {
      const ce = this.events[eventName.toLowerCase()];
      if (ce && typeof ce === "object" && ce.fire) {
        return ce.fire(...args);
      }
    }
    return true;
  }

  /**
   * Appends an event handler to this component
   * @param {String} eventName The type of event to listen for
   * @param {Function} handler The method the event invokes
   * @param {Object} scope (optional) The scope in which to execute the handler
   * function. The handler function's "this" context.
   * @param {Object} options (optional) An object containing handler configuration
   * properties. This may contain any of the following properties:<ul>
   * <li><b>scope</b> : Object<p class="sub-desc">The scope in which to execute the handler function. The handler function's "this" context.</p></li>
   * <li><b>delay</b> : Number<p class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</p></li>
   * <li><b>single</b> : Boolean<p class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</p></li>
   * <li><b>buffer</b> : Number<p class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
   * by the specified number of milliseconds. If the event fires again within that time, the original
   * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</p></li>
   * </ul><br>
   * <p>
   * <b>Combining Options</b><br>
   * Using the options argument, it is possible to combine different types of listeners:<br>
   * <br>
   * A normalized, delayed, one-time listener that auto stops the event and passes a custom argument (forumId)
   * <pre><code>
el.on('click', this.onClick, this, {
  single: true,
  delay: 100,
  forumId: 4
});</code></pre>
   * <p>
   * <b>Attaching multiple handlers in 1 call</b><br>
    * The method also allows for a single argument to be passed which is a config object containing properties
   * which specify multiple handlers.
   * <p>
   * <pre><code>
foo.on({
  'click' : {
      fn: this.onClick,
      scope: this,
      delay: 100
  },
  'mouseover' : {
      fn: this.onMouseOver,
      scope: this
  },
  'mouseout' : {
      fn: this.onMouseOut,
      scope: this
  }
});</code></pre>
   * <p>
   * Or a shorthand syntax:<br>
   * <pre><code>
foo.on({
  'click' : this.onClick,
  'mouseover' : this.onMouseOver,
  'mouseout' : this.onMouseOut,
   scope: this
});</code></pre>
   */
  addListener(eventName, handler, scope, options) {
    if (typeof eventName === "object") {
      options = eventName;
      for (const e in options) {
        if (this.filterOptRe.test(e)) {
          continue;
        }
        if (typeof options[e] === "function") {
          this.addListener(e, options[e], options.scope, options);
        } else {
          this.addListener(e, options[e].fn, options[e].scope, options[e]);
        }
      }
      return;
    }

    options = options || {};
    eventName = eventName.toLowerCase();
    let ce = this.events[eventName];

    if (!ce || typeof ce === "boolean") {
      ce = new Event(this, eventName);
      this.events[eventName] = ce;
    }
    ce.addListener(handler, scope, options);
  }

  /**
   * Removes a listener
   * @param {String} eventName The type of event to listen for
   * @param {Function} handler The handler to remove
   * @param {Object} scope (optional) The scope (this object) for the handler
   */
  removeListener(eventName, handler, scope) {
    const ce = this.events[eventName.toLowerCase()];
    if (ce && typeof ce === "object") {
      ce.removeListener(handler, scope);
    }
  }

  /**
   * Removes all listeners for this object
   */
  purgeListeners() {
    for (const evt in this.events) {
      if (typeof this.events[evt] === "object") {
        this.events[evt].clearListeners();
      }
    }
  }

  relayEvents(o, events) {
    const createHandler =
      (ename) =>
      (...args) => {
        return this.fireEvent(ename, ...args);
      };

    events.forEach((ename) => {
      if (!this.events[ename]) {
        this.events[ename] = true;
      }
      o.on(ename, createHandler(ename), this);
    });
  }

  /**
   * Used to define events on this Observable
   * @param {Object} object The object with the events defined
   */
  addEvents(object) {
    if (!this.events) {
      this.events = {};
    }
    if (typeof object === "string") {
      for (const arg of arguments) {
        if (!this.events[arg]) {
          this.events[arg] = true;
        }
      }
    } else {
      Object.assign(this.events, object);
    }
  }

  /**
   * Checks to see if this object has any listeners for a specified event
   * @param {String} eventName The name of the event to check for
   * @return {Boolean} True if the event is being listened for, else false
   */
  hasListener(eventName) {
    const e = this.events[eventName];
    return typeof e === "object" && e.listeners.length > 0;
  }

  /**
   * Suspend the firing of all events. (see {@link #resumeEvents})
   */
  suspendEvents() {
    this.eventsSuspended = true;
  }

  /**
   * Resume firing events. (see {@link #suspendEvents})
   */
  resumeEvents() {
    this.eventsSuspended = false;
  }

  // these are considered experimental
  // allows for easier interceptor and sequences, including cancelling and overwriting the return value of the call
  // private
  getMethodEvent(method) {
    if (!this.methodEvents[method]) {
      const e = {
        originalFn: this[method],
        methodName: method,
        before: [],
        after: [],
      };

      let returnValue, v, cancel;
      const obj = this;

      const makeCall = (fn, scope, args) => {
        const result = fn.apply(scope || obj, args);
        if (result !== undefined) {
          if (typeof result === "object") {
            returnValue =
              result.returnValue !== undefined ? result.returnValue : result;
            cancel = result.cancel === true;
          } else if (result === false) {
            cancel = true;
          } else {
            returnValue = result;
          }
        }
      };

      this[method] = function (...args) {
        returnValue = v = undefined;
        cancel = false;

        for (const beforeFn of e.before) {
          // @ts-ignore
          makeCall(beforeFn.fn, beforeFn.scope, args);
          if (cancel) return returnValue;
        }

        const originalResult = e.originalFn.apply(obj, args);
        if (originalResult !== undefined) {
          returnValue = originalResult;
        }

        for (const afterFn of e.after) {
          // @ts-ignore
          makeCall(afterFn.fn, afterFn.scope, args);
          if (cancel) return returnValue;
        }

        return returnValue;
      };

      this.methodEvents[method] = e;
    }
    return this.methodEvents[method];
  }

  // adds an "interceptor" called before the original method
  beforeMethod(method, fn, scope) {
    const e = this.getMethodEvent(method);
    e.before.push({ fn, scope });
  }

  // adds a "sequence" called after the original method
  afterMethod(method, fn, scope) {
    const e = this.getMethodEvent(method);
    e.after.push({ fn, scope });
  }

  removeMethodListener(method, fn, scope) {
    const e = this.getMethodEvent(method);
    e.before = e.before.filter(
      (item) => !(item.fn === fn && item.scope === scope)
    );
    e.after = e.after.filter(
      (item) => !(item.fn === fn && item.scope === scope)
    );
  }

  /**
   * Appends an event handler to this element (shorthand for addListener)
   * @param {String} eventName The type of event to listen for
   * @param {Function} handler The method the event invokes
   * @param {Object} scope (optional) The scope in which to execute the handler
   * function. The handler function's "this" context.
   * @param {Object} options (optional)
   * @method
   */
  on(...args) {
    this.addListener(...args);
  }

  /**
   * Removes a listener (shorthand for removeListener)
   * @param {String} eventName The type of event to listen for
   * @param {Function} handler The handler to remove
   * @param {Object} scope (optional) The scope (this object) for the handler
   * @method
   */
  un(...args) {
    this.removeListener(...args);
  }

  /**
   * Starts capture on the specified Observable. All events will be passed
   * to the supplied function with the event name + standard signature of the event
   * <b>before</b> the event is fired. If the supplied function returns false,
   * the event will not fire.
   * @param {Observable} o The Observable to capture
   * @param {Function} fn The function to call
   * @param {Object} scope (optional) The scope (this object) for the fn
   * @static
   */
  static capture(o, fn, scope) {
    const originalFireEvent = o.fireEvent.bind(o);
    o.fireEvent = function (...args) {
      if (fn.apply(scope, args) === false) {
        return false;
      }
      return originalFireEvent(...args);
    };
  }

  /**
   * Removes <b>all</b> added captures from the Observable.
   * @param {Observable} o The Observable to release
   * @static
   */
  static releaseCapture(o) {
    o.fireEvent = Observable.prototype.fireEvent;
  }
}
