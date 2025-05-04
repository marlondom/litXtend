import Litext from './Litext.js';
import Format from './Format.js';

/**
 * @class Ext.Template
 * Represents an HTML fragment template. Templates can be precompiled for greater performance.
 * For a list of available format functions, see {@link Ext.util.Format}.<br />
 * Usage:
<pre><code>
var t = new Ext.Template(
    '&lt;div name="{id}"&gt;',
        '&lt;span class="{cls}"&gt;{name:trim} {value:ellipsis(10)}&lt;/span&gt;',
    '&lt;/div&gt;'
);
t.append('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
</code></pre>
 * For more information see this blog post with examples: <a href="http://www.jackslocum.com/blog/2006/10/06/domhelper-create-elements-using-dom-html-fragments-or-templates/">DomHelper - Create Elements using DOM, HTML fragments and Templates</a>. 
 * @constructor
 * @param {String/Array} html The HTML fragment or an array of fragments to join("") or multiple arguments to join("")
 */
export default class Template {
    constructor(html) {
        if (Array.isArray(html)) {
            this.html = html.join("");
        } else if (arguments.length > 1) {
            const parts = [];
            for (let i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'object') {
                    Object.assign(this, arguments[i]);
                } else {
                    parts.push(arguments[i]);
                }
            }
            this.html = parts.join('');
        } else {
            this.html = html;
        }
        if (this.compiled) {
            this.compile();
        }
    }

    /**
     * Returns an HTML fragment of this template with the specified values applied.
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @return {String} The HTML fragment
     */
    applyTemplate(values) {
        if (this.compiled) {
            return this.compiled(values);
        }
        const useFormats = this.disableFormats !== true;
        const fm = Format;
        const replaceFn = (match, name, format, args) => {
            if (format && useFormats) {
                if (format.startsWith("this.")) {
                    return this.call(format.substr(5), values[name], values);
                } else {
                    let processedArgs = args;
                    if (processedArgs) {
                        // quoted values are required for strings in compiled templates, 
                        // but for non compiled we need to strip them
                        // quoted reversed for jsmin
                        const argRe = /^\s*['"](.*)["']\s*$/;
                        processedArgs = processedArgs.split(',').map(arg => arg.replace(argRe, "$1"));
                        processedArgs = [values[name], ...processedArgs];
                    } else {
                        processedArgs = [values[name]];
                    }
                    return fm[format].apply(fm, processedArgs);
                }
            } else {
                return values[name] !== undefined ? values[name] : "";
            }
        };
        return this.html.replace(this.re, replaceFn);
    }

    /**
     * Sets the HTML used as the template and optionally compiles it.
     * @param {String} html
     * @param {Boolean} compile (optional) True to compile the template (defaults to undefined)
     * @return {Ext.Template} this
     */
    set(html, compile) {
        this.html = html;
        this.compiled = null;
        if (compile) {
            this.compile();
        }
        return this;
    }

    /**
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     * @return {Ext.Template} this
     */
    compile() {
        const fm = Format;
        const useFormats = this.disableFormats !== true;
        const sep = Ext.isGecko ? "+" : ",";
        const replaceFn = (match, name, format, args) => {
            let processedArgs = args;
            let processedFormat = format;
            if (processedFormat && useFormats) {
                processedArgs = processedArgs ? ',' + processedArgs : "";
                if (!processedFormat.startsWith("this.")) {
                    processedFormat = "fm." + processedFormat + '(';
                } else {
                    processedFormat = `this.call("${processedFormat.substr(5)}", `;
                    processedArgs = ", values";
                }
            } else {
                processedArgs = '';
                processedFormat = `(values['${name}'] == undefined ? '' : `;
            }
            return `'${sep}${processedFormat}values['${name}']${processedArgs})${sep}'`;
        };

        const compiledBody = Ext.isGecko
            ? `this.compiled = function(values){ return '${this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, replaceFn)}';};`
            : `this.compiled = function(values){ return ['${this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, replaceFn)}'].join('');};`;

        // Use Function constructor instead of eval for better security and performance
        this.compiled = new Function('values', compiledBody.match(/return\s*(.*);/)[1]);

        return this;
    }

    // private function used to call members
    call(fnName, value, allValues) {
        return this[fnName](value, allValues);
    }

    /**
     * Applies the supplied values to the template and inserts the new node(s) as the first child of el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertFirst(el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    }

    /**
     * Applies the supplied values to the template and inserts the new node(s) before el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertBefore(el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    }

    /**
     * Applies the supplied values to the template and inserts the new node(s) after el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertAfter(el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    }

    /**
     * Applies the supplied values to the template and appends the new node(s) to el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    append(el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    }

    doInsert(where, el, values, returnEl) {
        const domEl = Ext.getDom(el);
        const newNode = Ext.DomHelper.insertHtml(where, domEl, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    }

    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    overwrite(el, values, returnElement) {
        const domEl = Ext.getDom(el);
        domEl.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(domEl.firstChild, true) : domEl.firstChild;
    }

    /**
    * The regular expression used to match template variables 
    * @type RegExp
    * @property 
    */
    get re() {
        return /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g;
    }

    /**
     * True to disable format functions (defaults to false)
     * @type Boolean
     */
    get disableFormats() {
        return false;
    }

    /**
     * Alias for {@link #applyTemplate}
     * @method
     */
    apply(values) {
        return this.applyTemplate(values);
    }

    /**
     * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
     * @param {String/HTMLElement} el A DOM element or its id
     * @param {Object} config A configuration object
     * @return {Ext.Template} The created template
     * @static
     */
    static from(el, config) {
        const domEl = Ext.getDom(el);
        return new Template(domEl.value || domEl.innerHTML, config || '');
    }
}

Litext.DomHelper.Template = Template;
Litext.Template = Template;