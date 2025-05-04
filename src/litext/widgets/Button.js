import Component from "./Component";
import { reg } from "./ComponentMgr";

/**
 * @class Ext.Button
 * @extends Component
 * Simple Button class
 * @cfg {String} text The button text
 * @cfg {String} icon The path to an image to display in the button (the image will be set as the background-image
 * CSS property of the button by default, so if you want a mixed icon/text button, set cls:"x-btn-text-icon")
 * @cfg {Function} handler A function called when the button is clicked (can be used instead of click event)
 * @cfg {Object} scope The scope of the handler
 * @cfg {Number} minWidth The minimum width for this button (used to give a set of buttons a common width)
 * @cfg {String/Object} tooltip The tooltip for the button - can be a string or QuickTips config object
 * @cfg {Boolean} hidden True to start hidden (defaults to false)
 * @cfg {Boolean} disabled True to start disabled (defaults to false)
 * @cfg {Boolean} pressed True to start pressed (only if enableToggle = true)
 * @cfg {String} toggleGroup The group this toggle button is a member of (only 1 per group can be pressed, only
 * applies if enableToggle = true)
 * @cfg {Boolean/Object} repeat True to repeat fire the click event while the mouse is down. This can also be
  an {@link Ext.util.ClickRepeater} config object (defaults to false).
 * @constructor
 * Create a new button
 * @param {Object} config The config object
 */
class Button extends Component {
    constructor(config) {
        super(config);
        /**
         * Read-only. True if this button is hidden
         * @type Boolean
         */
        this.hidden = false;
        /**
         * Read-only. True if this button is disabled
         * @type Boolean
         */
        this.disabled = false;
        /**
         * Read-only. True if this button is pressed (only if enableToggle = true)
         * @type Boolean
         */
        this.pressed = false;
        /**
         * @cfg {Boolean} enableToggle
         * True to enable pressed/not pressed toggling (defaults to false)
         */
        this.enableToggle = false;
        /**
         * @cfg {String} menuAlign
         * The position to align the menu to (see {@link Ext.Element#alignTo} for more details, defaults to 'tl-bl?').
         */
        this.menuAlign = "tl-bl?";
        /**
         * @cfg {String} type
         * submit, reset or button - defaults to 'button'
         */
        this.type = 'button';
        // private
        this.menuClassTarget = 'tr';
        /**
         * @cfg {String} clickEvent
         * The type of event to map to the button's event handler (defaults to 'click')
         */
        this.clickEvent = 'click';
        /**
         * @cfg {Boolean} handleMouseEvents
         * False to disable visual cues on mouseover, mouseout and mousedown (defaults to true)
         */
        this.handleMouseEvents = true;
        /**
         * @cfg {String} tooltipType
         * The type of tooltip to use. Either "qtip" (default) for QuickTips or "title" for title attribute.
         */
        this.tooltipType = 'qtip';
        this.buttonSelector = "button:first";
        Object.assign(this, config);
        this.addEvents(
            /**
             * @event click
             * Fires when this button is clicked
             * @param {Button} this
             * @param {EventObject} e The click event
             */
            'click',
            /**
             * @event toggle
             * Fires when the "pressed" state of this button changes (only if enableToggle = true)
             * @param {Button} this
             * @param {Boolean} pressed
             */
            'toggle',
            /**
             * @event mouseover
             * Fires when the mouse hovers over the button
             * @param {Button} this
             * @param {Event} e The event object
             */
            'mouseover',
            /**
             * @event mouseout
             * Fires when the mouse exits the button
             * @param {Button} this
             * @param {Event} e The event object
             */
            'mouseout',
            /**
             * @event menushow
             * If this button has a menu, this event fires when it is shown
             * @param {Button} this
             * @param {Menu} menu
             */
            'menushow',
            /**
             * @event menuhide
             * If this button has a menu, this event fires when it is hidden
             * @param {Button} this
             * @param {Menu} menu
             */
            'menuhide',
            /**
             * @event menutriggerover
             * If this button has a menu, this event fires when the mouse enters the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e
             */
            'menutriggerover',
            /**
             * @event menutriggerout
             * If this button has a menu, this event fires when the mouse leaves the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e
             */
            'menutriggerout'
        );
        if (this.menu) {
            this.menu = Ext.menu.MenuMgr.get(this.menu); // TODO MenuMgr
        }
        if (typeof this.toggleGroup === 'string') {
            this.enableToggle = true;
        }
    }

    /**
     * @cfg {Ext.Template} template (Optional)
     * An {@link Ext.Template} with which to create the Button's main element. This Template must
     * contain numeric substitution parameter 0 if it is to display the text property. Changing the template could
     * require code modifications if required elements (e.g. a button) aren't present.
     */
    initComponent() {
        super.initComponent();
    }

