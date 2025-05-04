import Observable from "./Observable";

/**
 * @class Ext.util.MixedCollection
 * @extends Observable
 * A Collection class that maintains both numeric indexes and keys and exposes events.
 * @constructor
 * @param {Boolean} allowFunctions True if the addAll function should add function references to the
 * collection (defaults to false)
 * @param {Function} keyFn A function that can accept an item of the type(s) stored in this MixedCollection
 * and return the key value for that item.  This is used when available to look up the key on items that
 * were passed without an explicit key parameter to a MixedCollection method.  Passing this parameter is
 * equivalent to providing an implementation for the {@link #getKey} method.
 */
export default class MixedCollection extends Observable {
  constructor(allowFunctions = false, keyFn) {
    super();
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.allowFunctions = allowFunctions;
    if (keyFn) {
      this.getKey = keyFn;
    }
    this.addEvents(
      /**
       * @event clear
       * Fires when the collection is cleared.
       */
      "clear",
      /**
       * @event add
       * Fires when an item is added to the collection.
       * @param {Number} index The index at which the item was added.
       * @param {Object} o The item added.
       * @param {String} key The key associated with the added item.
       */
      "add",
      /**
       * @event replace
       * Fires when an item is replaced in the collection.
       * @param {String} key he key associated with the new added.
       * @param {Object} old The item being replaced.
       * @param {Object} new The new item.
       */
      "replace",
      /**
       * @event remove
       * Fires when an item is removed from the collection.
       * @param {Object} o The item being removed.
       * @param {String} key (optional) The key associated with the removed item.
       */
      "remove",
      "sort"
    );
  }

  /**
     * MixedCollection has a generic way to fetch keys if you implement getKey.  The default implementation
     * simply returns <tt style="font-weight:bold;">item.id</tt> but you can provide your own implementation
     * to return a different value as in the following examples:
    <pre><code>
    // normal way
    var mc = new Ext.util.MixedCollection();
    mc.add(someEl.dom.id, someEl);
    mc.add(otherEl.dom.id, otherEl);
    //and so on

    // using getKey
    var mc = new Ext.util.MixedCollection();
    mc.getKey = function(el){
    return el.dom.id;
    };
    mc.add(someEl);
    mc.add(otherEl);

    // or via the constructor
    var mc = new Ext.util.MixedCollection(false, function(el){
    return el.dom.id;
    });
    mc.add(someEl);
    mc.add(otherEl);
    </code></pre>
    * @param {Object} item The item for which to find the key.
    * @return {Object} The key for the passed item.
    */
  getKey(item) {
    return item.id;
  }

  /**
   * Adds an item to the collection. Fires the {@link #add} event when complete.
   * @param {String} key The key to associate with the item
   * @param {Object} o The item to add.
   * @return {Object} The item added.
   */
  add(key, o) {
    if (arguments.length === 1) {
      o = key;
      key = this.getKey(o);
    }
    if (typeof key === "undefined" || key === null) {
      this.length++;
      this.items.push(o);
      this.keys.push(null);
    } else {
      const old = this.map[key];
      if (old) {
        return this.replace(key, o);
      }
      this.length++;
      this.items.push(o);
      this.map[key] = o;
      this.keys.push(key);
    }
    this.fireEvent("add", this.length - 1, o, key);
    return o;
  }

  /**
   * Replaces an item in the collection. Fires the {@link #replace} event when complete.
   * @param {String} key The key associated with the item to replace, or the item to replace.
   * @param o {Object} o (optional) If the first parameter passed was a key, the item to associate with that key.
   * @return {Object}  The new item.
   */
  replace(key, o) {
    if (arguments.length === 1) {
      o = key;
      key = this.getKey(o);
    }
    const old = this.item(key);
    if (
      typeof key === "undefined" ||
      key === null ||
      typeof old === "undefined"
    ) {
      return this.add(key, o);
    }
    const index = this.indexOfKey(key);
    this.items[index] = o;
    this.map[key] = o;
    this.fireEvent("replace", key, old, o);
    return o;
  }

