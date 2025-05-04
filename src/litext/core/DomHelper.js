export default DomHelper = (() => {
    let tempTableEl = null;
    const emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
    const tableRe = /^table|tbody|tr|td$/i;

    const createHtml = (o) => {
        if (typeof o === 'string') {
            return o;
        }
        if (Array.isArray(o)) {
            return o.map(createHtml).join('');
        }
        const { tag = 'div', children, cn, html, style, ...attrs } = o;
        let b = `<${tag}`;
        for (const attr in attrs) {
            if (typeof attrs[attr] === 'function') continue;
            if (attr === 'style') {
                let s = style;
                if (typeof s === 'function') {
                    s = s();
                }
                if (typeof s === 'string') {
                    b += ` style="${s}"`;
                } else if (typeof s === 'object') {
                    b += ' style="';
                    for (const key in s) {
                        if (typeof s[key] !== 'function') {
                            b += `<span class="math-inline">\{key\}\:</span>{s[key]};`;
                        }
                    }
                    b += '"';
                }
            } else if (attr === 'cls') {
                b += ` class="${attrs.cls}"`;
            } else if (attr === 'htmlFor') {
                b += ` for="${attrs.htmlFor}"`;
            } else {
                b += ` <span class="math-inline">\{attr\}\="</span>{attrs[attr]}"`;
            }
        }
        if (emptyTags.test(tag)) {
            b += '/>';
        } else {
            b += '>';
            if (children || cn) {
                b += createHtml(children || cn);
            } else if (html) {
                b += html;
            }
            b += `</${tag}>`;
        }
        return b;
    };

    const createDom = (o, parentNode) => {
        let el;
        if (Array.isArray(o)) {
            el = document.createDocumentFragment();
            o.forEach(child => createDom(child, el));
        } else if (typeof o === 'string') {
            el = document.createTextNode(o);
        } else {
            const { tag = 'div', children, cn, html, style, ...attrs } = o;
            el = document.createElement(tag);
            const useSet = !!el.setAttribute;
            for (const attr in attrs) {
                if (typeof attrs[attr] === 'function' || attr === 'style') continue;
                if (attr === 'cls') {
                    el.className = attrs.cls;
                } else {
                    if (useSet) el.setAttribute(attr, attrs[attr]);
                    else el[attr] = attrs[attr];
                }
            }
            DomHelper.applyStyles(el, style);
            if (children || cn) {
                createDom(children || cn, el);
            } else if (html) {
                el.innerHTML = html;
            }
        }
        if (parentNode) {
            parentNode.appendChild(el);
        }
        return el;
    };

    const ieTable = (depth, s, h, e) => {
        tempTableEl.innerHTML = [s, h, e].join('');
        let el = tempTableEl;
        for (let i = 0; i < depth; i++) {
            el = el.firstChild;
        }
        return el;
    };

    const ts = '<table>', te = '</table>', tbs = ts + '<tbody>', tbe = '</tbody>' + te, trs = tbs + '<tr>', tre = '</tr>' + tbe;

    const insertIntoTable = (tag, where, el, html) => {
        if (!tempTableEl) {
            tempTableEl = document.createElement('div');
        }
        let node;
        let before = null;
        if (tag === 'td') {
            if (where === 'afterbegin' || where === 'beforeend') return;
            if (where === 'beforebegin') {
                before = el;
                el = el.parentNode;
            } else {
                before = el.nextSibling;
                el = el.parentNode;
            }
            node = ieTable(4, trs, html, tre);
        } else if (tag === 'tr') {
            if (where === 'beforebegin') {
                before = el;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else if (where === 'afterend') {
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else {
                before = where === 'afterbegin' ? el.firstChild : null;
                node = ieTable(4, trs, html, tre);
            }
        } else if (tag === 'tbody') {
            if (where === 'beforebegin') {
                before = el;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else if (where === 'afterend') {
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else {
                before = where === 'afterbegin' ? el.firstChild : null;
                node = ieTable(3, tbs, html, tbe);
            }
        } else {
            if (where === 'beforebegin' || where === 'afterend') return;
            before = where === 'afterbegin' ? el.firstChild : null;
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    };

    return {
        useDom: false,
    
        markup: (o) => createHtml(o),
    
        applyStyles: (el, styles) => {
            if (!styles) return;
            el = Ext.fly(el);
            if (typeof styles === 'string') {
                const re = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
                let matches;
                while ((matches = re.exec(styles)) != null) {
                    el.setStyle(matches[1], matches[2]);
                }
            } else if (typeof styles === 'object') {
                Object.entries(styles).forEach(([style, value]) => el.setStyle(style, value));
            } else if (typeof styles === 'function') {
                DomHelper.applyStyles(el, styles());
            }
        },
    
        insertHtml: (where, el, html) => {
            where = where.toLowerCase();
            if (el.insertAdjacentHTML) {
                if (tableRe.test(el.tagName)) {
                    const rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html);
                    if (rs) return rs;
                }
                switch (where) {
                    case 'beforebegin': el.insertAdjacentHTML('BeforeBegin', html); return el.previousSibling;
                    case 'afterbegin': el.insertAdjacentHTML('AfterBegin', html); return el.firstChild;
                    case 'beforeend': el.insertAdjacentHTML('BeforeEnd', html); return el.lastChild;
                    case 'afterend': el.insertAdjacentHTML('AfterEnd', html); return el.nextSibling;
                }
                throw `Illegal insertion point -> "${where}"`;
            }
            const range = el.ownerDocument.createRange();
            let frag;
            switch (where) {
                case 'beforebegin': range.setStartBefore(el); frag = range.createContextualFragment(html); el.parentNode.insertBefore(frag, el); return el.previousSibling;
                case 'afterbegin':
                    if (el.firstChild) { range.setStartBefore(el.firstChild); frag = range.createContextualFragment(html); el.insertBefore(frag, el.firstChild); return el.firstChild; }
                    el.innerHTML = html; return el.firstChild;
                case 'beforeend':
                    if (el.lastChild) { range.setStartAfter(el.lastChild); frag = range.createContextualFragment(html); el.appendChild(frag); return el.lastChild; }
                    el.innerHTML = html; return el.lastChild;
                case 'afterend': range.setStartAfter(el); frag = range.createContextualFragment(html); el.parentNode.insertBefore(frag, el.nextSibling); return el.nextSibling;
            }
            throw `Illegal insertion point -> "${where}"`;
        },
    
        insertBefore: (el, o, returnElement) => DomHelper.doInsert(el, o, returnElement, 'beforeBegin'),
        insertAfter: (el, o, returnElement) => DomHelper.doInsert(el, o, returnElement, 'afterEnd', 'nextSibling'),
        insertFirst: (el, o, returnElement) => DomHelper.doInsert(el, o, returnElement, 'afterBegin', 'firstChild'),
    
        doInsert: (el, o, returnElement, pos, sibling) => {
            el = Ext.getDom(el);
            const newNode = DomHelper.useDom ? createDom(o, null) : DomHelper.insertHtml(pos, el, createHtml(o));
            (sibling === 'firstChild' ? el : el.parentNode).insertBefore(newNode, sibling ? el[sibling] : el);
            return returnElement ? Ext.get(newNode, true) : newNode;
        },
    
        append: (el, o, returnElement) => {
            el = Ext.getDom(el);
            const newNode = DomHelper.useDom ? createDom(o, null) : DomHelper.insertHtml('beforeend', el, createHtml(o));
            el.appendChild(newNode);
            return returnElement ? Ext.get(newNode, true) : newNode;
        },
    
        overwrite: (el, o, returnElement) => {
            el = Ext.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
        },
    
        createTemplate: (o) => new Ext.Template(createHtml(o)),
    }
})();