    // private
    onRender(ct, position) {
        if (!this.template) {
            if (!Button.buttonTemplate) {
                Button.buttonTemplate = new Ext.Template(
                    '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                    '<td class="x-btn-left"><i>&#160;</i></td>',
                    '<td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td>',
                    '<td class="x-btn-right"><i>&#160;</i></td>',
                    "</tr></tbody></table>"
                );
            }
            this.template = Button.buttonTemplate;
        }
        const targs = [this.text || '&#160;', this.type];
        const btn = position ? this.template.insertBefore(position, targs, true) : this.template.append(ct, targs, true);
        const btnEl = btn.child(this.buttonSelector);
        btnEl.on('focus', this.onFocus, this);
        btnEl.on('blur', this.onBlur, this);
        this.initButtonEl(btn, btnEl);
        if (this.menu) {
            this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
        }
        ButtonToggleMgr.register(this);
    }

    // private
    initButtonEl(btn, btnEl) {
        this.el = btn;
        btn.addClass("x-btn");
        if (this.icon) {
            btnEl.setStyle('background-image', `url(${this.icon})`);
        }
        if (this.iconCls) {
            btnEl.addClass(this.iconCls);
            if (!this.cls) {
                btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
            }
        }
        if (this.tabIndex !== undefined) {
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if (this.tooltip) {
            if (typeof this.tooltip === 'object') {
                Ext.QuickTips.register(Object.assign({ target: btnEl.id }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }
        if (this.pressed) {
            this.el.addClass("x-btn-pressed");
        }
        if (this.handleMouseEvents) {
            btn.on("mouseover", this.onMouseOver, this);
            btn.on("mousedown", this.onMouseDown, this);
        }
        if (this.menu) {
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
        if (this.id) {
            this.el.dom.id = this.el.id = this.id;
        }
        if (this.repeat) {
            const repeater = new Ext.util.ClickRepeater(btn, typeof this.repeat === "object" ? this.repeat : {});
            repeater.on("click", this.onClick, this);
        }
        btn.on(this.clickEvent, this.onClick, this);
    }

    // private
    afterRender() {
        super.afterRender();
        if (Ext.isIE6) {
            this.autoWidth.defer(1, this);
        } else {
            this.autoWidth();
        }
    }

    /**
     * Sets the CSS class that provides a background image to use as the button's icon.  This method also changes
     * the value of the {@link iconCls} config internally.
     * @param {String} cls The CSS class providing the icon image
     */
    setIconClass(cls) {
        if (this.el) {
            this.el.child(this.buttonSelector).replaceClass(this.iconCls, cls);
        }
        this.iconCls = cls;
    }

    // private
    beforeDestroy() {
        if (this.rendered) {
            const btn = this.el.child(this.buttonSelector);
            if (btn) {
                btn.removeAllListeners();
            }
        }
        if (this.menu) {
            Ext.destroy(this.menu);
        }
    }

    // private
    onDestroy() {
        if (this.rendered) {
            ButtonToggleMgr.unregister(this);
        }
    }

    // private
    autoWidth() {
        if (this.el) {
            this.el.setWidth("auto");
            if (Ext.isIE7 && Ext.isStrict) {
                const ib = this.el.child(this.buttonSelector);
                if (ib && ib.getWidth() > 20) {
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width + ib.getFrameWidth('lr'));
                }
            }
            if (this.minWidth && this.el.getWidth() < this.minWidth) {
                this.el.setWidth(this.minWidth);
            }
        }
    }

    /**
     * Assigns this button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} scope (optional) Scope for the function passed in
     */
    setHandler(handler, scope) {
        this.handler = handler;
        this.scope = scope;
    }

    /**
     * Sets this button's text
     * @param {String} text The button text
     */
    setText(text) {
        this.text = text;
        if (this.el) {
            this.el.child("td.x-btn-center " + this.buttonSelector).update(text);
        }
        this.autoWidth();
    }

    /**
     * Gets the text for this button
     * @return {String} The button text
     */
    getText() {
        return this.text;
    }

    /**
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} state (optional) Force a particular state
     */
    toggle(state) {
        state = state === undefined ? !this.pressed : state;
        if (state !== this.pressed) {
            if (state) {
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            } else {
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if (this.toggleHandler) {
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    }

    /**
     * Focus the button
     */
    focus() {
        this.el.child(this.buttonSelector).focus();
    }

    // private
    onDisable() {
        if (this.el) {
            if (!Ext.isIE6 || !this.text) {
                this.el.addClass(this.disabledClass);
            }
            this.el.dom.disabled = true;
        }
        this.disabled = true;
    }

    // private
    onEnable() {
        if (this.el) {
            if (!Ext.isIE6 || !this.text) {
                this.el.removeClass(this.disabledClass);
            }
            this.el.dom.disabled = false;
        }
        this.disabled = false;
    }

    /**
     * Show this button's menu (if it has one)
     */
    showMenu() {
        if (this.menu) {
            this.menu.show(this.el, this.menuAlign);
        }
        return this;
    }

    /**
     * Hide this button's menu (if it has one)
     */
    hideMenu() {
        if (this.menu) {
            this.menu.hide();
        }
        return this;
    }

    /**
     * Returns true if the button has a menu and it is visible
     * @return {Boolean}
     */
    hasVisibleMenu() {
        return this.menu && this.menu.isVisible();
    }

    // private
    onClick(e) {
        if (e) {
            e.preventDefault();
        }
        if (e && e.button !== 0) {
            return;
        }
        if (!this.disabled) {
            if (this.enableToggle && (this.allowDepress !== false || !this.pressed)) {
                this.toggle();
            }
            if (this.menu && !this.menu.isVisible() && !this.ignoreNextClick) {
                this.showMenu();
            }
            this.fireEvent("click", this, e);
            if (this.handler) {
                this.handler.call(this.scope || this, this, e);
            }
        }
    }

    // private
    isMenuTriggerOver(e, internal) {
        return this.menu && !internal;
    }

    // private
    isMenuTriggerOut(e, internal) {
        return this.menu && !internal;
    }

    // private
    onMouseOver(e) {
        if (!this.disabled) {
            const internal = e.within(this.el, true);
            if (!internal) {
                this.el.addClass("x-btn-over");
                Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
                this.fireEvent('mouseover', this, e);
            }
            if (this.isMenuTriggerOver(e, internal)) {
                this.fireEvent('menutriggerover', this, this.menu, e);
            }
        }
    }

    // private
    monitorMouseOver(e) {
        if (e.target !== this.el.dom && !e.within(this.el)) {
            Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
            this.onMouseOut(e);
        }
    }

    // private
    onMouseOut(e) {
        const internal = e.within(this.el) && e.target !== this.el.dom;
        this.el.removeClass("x-btn-over");
        this.fireEvent('mouseout', this, e);
        if (this.isMenuTriggerOut(e, internal)) {
            this.fireEvent('menutriggerout', this, this.menu, e);
        }
    }

    // private
    onFocus() {
        if (!this.disabled) {
            this.el.addClass("x-btn-focus");
        }
    }

    // private
    onBlur() {
        this.el.removeClass("x-btn-focus");
    }

    // private
    getClickEl() {
        return this.el;
    }

    // private
    onMouseDown(e) {
        if (!this.disabled && e.button === 0) {
            this.getClickEl().addClass("x-btn-click");
            Ext.getDoc().on('mouseup', this.onMouseUp, this);
        }
    }

    // private
    onMouseUp(e) {
        if (e && e.button === 0) {
            this.getClickEl().removeClass("x-btn-click");
            Ext.getDoc().un('mouseup', this.onMouseUp, this);
        }
    }

    // private
    onMenuShow() {
        this.ignoreNextClick = 0;
        this.el.addClass("x-btn-menu-active");
        this.fireEvent('menushow', this, this.menu);
    }

    // private
    onMenuHide() {
        this.el.removeClass("x-btn-menu-active");
        this.ignoreNextClick = this.restoreClick.defer(250, this);
        this.fireEvent('menuhide', this, this.menu);
    }

    // private
    restoreClick() {
        this.ignoreNextClick = 0;
    }
}

reg('button', Button);

// Private utility class used by Button
const ButtonToggleMgr = (() => {
    const groups = {};

    function toggleGroup(btn, state) {
        if (state && btn.toggleGroup) {
            const g = groups[btn.toggleGroup];
            if (g) {
                g.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.toggle(false);
                    }
                });
            }
        }
    }

    return {
        register(btn) {
            if (btn.toggleGroup) {
                if (!groups[btn.toggleGroup]) {
                    groups[btn.toggleGroup] = [];
                }
                groups[btn.toggleGroup].push(btn);
                btn.on("toggle", toggleGroup);
            }
        },

        unregister(btn) {
            if (btn.toggleGroup && groups[btn.toggleGroup]) {
                const g = groups[btn.toggleGroup];
                g.splice(g.indexOf(btn), 1);
                btn.un("toggle", toggleGroup);
                if(g.length === 0){
                    delete groups[btn.toggleGroup]
                }
            }
        }
    };
})();

export {  ButtonToggleMgr, Button };
export default Button;