  /**
   * Adds all elements of an Array or an Object to the collection.
   * @param {Object|Array} objs An Object containing properties which will be added to the collection, or
   * an Array of values, each of which are added to the collection.
   */
  addAll(objs) {
    const args =
        arguments.length > 1 || Array.isArray(objs)
            ? arguments.length > 1
                ? Array.from(arguments)
                : objs
            : Object.entries(objs)
                  .filter(
                      ([key, value]) =>
                          this.allowFunctions || typeof value !== "function"
                  )
                  .map(([key, value]) => [key, value]);

    args.forEach((arg) => {
        if (Array.isArray(arg)) {
            this.add(...arg); // Garantido que `arg` é um array
        } else {
            this.add(arg); // Passa como argumento único
        }
    });
}

  /**
   * Executes the specified function once for every item in the collection, passing the following arguments:
   * <div class="mdetail-params"><ul>
   * <li><b>item</b> : Mixed<p class="sub-desc">The collection item</p></li>
   * <li><b>index</b> : Number<p class="sub-desc">The item's index</p></li>
   * <li><b>length</b> : Number<p class="sub-desc">The total number of items in the collection</p></li>
   * </ul></div>
   * The function should return a boolean value. Returning false from the function will stop the iteration.
   * @param {Function} fn The function to execute for each item.
   * @param {Object} scope (optional) The scope in which to execute the function.
   */
  each(fn, scope) {
    [...this.items].forEach((item, index, items) => {
      if (fn.call(scope || item, item, index, items.length) === false) {
        return false;
      }
    });
  }

  /**
   * Executes the specified function once for every key in the collection, passing each
   * key, and its associated item as the first two parameters.
   * @param {Function} fn The function to execute for each item.
   * @param {Object} scope (optional) The scope in which to execute the function.
   */
  eachKey(fn, scope) {
    this.keys.forEach((key, index, keys) => {
      fn.call(scope || window, key, this.items[index], index, keys.length);
    });
  }

  /**
   * Returns the first item in the collection which elicits a true return value from the
   * passed selection function.
   * @param {Function} fn The selection function to execute for each item.
   * @param {Object} scope (optional) The scope in which to execute the function.
   * @return {Object} The first item in the collection which returned true from the selection function.
   */
  find(fn, scope) {
    for (let i = 0, len = this.items.length; i < len; i++) {
      if (fn.call(scope || window, this.items[i], this.keys[i])) {
        return this.items[i];
      }
    }
    return null;
  }

  /**
   * Inserts an item at the specified index in the collection. Fires the {@link #add} event when complete.
   * @param {Number} index The index to insert the item at.
   * @param {String} key The key to associate with the new item, or the item itself.
   * @param {Object} o (optional) If the second parameter was a key, the new item.
   * @return {Object} The item inserted.
   */
  insert(index, key, o) {
    if (arguments.length === 2) {
      o = key;
      key = this.getKey(o);
    }
    if (index >= this.length) {
      return this.add(key, o);
    }
    this.length++;
    this.items.splice(index, 0, o);
    if (typeof key !== "undefined" && key !== null) {
      this.map[key] = o;
    }
    this.keys.splice(index, 0, key);
    this.fireEvent("add", index, o, key);
    return o;
  }

  /**
   * Removed an item from the collection.
   * @param {Object} o The item to remove.
   * @return {Object} The item removed or false if no item was removed.
   */
  remove(o) {
    return this.removeAt(this.indexOf(o));
  }

  /**
   * Remove an item from a specified index in the collection. Fires the {@link #remove} event when complete.
   * @param {Number} index The index within the collection of the item to remove.
   * @return {Object} The item removed or false if no item was removed.
   */
  removeAt(index) {
    if (index < this.length && index >= 0) {
      this.length--;
      const o = this.items[index];
      this.items.splice(index, 1);
      const key = this.keys[index];
      if (typeof key !== "undefined") {
        delete this.map[key];
      }
      this.keys.splice(index, 1);
      this.fireEvent("remove", o, key);
      return o;
    }
    return false;
  }

