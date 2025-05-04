import MixedCollection from '../util/MixedCollection.js';

/**
 * @class Ext.ComponentMgr
 * <p>Provides a registry of all Components (specifically subclasses of
 * {@link Ext.Component}) on a page so that they can be easily accessed by
 * component id (see {@link Ext.getCmp}).</p>
 * <p>This object also provides a registry of available Component <i>classes</i>
 * indexed by a mnemonic code known as the Component's {@link Ext.Component#xtype}.
 * The <tt>xtype</tt> provides a way to avoid instantiating child Components
 * when creating a full, nested config object for a complete Ext page.</p>
 * <p>
 * A child Component may be specified simply as a <i>config object</i>
 * as long as the correct xtype is specified so that if and when the Component
 * needs rendering, the correct type can be looked up for lazy instantiation.</p>
 * <p>For a list of all available xtypes, see {@link Ext.Component}.</p>
 * @singleton
 */
class ComponentMgrClazz {
    constructor() {
        this.all = new MixedCollection();
        this.types = new Map();
        this.addListeners = new Map();
    }

    /**
     * Registers a component.
     * @param {Ext.Component} c The component
     */
    register(c) {
        this.all.set(c.id, c);
        this.addListeners.forEach((listeners, id) => {
            if (c.id === id) {
                listeners.forEach(listener => listener.fn.call(listener.scope || c, c));
                this.addListeners.delete(id);
            }
        });
    }

    /**
     * Unregisters a component.
     * @param {Ext.Component} c The component
     */
    unregister(c) {
        this.all.delete(c.id);
    }

    /**
     * Returns a component by id
     * @param {String} id The component id
     * @return Ext.Component
     */
    get(id) {
        return this.all.get(id);
    }

    /**
     * Registers a function that will be called when a specified component is added to ComponentMgr
     * @param {String} id The component id
     * @param {Function} fn The callback function
     * @param {Object} scope The scope of the callback
     */
    onAvailable(id, fn, scope) {
        const component = this.get(id);
        if (component) {
            fn.call(scope || component, component);
        } else {
            if (!this.addListeners.has(id)) {
                this.addListeners.set(id, []);
            }
            this.addListeners.get(id).push({ fn, scope });
        }
    }

    /**
     * Registers a new Component constructor, keyed by a new
     * {@link Ext.Component#xtype}.<br><br>
     * Use this method to register new subclasses of {@link Ext.Component} so
     * that lazy instantiation may be used when specifying child Components.
     * see {@link Ext.Container#items}
     * @param {String} xtype The mnemonic string by which the Component class
     * may be looked up.
     * @param {Constructor} cls The new Component class.
     */
    registerType(xtype, cls) {
        this.types.set(xtype, cls);
        cls.xtype = xtype;
    }

    /**
     * Creates a new Component based on the config object
     * @param {Object} config The component configuration
     * @param {String} defaultType The default xtype to use if none is specified
     * @returns {Ext.Component}
     */
    create(config, defaultType) {
        const ComponentClass = this.types.get(config.xtype || defaultType);
        if (!ComponentClass) {
            throw new Error(`Component xtype "${config.xtype || defaultType}" not registered.`);
        }
        return new ComponentClass(config);
    }
}

// Singleton instance
const ComponentMgr = new ComponentMgrClazz();

// Shorthand for registerType
const reg = ComponentMgr.registerType.bind(ComponentMgr);

export { ComponentMgr, reg };

export default ComponentMgr