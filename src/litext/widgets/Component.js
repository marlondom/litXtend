// @ts-nocheck
import ComponentMgr from './ComponentMgr.js';
import Observable from '../util/Observable.js';

export default class Component extends Observable {
    static AUTO_ID = 1000;
    static xtype = 'component';

    constructor(config = {}) {
        super(config.listeners);
        if (config.initialConfig) {
            if (config.isAction) {
                this.baseAction = config;
            }
            config = config.initialConfig;
        } else if (config.tagName || config.dom || typeof config === 'string') {
            config = { applyTo: config, id: config.id || config };
        }

        this.initialConfig = config;
        Object.assign(this, config);

        this.addEvents(
            /**
             * @event disable
             * Fires after the component is disabled.
             * @param {Ext.Component} this
             */
            'disable', 
            /**
             * @event enable
             * Fires after the component is enabled.
             * @param {Ext.Component} this
             */
            'enable', 
            /**
             * @event beforeshow
             * Fires before the component is shown. Return false to stop the show.
             * @param {Ext.Component} this
             */
            'beforeshow', 
            /**
             * @event show
             * Fires after the component is shown.
             * @param {Ext.Component} this
             */
            'show', 
            /**
             * @event beforehide
             * Fires before the component is hidden. Return false to stop the hide.
             * @param {Ext.Component} this
             */
            'beforehide', 
            /**
             * @event hide
             * Fires after the component is hidden.
             * @param {Ext.Component} this
             */
            'hide',
            /**
             * @event beforerender
             * Fires before the component is rendered. Return false to stop the render.
             * @param {Ext.Component} this
             */
            'beforerender', 
            /**
             * @event render
             * Fires after the component is rendered.
             * @param {Ext.Component} this
             */
            'render', 
            /**
             * @event beforedestroy
             * Fires before the component is destroyed. Return false to stop the destroy.
             * @param {Ext.Component} this
             */
            'beforedestroy', 
            /**
             * @event destroy
             * Fires after the component is destroyed.
             * @param {Ext.Component} this
             */
            'destroy',
            /**
             * @event beforestaterestore
             * Fires before the state of the component is restored. Return false to stop the restore.
             * @param {Ext.Component} this
             * @param {Object} state The hash of state values
             */
            'beforestaterestore', 
            /**
             * @event staterestore
             * Fires after the state of the component is restored.
             * @param {Ext.Component} this
             * @param {Object} state The hash of state values
             */
            'staterestore', 
            /**
             * @event beforestatesave
             * Fires before the state of the component is saved to the configured state provider. Return false to stop the save.
             * @param {Ext.Component} this
             * @param {Object} state The hash of state values
             */
            'beforestatesave', 
            /**
             * @event statesave
             * Fires after the state of the component is saved to the configured state provider.
             * @param {Ext.Component} this
             * @param {Object} state The hash of state values
             */
            'statesave'
        );

        this.getId();
        ComponentMgr.register(this);

        if (this.baseAction) {
            this.baseAction.addComponent(this);
        }

        this.initComponent();

        if (this.plugins) {
            if (Array.isArray(this.plugins)) {
                this.plugins.forEach(plugin => plugin.init(this));
            } else {
                this.plugins.init(this);
            }
        }

        if (this.stateful !== false) {
            this.initState(config);
        }

        if (this.applyTo) {
            this.applyToMarkup(this.applyTo);
            delete this.applyTo;
        } else if (this.renderTo) {
            this.render(this.renderTo);
            delete this.renderTo;
        }

        /**
         * @cfg {String} disabledClass
         * CSS class added to the component when it is disabled (defaults to "x-item-disabled").
         */
        this.disabledClass = "x-item-disabled";
        
        /**
         * @cfg {Boolean} allowDomMove
         * Whether the component can move the Dom node when rendering (defaults to true).
         */
        this.allowDomMove = true;

        /**
         * @cfg {Boolean} autoShow
         * True if the component should check for hidden classes (e.g. 'x-hidden' or 'x-hide-display') and remove
         * them on render (defaults to false).
         */
        this.autoShow = false;

        /**
         * @cfg {String} hideMode
         * How this component should hidden. Supported values are "visibility" (css visibility), "offsets" (negative
         * offset position) and "display" (css display) - defaults to "display".
         */
        this.hideMode = 'display';
        
        /**
         * @cfg {Boolean} hideParent
         * True to hide and show the component's container when hide/show is called on the component, false to hide
         * and show the component itself (defaults to false).  For example, this can be used as a shortcut for a hide
         * button on a window by setting hide:true on the button when adding it to its parent container.
         */
        this.hideParent = false;
        
        /**
         * True if this component is hidden. Read-only.
         * @type Boolean
         * @property
         */
        this.hidden = false;
        
        /**
         * True if this component is disabled. Read-only.
         * @type Boolean
         * @property
         */
        this.disabled = false;
        
        /**
         * True if this component has been rendered. Read-only.
         * @type Boolean
         * @property
         */
        this.rendered = false;
        
        this.ctype = "Ext.Component";
        
        this.actionMode = "el";
    }