  /**
   * Removed an item associated with the passed key fom the collection.
   * @param {String} key The key of the item to remove.
   * @return {Object} The item removed or false if no item was removed.
   */
  removeKey(key) {
    return this.removeAt(this.indexOfKey(key));
  }

  /**
   * Returns the number of items in the collection.
   * @return {Number} the number of items in the collection.
   */
  getCount() {
    return this.length;
  }

  /**
   * Returns index within the collection of the passed Object.
   * @param {Object} o The item to find the index of.
   * @return {Number} index of the item.
   */
  indexOf(o) {
    return this.items.indexOf(o);
  }

  /**
   * Returns index within the collection of the passed key.
   * @param {String} key The key to find the index of.
   * @return {Number} index of the key.
   */
  indexOfKey(key) {
    return this.keys.indexOf(key);
  }

  /**
   * Returns the item associated with the passed key OR index. Key has priority over index.  This is the equivalent
   * of calling {@link #key} first, then if nothing matched calling {@link #itemAt}.
   * @param {String|Number} key The key or index of the item.
   * @return {Object} The item associated with the passed key.
   */
  item(key) {
    const item =
      typeof this.map[key] !== "undefined" ? this.map[key] : this.items[key];
    return typeof item !== "function" || this.allowFunctions ? item : null;
  }

  /**
   * Returns the item at the specified index.
   * @param {Number} index The index of the item.
   * @return {Object} The item at the specified index.
   */
  itemAt(index) {
    return this.items[index];
  }

  /**
   * Returns the item associated with the passed key.
   * @param {String|Number} key The key of the item.
   * @return {Object} The item associated with the passed key.
   */
  key(key) {
    return this.map[key];
  }

  /**
   * Returns true if the collection contains the passed Object as an item.
   * @param {Object} o  The Object to look for in the collection.
   * @return {Boolean} True if the collection contains the Object as an item.
   */
  contains(o) {
    return this.indexOf(o) !== -1;
  }

  /**
   * Returns true if the collection contains the passed Object as a key.
   * @param {String} key The key to look for in the collection.
   * @return {Boolean} True if the collection contains the Object as a key.
   */
  containsKey(key) {
    return typeof this.map[key] !== "undefined";
  }

  /**
   * Removes all items from the collection.  Fires the {@link #clear} event when complete.
   */
  clear() {
    this.length = 0;
    this.items = [];
    this.keys = [];
    this.map = {};
    this.fireEvent("clear");
  }

  /**
   * Returns the first item in the collection.
   * @return {Object} the first item in the collection..
   */
  first() {
    return this.items[0];
  }

  /**
   * Returns the last item in the collection.
   * @return {Object} the last item in the collection..
   */
  last() {
    return this.items[this.length - 1];
  }

  // private
  _sort(property, dir, fn) {
    const dsc = String(dir).toUpperCase() === "DESC" ? -1 : 1;
    fn = fn || ((a, b) => a - b);
    const c = this.items.map((item, index) => ({
      key: this.keys[index],
      value: item,
      index,
    }));
    c.sort((a, b) => {
      let v = fn(a[property], b[property]) * dsc;
      if (v === 0) {
        v = a.index < b.index ? -1 : 1;
      }
      return v;
    });
    this.items = c.map((item) => item.value);
    this.keys = c.map((item) => item.key);
    this.fireEvent("sort", this);
  }

  /**
   * Sorts this collection with the passed comparison function
   * @param {String} direction (optional) "ASC" or "DESC"
   * @param {Function} fn (optional) comparison function
   */
  sort(direction, fn) {
    this._sort("value", direction, fn);
  }

  /**
   * Sorts this collection by keys
   * @param {String} direction (optional) "ASC" or "DESC"
   * @param {Function} fn (optional) a comparison function (defaults to case insensitive string)
   */
  keySort(direction, fn) {
    this._sort(
      "key",
      direction,
      fn ||
        ((a, b) =>
          String(a).toUpperCase().localeCompare(String(b).toUpperCase()))
    );
  }

