// @ts-nocheck

/**
 * Class representing an event.
 */
export default class Event {
    /**
     * Create an event.
     * @param {any} obj - The object that the event is associated with.
     * @param {string} name - The name of the event.
     */
    constructor(obj, name) {
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    }

    /**
     * Add a listener to the event.
     * @param {Function} fn - The listener function.
     * @param {any} [scope] - The scope in which to execute the listener.
     * @param {Object} [options] - Additional options for the listener.
     */
    addListener(fn, scope, options) {
        scope = scope || this.obj;
        if (!this.isListening(fn, scope)) {
            const l = this.createListener(fn, scope, options);
            if (!this.firing) {
                this.listeners.push(l);
            } else { // if we are currently firing this event, don't disturb the listener loop
                this.listeners = [...this.listeners];
                this.listeners.push(l);
            }
        }
    }

    /**
     * Create a listener object.
     * @param {Function} fn - The listener function.
     * @param {any} [scope] - The scope in which to execute the listener.
     * @param {Object} [o] - Additional options for the listener.
     * @returns {Object} The listener object.
     */
    createListener(fn, scope, o = {}) {
        scope = scope || this.obj;
        let h = fn;
        if (o.delay) {
            h = createDelayed(h, o, scope);
        }
        if (o.single) {
            h = createSingle(h, this, fn, scope);
        }
        if (o.buffer) {
            h = createBuffered(h, o, scope);
        }
        return { fn, scope, options: o, fireFn: h };
    }

    /**
     * Find the index of a listener.
     * @param {Function} fn - The listener function.
     * @param {any} [scope] - The scope in which the listener is executed.
     * @returns {number} The index of the listener, or -1 if not found.
     */
    findListener(fn, scope) {
        scope = scope || this.obj;
        return this.listeners.findIndex(l => l.fn === fn && l.scope === scope);
    }

    /**
     * Check if a listener is already added.
     * @param {Function} fn - The listener function.
     * @param {any} [scope] - The scope in which the listener is executed.
     * @returns {boolean} True if the listener is already added, false otherwise.
     */
    isListening(fn, scope) {
        return this.findListener(fn, scope) !== -1;
    }

    /**
     * Remove a listener from the event.
     * @param {Function} fn - The listener function.
     * @param {any} [scope] - The scope in which the listener is executed.
     * @returns {boolean} True if the listener was removed, false otherwise.
     */
    removeListener(fn, scope) {
        const index = this.findListener(fn, scope);
        if (index !== -1) {
            if (!this.firing) {
                this.listeners.splice(index, 1);
            } else {
                this.listeners = [...this.listeners];
                this.listeners.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    /**
     * Clear all listeners from the event.
     */
    clearListeners() {
        this.listeners = [];
    }

    /**
     * Fire the event, calling all listeners.
     * @returns {boolean} True if all listeners were called successfully, false otherwise.
     */
    fire(...args) {
        const { listeners } = this;
        const len = listeners.length;
        if (len > 0) {
            this.firing = true;
            for (let i = 0; i < len; i++) {
                const { fireFn, scope } = listeners[i];
                if (fireFn.apply(scope || this.obj || window, args) === false) {
                    this.firing = false;
                    return false;
                }
            }
            this.firing = false;
        }
        return true;
    }
}

/**
 * Create a buffered function.
 * @param {Function} h - The original function.
 * @param {Object} o - Options for the buffered function.
 * @param {any} scope - The scope in which to execute the function.
 * @returns {Function} The buffered function.
 */
const createBuffered = (h, o, scope) => {
    const task = new Ext.util.DelayedTask();
    return (...args) => {
        task.delay(o.buffer, h, scope, args);
    };
};

/**
 * Create a single-use function.
 * @param {Function} h - The original function.
 * @param {Event} e - The event object.
 * @param {Function} fn - The listener function.
 * @param {any} scope - The scope in which to execute the function.
 * @returns {Function} The single-use function.
 */
const createSingle = (h, e, fn, scope) => {
    return function(...args) {
        e.removeListener(fn, scope);
        return h.apply(scope, args);
    };
};

/**
 * Create a delayed function.
 * @param {Function} h - The original function.
 * @param {Object} o - Options for the delayed function.
 * @param {any} scope - The scope in which to execute the function.
 * @returns {Function} The delayed function.
 */
const createDelayed = (h, o, scope) => {
    return function(...args) {
        setTimeout(() => {
            h.apply(scope, args);
        }, o.delay || 10);
    };
};