    getActionEl() {
        return this[this.actionMode];
    }

    initComponent() {}

    /**
     * If this is a lazy rendering component, render it to its container element.
     * @param {Mixed} container (optional) The element this component should be rendered into. If it is being
     * applied to existing markup, this should be left off.
     * @param {String/Number} position (optional) The element ID or DOM node index within the container <b>before</b>
     * which this component will be inserted (defaults to appending to the end of the container)
     */
    render(container, position) {
        if (!this.rendered && this.fireEvent('beforerender', this) !== false) {
            if (!container && this.el) {
                this.el = Ext.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Ext.get(container);
            if (this.ctCls) {
                this.container.addClass(this.ctCls);
            }
            this.rendered = true;
            if (position !== undefined) {
                position = typeof position === 'number' ?
                    this.container.dom.childNodes[position] :
                    Ext.getDom(position);
            }
            this.onRender(this.container, position || null);
            if (this.autoShow) {
                this.el.removeClass(['x-hidden', `x-hide-${this.hideMode}`]);
            }
            if (this.cls) {
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if (this.style) {
                this.el.applyStyles(this.style);
                delete this.style;
            }
            this.fireEvent('render', this);
            this.afterRender(this.container);
            if (this.hidden) {
                this.hide();
            }
            if (this.disabled) {
                this.disable();
            }
            this.initStateEvents();
        }
        return this;
    }

    // private
    initState(config) {
        if (Ext.state.Manager) {
            const state = Ext.state.Manager.get(this.stateId || this.id);
            if (state && this.fireEvent('beforestaterestore', this, state) !== false) {
                this.applyState(state);
                this.fireEvent('staterestore', this, state);
            }
        }
    }

    // private
    initStateEvents() {
        if (this.stateEvents) {
            this.stateEvents.forEach(e => this.on(e, this.saveState, this, { delay: 100 }));
        }
    }

    // private
    applyState(state) {
        if (state) {
            Object.assign(this, state);
        }
    }

    // private
    getState() {
        return null;
    }

    // private
    saveState() {
        if (Ext.state.Manager) {
            const state = this.getState();
            if (this.fireEvent('beforestatesave', this, state) !== false) {
                Ext.state.Manager.set(this.stateId || this.id, state);
                this.fireEvent('statesave', this, state);
            }
        }
    }

    /**
     * Apply this component to existing markup that is valid. With this function, no call to render() is required.
     * @param {String/HTMLElement} el 
     */
    applyToMarkup(el) {
        this.allowDomMove = false;
        this.el = Ext.get(el);
        this.render(this.el.dom.parentNode);
    }

    /**
     * Adds a CSS class to the component's underlying element.
     * @param {string} cls The CSS class name to add
     */
    addClass(cls) {
        if (this.el) {
            this.el.addClass(cls);
        } else {
            this.cls = this.cls ? `${this.cls} ${cls}` : cls;
        }
    }

    /**
     * Removes a CSS class from the component's underlying element.
     * @param {string} cls The CSS class name to remove
     */
    removeClass(cls) {
        if (this.el) {
            this.el.removeClass(cls);
        } else if (this.cls) {
            this.cls = this.cls.split(' ').filter(c => c !== cls).join(' ');
        }
    }

    // private
    // default function is not really useful
    onRender(ct, position) {
        if (this.autoEl) {
            this.el = typeof this.autoEl === 'string' ?
                document.createElement(this.autoEl) :
                Ext.DomHelper.overwrite(document.createElement('div'), this.autoEl).firstChild;
            if (!this.el.id) {
                this.el.id = this.getId();
            }
        }
        if (this.el) {
            this.el = Ext.get(this.el);
            if (this.allowDomMove !== false) {
                ct.dom.insertBefore(this.el.dom, position);
            }
        }
    }

    // private
    getAutoCreate() {
        const cfg = typeof this.autoCreate === 'object' ?
            this.autoCreate : Object.assign({}, this.defaultAutoCreate);
        if (this.id && !cfg.id) {
            cfg.id = this.id;
        }
        return cfg;
    }

    // private
    afterRender() {}

    /**
     * Destroys this component by purging any event listeners, removing the component's element from the DOM,
     * removing the component from its {@link Ext.Container} (if applicable) and unregistering it from
     * {@link Ext.ComponentMgr}.  Destruction is generally handled automatically by the framework and this method
     * should usually not need to be called directly.
     */
    destroy() {
        if (this.fireEvent('beforedestroy', this) !== false) {
            this.beforeDestroy();
            if (this.rendered) {
                this.el.removeAllListeners();
                this.el.remove();
                if (this.actionMode === 'container') {
                    this.container.remove();
                }
            }
            this.onDestroy();
            ComponentMgr.unregister(this);
            this.fireEvent('destroy', this);
            this.purgeListeners();
            this.removeAllListeners();
        }
    }

    // private
    beforeDestroy() {}

    // private
    onDestroy() {}

    /**
     * Returns the underlying {@link Ext.Element}.
     * @return {Ext.Element} The element
     */
    getEl() {
        return this.el;
    }

    /**
     * Returns the id of this component.
     * @return {String}
     */
    getId() {
        return this.id || (this.id = `ext-comp-${++Component.AUTO_ID}`);
    }

    /**
     * Returns the item id of this component.
     * @return {String}
     */
    getItemId() {
        return this.itemId || this.getId();
    }

    /**
     * Try to focus this component.
     * @param {Boolean} selectText (optional) If applicable, true to also select the text in this component
     * @param {Boolean/Number} delay (optional) Delay the focus this number of milliseconds (true for 10 milliseconds)
     * @return {Ext.Component} this
     */
    focus(selectText, delay) {
        if (delay) {
            setTimeout(() => this.focus(selectText, false), typeof delay === 'number' ? delay : 10);
            return;
        }
        if (this.rendered) {
            this.el.focus();
            if (selectText === true) {
                this.el.dom.select();
            }
        }
        return this;
    }

    // private
    blur() {
        if (this.rendered) {
            this.el.blur();
        }
        return this;
    }

    /**
     * Disable this component.
     * @return {Ext.Component} this
     */
    disable() {
        if (this.rendered) {
            this.onDisable();
        }
        this.disabled = true;
        this.fireEvent('disable', this);
        return this;
    }

    // private
    onDisable() {
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    }

    /**
     * Enable this component.
     * @return {Ext.Component} this
     */
    enable() {
        if (this.rendered) {
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent('enable', this);
        return this;
    }

    // private
    onEnable() {
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    }

    /**
     * Convenience function for setting disabled/enabled by boolean.
     * @param {Boolean} disabled
     */
    setDisabled(disabled) {
        this[disabled ? 'disable' : 'enable']();
    }

    /**
     * Show this component.
     * @return {Ext.Component} this
     */
    show() {
        if (this.fireEvent('beforeshow', this) !== false) {
            this.hidden = false;
            if (this.autoRender) {
                this.render(typeof this.autoRender === 'boolean' ? Ext.getBody() : this.autoRender);
            }
            if (this.rendered) {
                this.onShow();
            }
            this.fireEvent('show', this);
        }
        return this;
    }

    // private
    onShow() {
        if (this.hideParent) {
            this.container.removeClass(`x-hide-${this.hideMode}`);
        } else {
            this.getActionEl().removeClass(`x-hide-${this.hideMode}`);
        }
    }

    /**
     * Hide this component.
     * @return {Ext.Component} this
     */
    hide() {
        if (this.fireEvent('beforehide', this) !== false) {
            this.hidden = true;
            if (this.rendered) {
                this.onHide();
            }
            this.fireEvent('hide', this);
        }
        return this;
    }

    // private
    onHide() {
        if (this.hideParent) {
            this.container.addClass(`x-hide-${this.hideMode}`);
        } else {
            this.getActionEl().addClass(`x-hide-${this.hideMode}`);
        }
    }

    /**
     * Convenience function to hide or show this component by boolean.
     * @param {Boolean} visible True to show, false to hide
     * @return {Ext.Component} this
     */
    setVisible(visible) {
        if (visible) {
            this.show();
        } else {
            this.hide();
        }
        return this;
    }

    /**
     * Returns true if this component is visible.
     */
    isVisible() {
        return this.rendered && this.getActionEl().isVisible();
    }

    /**
     * Clone the current component using the original config values passed into this instance by default.
     * @param {Object} overrides A new config containing any properties to override in the cloned version.
     * An id property can be passed on this object, otherwise one will be generated to avoid duplicates.
     * @return {Ext.Component} clone The cloned copy of this component
     */
    cloneConfig(overrides) {
        overrides = overrides || {};
        const id = overrides.id || Ext.id();
        const cfg = Object.assign({}, this.initialConfig, overrides);
        cfg.id = id;
        return new this.constructor(cfg);
    }

    getXType() {
        return this.constructor.xtype;
    }

    isXType(xtype, shallow) {
        return !shallow ?
            ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') !== -1 :
            this.constructor.xtype === xtype;
    }

    getXTypes() {
        if (!this.constructor.xtypes) {
            const c = [];
            let sc = this;
            while (sc && sc.constructor.xtype) {
                c.unshift(sc.constructor.xtype);
                sc = Object.getPrototypeOf(sc.constructor.prototype);
            }
            this.constructor.xtypeChain = c;
            this.constructor.xtypes = c.join('/');
        }
        return this.constructor.xtypes;
    }

    /**
     * Find a container above this component at any level by a custom function. If the passed function returns
     * true, the container will be returned. The passed function is called with the arguments (container, this component).
     * @param {Function} fcn
     * @param {Object} scope (optional)
     * @return {Array} Array of Ext.Components
     */
    findParentBy(fn) {
        let p = this.ownerCt;
        while (p && !fn(p, this)) {
            p = p.ownerCt;
        }
        return p || null;
    }

    findParentByType(xtype) {
        return typeof xtype === 'function' ?
            this.findParentBy(p => p.constructor === xtype) :
            this.findParentBy(p => p.constructor.xtype === xtype);
    }

}