  /**
   * Returns a range of items in this collection
   * @param {Number} startIndex (optional) defaults to 0
   * @param {Number} endIndex (optional) default to the last item
   * @return {Array} An array of items
   */
  getRange(startIndex = 0, endIndex) {
    if (this.items.length === 0) {
      return [];
    }
    endIndex = Math.min(
      typeof endIndex === "undefined" ? this.length - 1 : endIndex,
      this.length - 1
    );
    if (startIndex <= endIndex) {
      return this.items.slice(startIndex, endIndex + 1);
    } else {
      const result = [];
      for (let i = startIndex; i >= endIndex; i--) {
        result.push(this.items[i]);
      }
      return result;
    }
  }

  /**
   * Filter the <i>objects</i> in this collection by a specific property.
   * Returns a new collection that has been filtered.
   * @param {String} property A property on your objects
   * @param {String|RegExp} value Either string that the property values
   * should start with or a RegExp to test against the property
   * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning
   * @param {Boolean} caseSensitive (optional) True for case sensitive comparison (defaults to False).
   * @return {MixedCollection} The new filtered collection
   */
  filter(property, value, anyMatch, caseSensitive) {
    if (Ext.isEmpty(value, false)) {
      return this.clone();
    }
    const matcher = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.filterBy((o) => o && matcher.test(o[property]));
  }

  /**
   * Filter by a function. Returns a <i>new</i> collection that has been filtered.
   * The passed function will be called with each object in the collection.
   * If the function returns true, the value is included otherwise it is filtered.
   * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
   * @param {Object} scope (optional) The scope of the function (defaults to this)
   * @return {MixedCollection} The new filtered collection
   */
  filterBy(fn, scope = this) {
    const result = new MixedCollection();
    result.getKey = this.getKey;
    this.items.forEach((item, index) => {
      if (fn.call(scope, item, this.keys[index])) {
        result.add(this.keys[index], item);
      }
    });
    return result;
  }

  /**
   * Finds the index of the first matching object in this collection by a specific property/value.
   * @param {String} property The name of a property on your objects.
   * @param {String|RegExp} value A string that the property values
   * should start with or a RegExp to test against the property.
   * @param {Number} start (optional) The index to start searching at (defaults to 0).
   * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning.
   * @param {Boolean} caseSensitive (optional) True for case sensitive comparison.
   * @return {Number} The matched index or -1
   */
  findIndex(property, value, start = 0, anyMatch, caseSensitive) {
    if (Ext.isEmpty(value, false)) {
      return -1;
    }
    const matcher = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.findIndexBy((o) => o && matcher.test(o[property]), null, start);
  }

  /**
   * Find the index of the first matching object in this collection by a function.
   * If the function returns <i>true</i> it is considered a match.
   * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key).
   * @param {Object} scope (optional) The scope of the function (defaults to this).
   * @param {Number} start (optional) The index to start searching at (defaults to 0).
   * @return {Number} The matched index or -1
   */
  findIndexBy(fn, scope = this, start = 0) {
    const items = this.items;
    for (let i = start; i < items.length; i++) {
      if (fn.call(scope, items[i], this.keys[i])) {
        return i;
      }
    }
    if (typeof start === "number" && start > 0) {
      for (let i = 0; i < start; i++) {
        if (fn.call(scope, items[i], this.keys[i])) {
          return i;
        }
      }
    }
    return -1;
  }

  // private
  createValueMatcher(value, anyMatch, caseSensitive) {
    if (!value.exec) {
      value = String(value);
      value = new RegExp(
        (anyMatch === true ? "" : "^") + Ext.escapeRe(value),
        caseSensitive ? "" : "i"
      );
    }
    return value;
  }

  /**
   * Creates a duplicate of this collection
   * @return {MixedCollection}
   */
  clone() {
    const result = new MixedCollection();
    result.getKey = this.getKey;
    this.items.forEach((item, index) => {
      result.add(this.keys[index], item);
    });
    return result;
  }

  /**
   * Returns the item associated with the passed key or index.
   * @method
   * @param {String|Number} key The key or index of the item.
   * @return {Object} The item associated with the passed key.
   */
  get(key) {
    return this.item(key);
  }
}
