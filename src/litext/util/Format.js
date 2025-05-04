export default Format = (() => {
    const trimRe = /^\s+|\s+$/g;
    const stripTagsRe = /<\/?[^>]+>/gi;
    const stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/gi;

    return {
        ellipsis: (value, len) => {
            if (value && value.length > len) {
                return value.substring(0, len - 3) + "...";
            }
            return value;
        },

        undef: (value) => {
            return value !== undefined ? value : "";
        },

        defaultValue: (value, defaultValue = "") => {
            return value !== undefined && value !== "" ? value : defaultValue;
        },

        htmlEncode: (value) => {
            return value ? String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") : value;
        },

        htmlDecode: (value) => {
            return value ? String(value).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"') : value;
        },

        trim: (value) => {
            return String(value).replace(trimRe, "");
        },

        substr: (value, start, length) => {
            return String(value).substring(start, start + length);
        },

        lowercase: (value) => {
            return String(value).toLowerCase();
        },

        uppercase: (value) => {
            return String(value).toUpperCase();
        },

        capitalize: (value) => {
            return value ? value.charAt(0).toUpperCase() + value.substring(1).toLowerCase() : value;
        },

        call: (value, fn, ...args) => {
            if (args.length > 0) {
                return window[fn](value, ...args);
            } else {
                return window[fn](value);
            }
        },

        usMoney: (v) => {
            v = Math.round((v - 0) * 100) / 100;
            v = v === Math.floor(v) ? v + ".00" : (v * 10 === Math.floor(v * 10) ? v + "0" : v);
            v = String(v);
            const ps = v.split('.');
            let whole = ps[0];
            const sub = ps[1] ? '.' + ps[1] : '.00';
            const r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, '$1,$2');
            }
            v = whole + sub;
            return v.charAt(0) === '-' ? `-$${v.substring(1)}` : `$${v}`;
        },

        date: (v, format = "m/d/Y") => {
            if (!v) {
                return "";
            }
            const date = Ext.isDate(v) ? v : new Date(Date.parse(v));
            return date.dateFormat(format);
        },

        dateRenderer: (format) => {
            return (v) => Ext.util.Format.date(v, format);
        },

        stripTags: (v) => {
            return v ? String(v).replace(stripTagsRe, "") : v;
        },

        stripScripts: (v) => {
            return v ? String(v).replace(stripScriptsRe, "") : v;
        },

        fileSize: (size) => {
            if (size < 1024) {
                return `${size} bytes`;
            } else if (size < 1048576) {
                return `${Math.round((size * 10) / 1024) / 10} KB`;
            } else {
                return `${Math.round((size * 10) / 1048576) / 10} MB`;
            }
        },

        math: (() => {
            const fns = {};
            return (v, a) => {
                if (!fns[a]) {
                    fns[a] = new Function('v', `return v ${a};`);
                }
                return fns[a](v);
            };
        })()
    };
})();