/**
 * @class Litext
 * Litext core utilities and functions.
 * @singleton
 */
export default Litext = {

    version: '0.0.1', // TODO: Pegar do package.json

    getVersion() {
        return this.version;
    },

    getAuthor() {
        return 'Marlon Domingos';
    },

    /**
     * A reusable empty function
     * @property
     * @type Function
     */
    emptyFn() { },

    /**
     * Copies all the properties of config to obj.
     * @param {Object} obj The receiver of the properties
     * @param {Object} config The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns obj
     * @member Letext apply
     */
    apply(obj = {}, config, defaults) {
        if (defaults) {
            // no "this" reference for friendly out of scope calls
            this.apply(obj, defaults);
        }
        if (obj && config && typeof config === 'object') {
            Object.assign(obj, config)
        }
        return obj;
    },

    /**
     * Copies all the properties of config to obj if they don't already exist.
     * @param {Object} obj The receiver of the properties
     * @param {Object} config The source of the properties
     * @return {Object} returns obj
     */
    applyIf(obj, config) {
        if (obj && config) {
            for (const p in config) {
                if (typeof obj[p] === "undefined") {
                    obj[p] = config[p];
                }
            }
        }
        return obj;
    }
}

/**
 * Removes the specified object from the array.  If the object is not found nothing happens.
 * @param {Object} o The object to remove
 * @return {Array} this array
 */
Array.prototype.remove = function(o){
    var index = this.indexOf(o);
    if(index != -1){
        this.splice(index, 1);
    }
    return this;
 }

/**
 Returns the number of milliseconds between this date and date
 @param {Date} date (optional) Defaults to now
 @return {Number} The diff in milliseconds
 @member Date getElapsed
 */
Date.prototype.getElapsed = function(date) {
	return Math.abs((date || new Date()).getTime()-this.getTime());
};

/**
 * Checks whether or not the current number is within a desired range.  If the number is already within the
 * range it is returned, otherwise the min or max value is returned depending on which side of the range is
 * exceeded.  Note that this method returns the constrained value but does not change the current number.
 * @param {Number} min The minimum number in the range
 * @param {Number} max The maximum number in the range
 * @return {Number} The constrained value if outside the range, otherwise the current value
 */
Number.prototype.constrain = function(min, max){
    return Math.min(Math.max(this, min), max);
};

/**
 * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
 * <pre><code>
var s = '  foo bar  ';
alert('-' + s + '-');         //alerts "- foo bar -"
alert('-' + s.trim() + '-');  //alerts "-foo bar-"
</code></pre>
 * @return {String} The trimmed string
 */
String.prototype.trim = function(){
    var re = /^\s+|\s+$/g;
    return function(){ return this.replace(re, ""); };
}();

/**
 * Utility function that allows you to easily switch a string between two alternating values.  The passed value
 * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
 * they are already different, the first value passed in is returned.  Note that this method returns the new value
 * but does not change the current string.
 * <pre><code>
// alternate sort directions
sort = sort.toggle('ASC', 'DESC');

// instead of conditional logic:
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
</code></pre>
 * @param {String} value The value to compare to the current string
 * @param {String} other The new value to use if the string already equals the first value passed in
 * @return {String} The new value
 */
String.prototype.toggle = function(value, other){
    return this == value ? other : value;
};

Litext.applyIf(String, {

    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     * @static
     */
    escape : function(string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     * <pre><code>
var s = String.leftPad('123', 5, '0');
// s now contains the string: '00123'
</code></pre>
     * @param {String} string The original string
     * @param {Number} size The total length of the output string
     * @param {String} char (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     * @static
     */
    leftPad : function (val, size, ch) {
        var result = new String(val);
        if(!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = String.format('<div class="{0}">{1}</div>', cls, text);
// s now contains the string: '<div class="my-class">Some text</div>'
</code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     * @static
     */
    format : function(format){
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});

/**
 * @class Function
 * These functions are available on every Function object (any JavaScript function).
 */
Ext.apply(Function.prototype, {
    /**
    * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
    * Call directly on any function. Example: <code>myFunction.createCallback(myarg, myarg2)</code>
    * Will create a function that is bound to those 2 args.
    * @return {Function} The new function
   */
   createCallback : function(/*args...*/){
       // make args available, in function below
       const args = arguments;
       const method = this;
       return function() {
           return method.apply(window, args);
       };
   },

   /**
    * Creates a delegate (callback) that sets the scope to obj.
    * Call directly on any function. Example: <code>this.myFunction.createDelegate(this)</code>
    * Will create a function that is automatically scoped to this.
    * @param {Object} obj (optional) The object for which the scope is set
    * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
    * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
    *                                             if a number the args are inserted at the specified position
    * @return {Function} The new function
    */
   createDelegate : function(obj, args, appendArgs){
       var method = this;
       return function() {
           var callArgs = args || arguments;
           if(appendArgs === true){
               callArgs = Array.prototype.slice.call(arguments, 0);
               callArgs = callArgs.concat(args);
           }else if(typeof appendArgs == "number"){
               callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
               var applyArgs = [appendArgs, 0].concat(args); // create method call params
               Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
           }
           return method.apply(obj || window, callArgs);
       };
   },

   /**
    * Calls this function after the number of millseconds specified.
    * @param {Number} millis The number of milliseconds for the setTimeout call (if 0 the function is executed immediately)
    * @param {Object} obj (optional) The object for which the scope is set
    * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
    * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
    *                                             if a number the args are inserted at the specified position
    * @return {Number} The timeout id that can be used with clearTimeout
    */
   defer : function(millis, obj, args, appendArgs){
       var fn = this.createDelegate(obj, args, appendArgs);
       if(millis){
           return setTimeout(fn, millis);
       }
       fn();
       return 0;
   },

   /**
    * Create a combined function call sequence of the original function + the passed function.
    * The resulting function returns the results of the original function.
    * The passed fcn is called with the parameters of the original function
    * @param {Function} fcn The function to sequence
    * @param {Object} scope (optional) The scope of the passed fcn (Defaults to scope of original function or window)
    * @return {Function} The new function
    */
   createSequence : function(fcn, scope){
       if(typeof fcn != "function"){
           return this;
       }
       var method = this;
       return function() {
           var retval = method.apply(this || window, arguments);
           fcn.apply(scope || this || window, arguments);
           return retval;
       };
   },

   /**
    * Creates an interceptor function. The passed fcn is called before the original one. If it returns false, the original one is not called.
    * The resulting function returns the results of the original function.
    * The passed fcn is called with the parameters of the original function.
    * @addon
    * @param {Function} fcn The function to call before the original
    * @param {Object} scope (optional) The scope of the passed fcn (Defaults to scope of original function or window)
    * @return {Function} The new function
    */
   createInterceptor : function(fcn, scope){
       if(typeof fcn != "function"){
           return this;
       }
       var method = this;
       return function() {
           fcn.target = this;
           fcn.method = method;
           if(fcn.apply(scope || this || window, arguments) === false){
               return;
           }
           return method.apply(this || window, arguments);
       };
   }
});