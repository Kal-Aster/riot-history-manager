(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('riot')) :
    typeof define === 'function' && define.amd ? define(['exports', 'riot'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.riotHistoryManager = {}, global.riot));
}(this, (function (exports, riot) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var riot__namespace = /*#__PURE__*/_interopNamespace(riot);

    var loadingBar = document.body.appendChild(document.createElement("div"));
    var loadingBarContainer = document.body.appendChild(document.createElement("div"));
    loadingBarContainer.setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 999999; background: rgba(250, 120, 30, .5); display: none;");
    loadingBar = loadingBarContainer.appendChild(document.createElement("div"));
    loadingBar.setAttribute("style", "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;");
    var actualClaimedBy = null;
    var nextFrame = -1;
    var loadingProgress = 0;
    var loadingDone = false;
    var progressVel = function (progress) {
        return (8192 - (1.08 * progress * progress)) / 819.2;
    };
    var visibilityTime = 300;
    var doneTime = visibilityTime;
    var claimedWhenVisible = 0;
    function dispatchRouterLoad() {
        document.dispatchEvent(new Event("routerload", { bubbles: true, cancelable: false }));
    }
    function startLoading() {
        if (nextFrame) {
            cancelAnimationFrame(nextFrame);
        }
        var lastTime;
        var eventDispatched = false;
        var step = function () {
            nextFrame = -1;
            if (loadingDone && loadingProgress === 5 && claimedWhenVisible === 5) {
                loadingProgress = 100;
                loadingBarContainer.style.display = "none";
                dispatchRouterLoad();
                return;
            }
            var last = lastTime;
            var delta = ((lastTime = Date.now()) - last);
            if (loadingProgress >= 100) {
                if (!eventDispatched) {
                    dispatchRouterLoad();
                    eventDispatched = true;
                }
                if ((doneTime -= delta) <= 0) {
                    doneTime = visibilityTime;
                    loadingBarContainer.style.display = "none";
                }
                else {
                    requestAnimationFrame(step);
                }
                return;
            }
            if (loadingDone) {
                loadingProgress += delta / 2;
            }
            else {
                loadingProgress += delta * progressVel(loadingProgress) / 100;
            }
            loadingBar.style.transform = "scaleX(" + (loadingProgress / 100) + ")";
            nextFrame = requestAnimationFrame(step);
        };
        loadingBarContainer.style.display = "block";
        lastTime = Date.now();
        step();
    }
    function claim(claimer) {
        if (claimer == null) {
            return;
        }
        actualClaimedBy = claimer;
        claimedWhenVisible = loadingBarContainer.style.display === "block" ? loadingProgress : 5;
        loadingProgress = 5;
        loadingDone = false;
        startLoading();
    }
    function claimedBy(claimer) {
        return claimer != null && claimer === actualClaimedBy;
    }
    var claimed = claimedBy;
    function release(claimer) {
        if (claimer == null || actualClaimedBy !== claimer) {
            return;
        }
        loadingDone = true;
    }
    function isLoading() {
        return nextFrame !== -1;
    }
    var rgbRegex = /^\s*rgb\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)\s*$/;
    var shortHexRegex = /^\s*#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\s*$/;
    var hexRegex = /^\s*#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\s*$/;
    function applyColor(r, g, b) {
        loadingBar.style.background = "rgb(" + r + "," + g + "," + b + ")";
        loadingBarContainer.style.background = "rgb(" + r + "," + g + "," + b + ",0.5)";
    }
    function setColor(color) {
        if (typeof color !== "string") {
            throw new TypeError("color must be string");
        }
        var match = color.match(rgbRegex);
        if (match != null) {
            var r = parseFloat(match[1]);
            var g = parseFloat(match[2]);
            var b = parseFloat(match[3]);
            if (r > 255 || g > 255 || b > 255) {
                throw new TypeError("invalid color rgb arguments");
            }
            applyColor(r, g, b);
            return;
        }
        match = color.match(shortHexRegex);
        if (match != null) {
            color = "#" + match[1].repeat(2) + match[2].repeat(2) + match[3].repeat(2);
        }
        match = color.match(hexRegex);
        if (match != null) {
            var r = parseInt(match[1], 16);
            var g = parseInt(match[2], 16);
            var b = parseInt(match[3], 16);
            applyColor(r, g, b);
            return;
        }
        throw new TypeError("invalid color format");
    }

    var loadingBar$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        claim: claim,
        claimedBy: claimedBy,
        claimed: claimed,
        release: release,
        isLoading: isLoading,
        setColor: setColor
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /**
     * Tokenize input string.
     */
    function lexer(str) {
        var tokens = [];
        var i = 0;
        while (i < str.length) {
            var char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                var name = "";
                var j = i + 1;
                while (j < str.length) {
                    var code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError("Missing parameter name at " + i);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                var count = 1;
                var pattern = "";
                var j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError("Pattern cannot start with \"?\" at " + j);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError("Capturing groups are not allowed at " + j);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError("Unbalanced pattern at " + i);
                if (!pattern)
                    throw new TypeError("Missing pattern at " + i);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options) {
        if (options === void 0) { options = {}; }
        var tokens = lexer(str);
        var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
        var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
        var result = [];
        var key = 0;
        var i = 0;
        var path = "";
        var tryConsume = function (type) {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        var mustConsume = function (type) {
            var value = tryConsume(type);
            if (value !== undefined)
                return value;
            var _a = tokens[i], nextType = _a.type, index = _a.index;
            throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
        };
        var consumeText = function () {
            var result = "";
            var value;
            // tslint:disable-next-line
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            var char = tryConsume("CHAR");
            var name = tryConsume("NAME");
            var pattern = tryConsume("PATTERN");
            if (name || pattern) {
                var prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix: prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            var value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            var open = tryConsume("OPEN");
            if (open) {
                var prefix = consumeText();
                var name_1 = tryConsume("NAME") || "";
                var pattern_1 = tryConsume("PATTERN") || "";
                var suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name_1 || (pattern_1 ? key++ : ""),
                    pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                    prefix: prefix,
                    suffix: suffix,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        var index = 0;
        var execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                // Use parenthesized substring match if available, index otherwise
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
        return new RegExp("(?:" + parts.join("|") + ")", flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options) {
        if (options === void 0) { options = {}; }
        var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
        var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
        var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
        var route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                var prefix = escapeString(encode(token.prefix));
                var suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            var mod = token.modifier === "*" ? "?" : "";
                            route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                        }
                        else {
                            route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                        }
                    }
                    else {
                        route += "(" + token.pattern + ")" + token.modifier;
                    }
                }
                else {
                    route += "(?:" + prefix + suffix + ")" + token.modifier;
                }
            }
        }
        if (end) {
            if (!strict)
                route += delimiter + "?";
            route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
        }
        else {
            var endToken = tokens[tokens.length - 1];
            var isEndDelimited = typeof endToken === "string"
                ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
                : // tslint:disable-next-line
                    endToken === undefined;
            if (!strict) {
                route += "(?:" + delimiter + "(?=" + endsWith + "))?";
            }
            if (!isEndDelimited) {
                route += "(?=" + delimiter + "|" + endsWith + ")";
            }
        }
        return new RegExp(route, flags(options));
    }
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }

    var LEADING_DELIMITER = /^[\\\/]+/;
    var TRAILING_DELIMITER = /[\\\/]+$/;
    var DELIMITER_NOT_IN_PARENTHESES = /[\\\/]+(?![^(]*[)])/g;
    function prepare(path) {
        return path.replace(LEADING_DELIMITER, "").replace(TRAILING_DELIMITER, "").replace(DELIMITER_NOT_IN_PARENTHESES, "/");
    }
    function generate(path, keys) {
        if (Array.isArray(path)) {
            path.map(function (value) {
                if (typeof value === "string") {
                    return prepare(value);
                }
                return value;
            });
        }
        if (typeof path === "string") {
            path = prepare(path);
        }
        return pathToRegexp(path, keys);
    }

    var ContextManager = (function () {
        function ContextManager() {
            this._contexts = new Map();
            this._hrefs = [];
            this._index = -1;
            this._length = 0;
        }
        ContextManager.prototype.clean = function () {
            if (this._index < this._length - 1) {
                var index_1 = this._index;
                var newHREFs_1 = [];
                this._hrefs.some(function (c_hrefs) {
                    var newCHrefs = [];
                    var result = c_hrefs[1].some(function (href) {
                        if (index_1-- >= 0) {
                            newCHrefs.push(href);
                            return false;
                        }
                        return true;
                    });
                    if (newCHrefs.length) {
                        newHREFs_1.push([c_hrefs[0], newCHrefs]);
                    }
                    return result;
                });
                this._hrefs = newHREFs_1;
                this._length = this._index + 1;
            }
        };
        ContextManager.prototype.currentContext = function () {
            if (this._hrefs.length === 0) {
                return null;
            }
            var index = this._index;
            var context;
            if (this._hrefs.some(function (_a) {
                var _b = __read(_a, 2), c = _b[0], hrefs = _b[1];
                context = c;
                index -= hrefs.length;
                return index < 0;
            })) {
                return context;
            }
            return null;
        };
        ContextManager.prototype.contextOf = function (href, skipFallback) {
            var e_1, _a;
            if (skipFallback === void 0) { skipFallback = true; }
            var foundContext = null;
            href = href.split("#")[0].split("?")[0];
            try {
                for (var _b = __values(this._contexts.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), context = _d[0], _e = __read(_d[1], 1), hrefs = _e[0];
                    if (hrefs.some(function (c_href) {
                        if (c_href.fallback && skipFallback) {
                            return false;
                        }
                        return c_href.path.test(href);
                    })) {
                        foundContext = context;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return foundContext;
        };
        ContextManager.prototype.insert = function (href, replace) {
            if (replace === void 0) { replace = false; }
            this.clean();
            var foundContext = this.contextOf(href, this._length > 0);
            var previousContext = this._hrefs.length > 0 ? this._hrefs[this._hrefs.length - 1] : null;
            if (foundContext == null) {
                if (this._hrefs.length > 0) {
                    this._hrefs[this._hrefs.length - 1][1].push(href);
                    this._length++;
                    this._index++;
                }
            }
            else {
                var i_1 = -1;
                if (this._hrefs.some(function (c_hrefs, index) {
                    if (c_hrefs[0] === foundContext) {
                        i_1 = index;
                        return true;
                    }
                    return false;
                })) {
                    var c_hrefs = this._hrefs.splice(i_1, 1)[0];
                    if (href !== c_hrefs[1][c_hrefs[1].length - 1]) {
                        c_hrefs[1].push(href);
                        this._length++;
                        this._index++;
                    }
                    this._hrefs.push(c_hrefs);
                }
                else {
                    this._hrefs.push([foundContext, [href]]);
                    this._length++;
                    this._index++;
                }
            }
            if (replace && this._hrefs.length > 0) {
                var lastContext = this._hrefs[this._hrefs.length - 1];
                if (lastContext === previousContext) {
                    if (lastContext[1].length > 1) {
                        do {
                            lastContext[1].splice(-2, 1);
                            this._length--;
                            this._index--;
                        } while (lastContext[1].length > 1 &&
                            lastContext[1][lastContext[1].length - 2] === href);
                    }
                }
                else if (previousContext != null) {
                    previousContext[1].splice(-1, 1);
                    this._length--;
                    this._index--;
                }
            }
        };
        ContextManager.prototype.goBackward = function () {
            this._index = Math.max(--this._index, 0);
            return this.get();
        };
        ContextManager.prototype.goForward = function () {
            this._index = Math.min(++this._index, this._length - 1);
            return this.get();
        };
        ContextManager.prototype.get = function (index) {
            if (index === void 0) { index = this._index; }
            var href;
            if (this._hrefs.some(function (_a) {
                var _b = __read(_a, 2); _b[0]; var hrefs = _b[1];
                var length = hrefs.length;
                if (index >= length) {
                    index -= length;
                    return false;
                }
                href = hrefs[index];
                return true;
            })) {
                return href;
            }
            return null;
        };
        ContextManager.prototype.index = function (value) {
            if (value === void 0) {
                return this._index;
            }
            value = parseInt(value, 10);
            if (isNaN(value)) {
                throw new Error("value must be a number");
            }
            this._index = value;
        };
        ContextManager.prototype.length = function () {
            return this._length;
        };
        ContextManager.prototype.getContextNames = function () {
            return Array.from(this._contexts.keys());
        };
        ContextManager.prototype.getDefaultOf = function (context) {
            var c = this._contexts.get(context);
            if (!c) {
                return null;
            }
            var href = c[1];
            if (href == null) {
                return null;
            }
            return href;
        };
        ContextManager.prototype.restore = function (context) {
            var _this = this;
            var tmpHREFs = this._hrefs;
            this.clean();
            if (this._hrefs.length) {
                var lastContext = this._hrefs[this._hrefs.length - 1];
                if (lastContext[0] === context) {
                    var path = this._contexts.get(context)[1] || lastContext[1][0];
                    var numPages = lastContext[1].splice(1).length;
                    this._length -= numPages;
                    this._index -= numPages;
                    lastContext[1][0] = path;
                    return true;
                }
            }
            if (!this._hrefs.some(function (c, i) {
                if (c[0] === context) {
                    if (i < _this._hrefs.length - 1) {
                        _this._hrefs.push(_this._hrefs.splice(i, 1)[0]);
                    }
                    return true;
                }
                return false;
            })) {
                var c = this._contexts.get(context);
                if (c == null) {
                    this._hrefs = tmpHREFs;
                    return false;
                }
                var href = c[1];
                if (href != null) {
                    this.insert(href);
                    return true;
                }
                return false;
            }
            return true;
        };
        ContextManager.prototype.addContextPath = function (context_name, path, fallback) {
            if (fallback === void 0) { fallback = false; }
            var pathRegexp = generate(path);
            var context = this._contexts.get(context_name);
            if (context == null) {
                this._contexts.set(context_name, context = [[], null]);
            }
            context[0].push({
                path: pathRegexp,
                fallback: fallback
            });
            return pathRegexp;
        };
        ContextManager.prototype.setContextDefaultHref = function (context_name, href) {
            var context = this._contexts.get(context_name);
            if (context == null) {
                this._contexts.set(context_name, context = [[], null]);
            }
            context[1] = href;
        };
        ContextManager.prototype.setContext = function (context) {
            var _this = this;
            context.paths.forEach(function (path) {
                _this.addContextPath(context.name, path.path, path.fallback);
            });
            if (context.default !== undefined) {
                this.setContextDefaultHref(context.name, context.default);
            }
        };
        ContextManager.prototype.hrefs = function () {
            var hrefs = [];
            this._hrefs.forEach(function (_a) {
                var _b = __read(_a, 2); _b[0]; var c_hrefs = _b[1];
                hrefs.push.apply(hrefs, c_hrefs);
            });
            return hrefs;
        };
        return ContextManager;
    }());

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return decodeURIComponent(components.join(''));
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher);

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher);
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    var filterObj = function (obj, predicate) {
    	var ret = {};
    	var keys = Object.keys(obj);
    	var isArr = Array.isArray(predicate);

    	for (var i = 0; i < keys.length; i++) {
    		var key = keys[i];
    		var val = obj[key];

    		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
    			ret[key] = val;
    		}
    	}

    	return ret;
    };

    var queryString = createCommonjsModule(function (module, exports) {





    const isNullOrUndefined = value => value === null || value === undefined;

    function encoderForArrayFormat(options) {
    	switch (options.arrayFormat) {
    		case 'index':
    			return key => (result, value) => {
    				const index = result.length;

    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[', index, ']'].join('')];
    				}

    				return [
    					...result,
    					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    				];
    			};

    		case 'bracket':
    			return key => (result, value) => {
    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[]'].join('')];
    				}

    				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    			};

    		case 'comma':
    		case 'separator':
    			return key => (result, value) => {
    				if (value === null || value === undefined || value.length === 0) {
    					return result;
    				}

    				if (result.length === 0) {
    					return [[encode(key, options), '=', encode(value, options)].join('')];
    				}

    				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
    			};

    		default:
    			return key => (result, value) => {
    				if (
    					value === undefined ||
    					(options.skipNull && value === null) ||
    					(options.skipEmptyString && value === '')
    				) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, encode(key, options)];
    				}

    				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    			};
    	}
    }

    function parserForArrayFormat(options) {
    	let result;

    	switch (options.arrayFormat) {
    		case 'index':
    			return (key, value, accumulator) => {
    				result = /\[(\d*)\]$/.exec(key);

    				key = key.replace(/\[\d*\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = {};
    				}

    				accumulator[key][result[1]] = value;
    			};

    		case 'bracket':
    			return (key, value, accumulator) => {
    				result = /(\[\])$/.exec(key);
    				key = key.replace(/\[\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = [value];
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};

    		case 'comma':
    		case 'separator':
    			return (key, value, accumulator) => {
    				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
    				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
    				value = isEncodedArray ? decode(value, options) : value;
    				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
    				accumulator[key] = newValue;
    			};

    		default:
    			return (key, value, accumulator) => {
    				if (accumulator[key] === undefined) {
    					accumulator[key] = value;
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};
    	}
    }

    function validateArrayFormatSeparator(value) {
    	if (typeof value !== 'string' || value.length !== 1) {
    		throw new TypeError('arrayFormatSeparator must be single character string');
    	}
    }

    function encode(value, options) {
    	if (options.encode) {
    		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    function decode(value, options) {
    	if (options.decode) {
    		return decodeUriComponent(value);
    	}

    	return value;
    }

    function keysSorter(input) {
    	if (Array.isArray(input)) {
    		return input.sort();
    	}

    	if (typeof input === 'object') {
    		return keysSorter(Object.keys(input))
    			.sort((a, b) => Number(a) - Number(b))
    			.map(key => input[key]);
    	}

    	return input;
    }

    function removeHash(input) {
    	const hashStart = input.indexOf('#');
    	if (hashStart !== -1) {
    		input = input.slice(0, hashStart);
    	}

    	return input;
    }

    function getHash(url) {
    	let hash = '';
    	const hashStart = url.indexOf('#');
    	if (hashStart !== -1) {
    		hash = url.slice(hashStart);
    	}

    	return hash;
    }

    function extract(input) {
    	input = removeHash(input);
    	const queryStart = input.indexOf('?');
    	if (queryStart === -1) {
    		return '';
    	}

    	return input.slice(queryStart + 1);
    }

    function parseValue(value, options) {
    	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
    		value = Number(value);
    	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    		value = value.toLowerCase() === 'true';
    	}

    	return value;
    }

    function parse(query, options) {
    	options = Object.assign({
    		decode: true,
    		sort: true,
    		arrayFormat: 'none',
    		arrayFormatSeparator: ',',
    		parseNumbers: false,
    		parseBooleans: false
    	}, options);

    	validateArrayFormatSeparator(options.arrayFormatSeparator);

    	const formatter = parserForArrayFormat(options);

    	// Create an object with no prototype
    	const ret = Object.create(null);

    	if (typeof query !== 'string') {
    		return ret;
    	}

    	query = query.trim().replace(/^[?#&]/, '');

    	if (!query) {
    		return ret;
    	}

    	for (const param of query.split('&')) {
    		if (param === '') {
    			continue;
    		}

    		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

    		// Missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
    		formatter(decode(key, options), value, ret);
    	}

    	for (const key of Object.keys(ret)) {
    		const value = ret[key];
    		if (typeof value === 'object' && value !== null) {
    			for (const k of Object.keys(value)) {
    				value[k] = parseValue(value[k], options);
    			}
    		} else {
    			ret[key] = parseValue(value, options);
    		}
    	}

    	if (options.sort === false) {
    		return ret;
    	}

    	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
    		const value = ret[key];
    		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    			// Sort object keys, not values
    			result[key] = keysSorter(value);
    		} else {
    			result[key] = value;
    		}

    		return result;
    	}, Object.create(null));
    }

    exports.extract = extract;
    exports.parse = parse;

    exports.stringify = (object, options) => {
    	if (!object) {
    		return '';
    	}

    	options = Object.assign({
    		encode: true,
    		strict: true,
    		arrayFormat: 'none',
    		arrayFormatSeparator: ','
    	}, options);

    	validateArrayFormatSeparator(options.arrayFormatSeparator);

    	const shouldFilter = key => (
    		(options.skipNull && isNullOrUndefined(object[key])) ||
    		(options.skipEmptyString && object[key] === '')
    	);

    	const formatter = encoderForArrayFormat(options);

    	const objectCopy = {};

    	for (const key of Object.keys(object)) {
    		if (!shouldFilter(key)) {
    			objectCopy[key] = object[key];
    		}
    	}

    	const keys = Object.keys(objectCopy);

    	if (options.sort !== false) {
    		keys.sort(options.sort);
    	}

    	return keys.map(key => {
    		const value = object[key];

    		if (value === undefined) {
    			return '';
    		}

    		if (value === null) {
    			return encode(key, options);
    		}

    		if (Array.isArray(value)) {
    			return value
    				.reduce(formatter(key), [])
    				.join('&');
    		}

    		return encode(key, options) + '=' + encode(value, options);
    	}).filter(x => x.length > 0).join('&');
    };

    exports.parseUrl = (url, options) => {
    	options = Object.assign({
    		decode: true
    	}, options);

    	const [url_, hash] = splitOnFirst(url, '#');

    	return Object.assign(
    		{
    			url: url_.split('?')[0] || '',
    			query: parse(extract(url), options)
    		},
    		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
    	);
    };

    exports.stringifyUrl = (object, options) => {
    	options = Object.assign({
    		encode: true,
    		strict: true
    	}, options);

    	const url = removeHash(object.url).split('?')[0] || '';
    	const queryFromUrl = exports.extract(object.url);
    	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

    	const query = Object.assign(parsedQueryFromUrl, object.query);
    	let queryString = exports.stringify(query, options);
    	if (queryString) {
    		queryString = `?${queryString}`;
    	}

    	let hash = getHash(object.url);
    	if (object.fragmentIdentifier) {
    		hash = `#${encode(object.fragmentIdentifier, options)}`;
    	}

    	return `${url}${queryString}${hash}`;
    };

    exports.pick = (input, filter, options) => {
    	options = Object.assign({
    		parseFragmentIdentifier: true
    	}, options);

    	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
    	return exports.stringifyUrl({
    		url,
    		query: filterObj(query, filter),
    		fragmentIdentifier
    	}, options);
    };

    exports.exclude = (input, filter, options) => {
    	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

    	return exports.pick(input, exclusionFilter, options);
    };
    });

    var DIVIDER = "#R!:";
    var catchPopState$2 = null;
    window.addEventListener("popstate", function (event) {
        if (catchPopState$2 == null) {
            return;
        }
        event.stopImmediatePropagation();
        event.stopPropagation();
        catchPopState$2();
    }, true);
    function onCatchPopState$2(onCatchPopState, once) {
        if (once === void 0) { once = false; }
        if (once) {
            var tmpOnCatchPopState_1 = onCatchPopState;
            onCatchPopState = function () {
                catchPopState$2 = null;
                tmpOnCatchPopState_1();
            };
        }
        catchPopState$2 = onCatchPopState;
    }
    function goTo$1(href, replace) {
        if (replace === void 0) { replace = false; }
        return new Promise(function (resolve) {
            if (href === window.location.href) {
                return resolve();
            }
            onCatchPopState$2(resolve, true);
            if (href[0] === "#") {
                if (replace) {
                    window.location.replace(href);
                }
                else {
                    window.location.assign(href);
                }
            }
            else {
                if (replace) {
                    window.history.replaceState({}, "", href);
                }
                else {
                    window.history.pushState({}, "", href);
                }
                window.dispatchEvent(new Event("popstate"));
            }
        });
    }
    function splitHref(href) {
        if (href === void 0) { href = window.location.href; }
        var splitted = href.split(DIVIDER);
        if (splitted.length > 2) {
            return [
                splitted.slice(0, splitted.length - 1).join(DIVIDER),
                splitted[splitted.length - 1]
            ];
        }
        return [splitted[0], splitted[1] || ""];
    }
    function optsToStr(opts) {
        var filteredOpts = {};
        Object.entries(opts).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            if (value !== undefined) {
                filteredOpts[key] = value;
            }
        });
        return queryString.stringify(filteredOpts);
    }
    function get$1() {
        return queryString.parse(splitHref()[1]);
    }
    function set(opts) {
        var newHref = splitHref()[0] + DIVIDER + optsToStr(opts);
        return goTo$1(newHref, true);
    }
    function goWith(href, opts, replace) {
        if (replace === void 0) { replace = false; }
        var newHref = splitHref(href)[0] + DIVIDER + optsToStr(opts);
        return goTo$1(newHref, replace);
    }
    function clearHref() {
        return splitHref()[0];
    }
    if (Object.keys(get$1()).length > 0) {
        set({});
    }

    var BASE = "#";
    var LOCATION_BASE = window.location.protocol + "//" + window.location.host + (window.location.port ? ":" + window.location.port : "");
    var LOCATION_PATHNAME = window.location.pathname;
    function getLocation$1() {
        return LOCATION_BASE + (BASE[0] === "#" ? LOCATION_PATHNAME : "");
    }
    var parenthesesRegex = /[\\\/]+/g;
    function base(value) {
        if (value != null) {
            if (typeof value !== "string") {
                throw new TypeError("invalid base value");
            }
            value += "/";
            value.replace(parenthesesRegex, "/");
            if (value[0] !== "#" && value[0] !== "/") {
                value = "/" + value;
            }
            if (value[0] === "/" && !window.history.pushState) {
                value = "#" + value;
            }
            BASE = value;
        }
        return BASE;
    }
    function get() {
        var LOCATION = getLocation$1();
        return prepare(clearHref().split(LOCATION).slice(1).join(LOCATION).split(BASE).slice(1).join(BASE));
    }
    function construct(href, full) {
        if (full === void 0) { full = false; }
        switch (href[0]) {
            case "?": {
                href = get().split("?")[0] + href;
                break;
            }
            case "#": {
                href = get().split("#")[0] + href;
                break;
            }
        }
        return (full ? getLocation$1() : "") +
            (BASE + "/" + href).replace(parenthesesRegex, "/");
    }

    var URLManager = /*#__PURE__*/Object.freeze({
        __proto__: null,
        base: base,
        get: get,
        construct: construct
    });

    var started = false;
    var historyManaged = null;
    var works = [];
    var onworkfinished = [];
    function onWorkFinished(callback, context) {
        if (works.length === 0) {
            callback.call(context || null);
            return;
        }
        onworkfinished.push([callback, context || null]);
    }
    function createWork(locking) {
        if (locking === void 0) { locking = false; }
        var finished = false;
        var finishing = false;
        var work = {
            get locking() {
                return locking;
            },
            get finished() {
                return finished;
            },
            get finishing() {
                return finishing;
            },
            finish: function () {
                if (finished) {
                    return;
                }
                finished = true;
                finishing = false;
                var i = works.length - 1;
                for (; i >= 0; i--) {
                    if (works[i] === work) {
                        works.splice(i, 1);
                        break;
                    }
                }
                if (i >= 0 && works.length === 0) {
                    while (onworkfinished.length > 0 && works.length === 0) {
                        var _a = __read(onworkfinished.shift(), 2), callback = _a[0], context = _a[1];
                        callback.call(context || window);
                    }
                }
            },
            beginFinish: function () {
                finishing = true;
            },
            askFinish: function () {
                return false;
            }
        };
        works.push(work);
        return work;
    }
    function acquire() {
        var lock = createWork(true);
        return lock;
    }
    function isLocked$1() {
        return works.some(function (w) { return w.locking; });
    }
    var catchPopState$1 = null;
    window.addEventListener("popstate", function (event) {
        if (!started || isLocked$1()) {
            return;
        }
        if (catchPopState$1 == null) {
            handlePopState$1();
            return;
        }
        event.stopImmediatePropagation();
        catchPopState$1();
    }, true);
    function onCatchPopState$1(onCatchPopState, once) {
        if (once === void 0) { once = false; }
        if (once) {
            var tmpOnCatchPopState_1 = onCatchPopState;
            onCatchPopState = function () {
                catchPopState$1 = null;
                tmpOnCatchPopState_1();
            };
        }
        catchPopState$1 = onCatchPopState;
    }
    function goTo(href, replace) {
        if (replace === void 0) { replace = false; }
        var fullHref = construct(href, true);
        href = construct(href);
        if (window.location.href === fullHref) {
            window.dispatchEvent(new Event("popstate"));
            return;
        }
        if (href[0] === "#") {
            if (replace) {
                window.location.replace(href);
            }
            else {
                window.location.assign(href);
            }
        }
        else {
            if (replace) {
                window.history.replaceState({}, "", href);
            }
            else {
                window.history.pushState({}, "", href);
            }
            window.dispatchEvent(new Event("popstate"));
        }
    }
    function addFront(frontHref) {
        if (frontHref === void 0) { frontHref = "next"; }
        var href = get();
        var work = createWork();
        return new Promise(function (resolve) {
            goWith(construct(frontHref, true), { back: undefined, front: null })
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                window.history.go(-1);
            }); })
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                goTo(href, true);
            }); })
                .then(function () {
                work.finish();
                resolve();
            });
        });
    }
    function addBack(backHref) {
        if (backHref === void 0) { backHref = ""; }
        var href = get();
        var work = createWork();
        return new Promise(function (resolve) {
            (new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                window.history.go(-1);
            }))
                .then(function () { return new Promise(function (resolve) {
                if (backHref) {
                    onCatchPopState$1(resolve, true);
                    goTo(backHref, true);
                }
                else {
                    resolve();
                }
            }); })
                .then(function () { return set({ back: null, front: undefined }); })
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                goTo(href);
            }); })
                .then(function () {
                work.finish();
                resolve();
            });
        });
    }
    var hasBack = false;
    var contextManager = new ContextManager();
    function index$1() {
        return contextManager.index();
    }
    function getHREFAt(index) {
        return contextManager.get(index);
    }
    function setContext$1(context) {
        if (historyManaged === null) {
            historyManaged = true;
        }
        return contextManager.setContext(context);
    }
    function addContextPath$1(context, href, isFallback) {
        if (isFallback === void 0) { isFallback = false; }
        if (historyManaged === null) {
            historyManaged = true;
        }
        return contextManager.addContextPath(context, href, isFallback);
    }
    function setContextDefaultHref$1(context, href) {
        if (historyManaged === null) {
            historyManaged = true;
        }
        return contextManager.setContextDefaultHref(context, href);
    }
    function getContextDefaultOf$1(context) {
        return contextManager.getDefaultOf(context);
    }
    function getContext$1(href) {
        if (href === void 0) { href = null; }
        if (href == null) {
            return contextManager.currentContext();
        }
        return contextManager.contextOf(href);
    }
    function tryUnlock() {
        var locksAsked = 0;
        for (var i = works.length - 1; i >= 0; i--) {
            var work = works[i];
            if (work.locking && !work.finishing) {
                if (!work.askFinish()) {
                    return -1;
                }
                locksAsked++;
            }
        }
        return locksAsked;
    }
    var workToRelease = null;
    function restore(context) {
        if (!historyManaged) {
            throw new Error("can't restore a context without history management");
        }
        var locksFinished = tryUnlock();
        if (locksFinished === -1) {
            return new Promise(function (_, reject) { reject(); });
        }
        var promiseResolve;
        var promise = new Promise(function (resolve) { promiseResolve = resolve; });
        onWorkFinished(function () {
            var previousIndex = contextManager.index();
            if (contextManager.restore(context)) {
                var replace_1 = previousIndex >= contextManager.index();
                workToRelease = createWork();
                onWorkFinished(promiseResolve);
                var href_1 = contextManager.get();
                var hadBack_1 = hasBack;
                (new Promise(function (resolve) {
                    if (!replace_1 && !hasBack) {
                        onCatchPopState$1(resolve, true);
                        goTo(href_1);
                    }
                    else {
                        resolve();
                    }
                }))
                    .then(function () { return new Promise(function (resolve) {
                    var index = contextManager.index() - 1;
                    if (replace_1 && !hasBack) {
                        resolve();
                    }
                    else {
                        addBack(contextManager.get(index))
                            .then(function () {
                            hasBack = true;
                            resolve();
                        });
                    }
                }); })
                    .then(function () { return new Promise(function (resolve) {
                    if (hadBack_1 || replace_1) {
                        onCatchPopState$1(resolve, true);
                        goTo(href_1, true);
                    }
                    else {
                        resolve();
                    }
                }); })
                    .then(onlanded);
            }
            else {
                promiseResolve();
            }
        });
        return promise;
    }
    function assign(href) {
        var locksFinished = tryUnlock();
        if (locksFinished === -1) {
            return new Promise(function (_, reject) { reject(); });
        }
        var promiseResolve;
        var promise = new Promise(function (resolve) { promiseResolve = resolve; });
        onWorkFinished(function () {
            workToRelease = createWork();
            onWorkFinished(promiseResolve);
            goTo(href);
        });
        return promise;
    }
    var replacing = false;
    function replace(href) {
        var locksFinished = tryUnlock();
        if (locksFinished === -1) {
            return new Promise(function (_, reject) { reject(); });
        }
        var promiseResolve;
        var promise = new Promise(function (resolve) { promiseResolve = resolve; });
        onWorkFinished(function () {
            workToRelease = createWork();
            onWorkFinished(promiseResolve);
            goTo(href, replacing = true);
        });
        return promise;
    }
    function go$1(direction) {
        var locksFinished = tryUnlock();
        if (locksFinished === -1) {
            return new Promise(function (resolve, reject) {
                reject();
            });
        }
        if (direction === 0) {
            return Promise.resolve();
        }
        direction = parseInt(direction, 10) + locksFinished;
        if (isNaN(direction)) {
            throw new Error("direction must be a number");
        }
        if (direction === 0) {
            return Promise.resolve();
        }
        var promiseResolve;
        var promise = new Promise(function (resolve, reject) { promiseResolve = resolve; });
        onWorkFinished(function () {
            if (historyManaged === false) {
                window.history.go(direction);
                promiseResolve();
                return;
            }
            var contextIndex = contextManager.index();
            var index = Math.max(0, Math.min(contextManager.length() - 1, contextIndex + direction));
            if (contextIndex === index) {
                onlanded();
                promiseResolve();
                return;
            }
            workToRelease = createWork();
            onWorkFinished(promiseResolve);
            if (direction > 0) {
                contextManager.index(index - 1);
                window.history.go(1);
            }
            else {
                contextManager.index(index + 1);
                window.history.go(-1);
            }
        });
        return promise;
    }
    function start$1(fallbackContext) {
        if (historyManaged === null) {
            historyManaged = false;
        }
        fallbackContext = historyManaged ?
            (fallbackContext === void 0 ? contextManager.getContextNames()[0] : fallbackContext)
            : null;
        var href = get();
        var promiseResolve;
        var promiseReject;
        var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        if (historyManaged) {
            var context = contextManager.contextOf(href, false);
            if (context == null) {
                if (!fallbackContext) {
                    throw new Error("must define a fallback context");
                }
                var defaultHREF = contextManager.getDefaultOf(fallbackContext);
                if (defaultHREF == null) {
                    throw new Error("must define a default href for the fallback context");
                }
                started = true;
                href = defaultHREF;
                workToRelease = createWork();
                onCatchPopState$1(function () { onlanded(); promiseResolve(); }, true);
                goTo(defaultHREF, true);
            }
            contextManager.insert(href);
            if (context == null) {
                promiseReject();
                return promise;
            }
        }
        started = true;
        onlanded();
        promiseResolve();
        return promise;
    }
    function onlanded() {
        window.dispatchEvent(new Event("historylanded"));
        if (workToRelease != null) {
            var work = workToRelease;
            workToRelease = null;
            work.finish();
        }
    }
    function handlePopState$1() {
        var options = __assign(__assign({}, get$1()), (historyManaged ? {} : { front: undefined, back: undefined }));
        if (options.locked) {
            onCatchPopState$1(function () {
                if (get$1().locked) {
                    handlePopState$1();
                }
            }, true);
            window.history.go(-1);
            return;
        }
        if (options.front !== undefined) {
            var frontEvent = new Event("historyforward", { cancelable: true });
            window.dispatchEvent(frontEvent);
            if (frontEvent.defaultPrevented) {
                onCatchPopState$1(function () { return; }, true);
                window.history.go(-1);
                return;
            }
            var backHref = contextManager.get();
            var href_2 = contextManager.goForward();
            (new Promise(function (resolve) {
                if (hasBack) {
                    onCatchPopState$1(resolve, true);
                    window.history.go(-1);
                }
                else {
                    resolve();
                }
            }))
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                goTo(href_2, true);
            }); })
                .then(addBack.bind(null, backHref))
                .then(function () { return new Promise(function (resolve) {
                if (contextManager.index() < contextManager.length() - 1) {
                    onCatchPopState$1(resolve, true);
                    addFront(contextManager.get(contextManager.index() + 1)).then(resolve);
                }
                else {
                    resolve();
                }
            }); })
                .then(function () {
                hasBack = true;
                onlanded();
            });
        }
        else if (options.back !== undefined) {
            var backEvent = new Event("historybackward", { cancelable: true });
            window.dispatchEvent(backEvent);
            if (backEvent.defaultPrevented) {
                onCatchPopState$1(function () { return; }, true);
                window.history.go(+1);
                return;
            }
            var frontHref = contextManager.get();
            var href_3 = contextManager.goBackward();
            (new Promise(function (resolve) {
                if (contextManager.index() > 0) {
                    onCatchPopState$1(resolve, true);
                    window.history.go(1);
                }
                else {
                    resolve();
                }
            }))
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                goTo(href_3, true);
            }); })
                .then(addFront.bind(null, frontHref))
                .then(function () {
                hasBack = contextManager.index() > 0;
                onlanded();
            });
        }
        else {
            var href_4 = get();
            var backHref_1 = contextManager.get();
            if (href_4 === backHref_1 || !historyManaged) {
                return onlanded();
            }
            var replaced_1 = replacing;
            replacing = false;
            var willHaveBack_1 = hasBack || !replaced_1;
            contextManager.insert(href_4, replaced_1);
            (new Promise(function (resolve) {
                if (hasBack && !replaced_1) {
                    onCatchPopState$1(resolve, true);
                    window.history.go(-1);
                }
                else {
                    resolve();
                }
            }))
                .then(function () {
                if (replaced_1) {
                    return Promise.resolve();
                }
                return addBack(backHref_1);
            })
                .then(function () { return new Promise(function (resolve) {
                onCatchPopState$1(resolve, true);
                goTo(href_4, true);
            }); })
                .then(function () {
                hasBack = willHaveBack_1;
                onlanded();
            });
        }
    }

    var locks$1 = [];
    var catchPopState = null;
    window.addEventListener("popstate", function (event) {
        if (catchPopState == null) {
            return handlePopState();
        }
        event.stopImmediatePropagation();
        catchPopState();
    }, true);
    function onCatchPopState(onCatchPopState, once) {
        if (once === void 0) { once = false; }
        if (once) {
            var tmpOnCatchPopState_1 = onCatchPopState;
            onCatchPopState = function () {
                catchPopState = null;
                tmpOnCatchPopState_1();
            };
        }
        catchPopState = onCatchPopState;
    }
    function lock$2() {
        var delegate = new EventTarget();
        var id = Date.now();
        var historyLock;
        var promiseResolve;
        var isPromiseResolved = false;
        var promise = new Promise(function (resolve) {
            promiseResolve = function (lock) {
                resolve(lock);
                isPromiseResolved = true;
            };
        });
        onWorkFinished(function () {
            historyLock = acquire();
            var lock = {
                lock: {
                    get id() {
                        return id;
                    },
                    listen: function (listener) {
                        delegate.addEventListener("navigation", listener);
                    },
                    unlisten: function (listener) {
                        delegate.removeEventListener("navigation", listener);
                    },
                    unlock: function () {
                        if (!locks$1.length || historyLock.finishing) {
                            return;
                        }
                        var fn = function () {
                            if (locks$1[locks$1.length - 1].lock.id === id) {
                                unlock$1();
                            }
                            else {
                                locks$1.some(function (lock, index) {
                                    if (lock.lock.id === id) {
                                        locks$1.splice(index, 1)[0].release();
                                    }
                                    return false;
                                });
                            }
                        };
                        if (isPromiseResolved) {
                            fn();
                        }
                        else {
                            promise.then(fn);
                        }
                    }
                },
                fire: function () {
                    var e = new Event("navigation", { cancelable: true });
                    delegate.dispatchEvent(e);
                    return e.defaultPrevented;
                },
                release: function () {
                    historyLock.finish();
                },
                beginRelease: function (start_fn) {
                    historyLock.beginFinish();
                    if (isPromiseResolved) {
                        start_fn();
                    }
                    else {
                        promise.then(function () { return start_fn(); });
                    }
                }
            };
            historyLock.askFinish = function () {
                if (!lock.fire()) {
                    return false;
                }
                lock.lock.unlock();
                return true;
            };
            locks$1.push(lock);
            goWith(clearHref(), __assign(__assign({}, get$1()), { locked: lock.lock.id })).then(function () {
                promiseResolve(lock.lock);
            });
        });
        return promise;
    }
    function unlock$1(force) {
        if (force === void 0) { force = true; }
        var wrapper = locks$1.splice(locks$1.length - 1, 1)[0];
        if (wrapper == null) {
            return true;
        }
        if (!force && !wrapper.fire()) {
            return false;
        }
        wrapper.beginRelease(function () {
            onCatchPopState(function () {
                wrapper.release();
            }, true);
            window.history.go(-1);
        });
        return true;
    }
    function locked$1() {
        return locks$1.length > 0;
    }
    var shouldUnlock = false;
    function handlePopState() {
        if (locks$1.length === 0) {
            return;
        }
        var lockId = parseInt(get$1().locked, 10);
        if (isNaN(lockId)) {
            shouldUnlock = true;
            window.history.go(1);
        }
        else {
            var lock_1 = locks$1[locks$1.length - 1];
            if (lockId === lock_1.lock.id) {
                if (shouldUnlock && lock_1.fire()) {
                    unlock$1();
                }
                shouldUnlock = false;
                return;
            }
            else if (lockId > lock_1.lock.id) {
                window.history.go(-1);
            }
            else {
                shouldUnlock = true;
                window.history.go(1);
            }
        }
    }

    var NavigationLock = /*#__PURE__*/Object.freeze({
        __proto__: null,
        lock: lock$2,
        unlock: unlock$1,
        locked: locked$1
    });

    var _a, _b, _c;
    var ROUTES = Symbol("routes");
    var REDIRECTIONS = Symbol("redirections");
    var DESTROYED = Symbol("destroyed");
    function KeyMapFrom(keys, values) {
        var map = new Map();
        keys.forEach(function (key, index) {
            map.set(key.name.toString(), values[index]);
        });
        return map;
    }
    var routers = [];
    function getLocation(href) {
        if (href === void 0) { href = get(); }
        var pathname = "";
        var hash = "";
        var query = "";
        var cachedQuery = null;
        {
            var split = href.split("#");
            pathname = split.shift();
            hash = split.join("#");
            hash = hash ? "#" + hash : "";
        }
        {
            var split = pathname.split("?");
            pathname = split.shift();
            query = split.join("?");
            query = query ? "?" + query : "";
        }
        pathname = prepare(pathname);
        return {
            hrefIf: function (go) {
                var oldP = pathname;
                var oldH = hash;
                var oldQ = query;
                this.href = go;
                var hrefIf = this.href;
                pathname = oldP;
                hash = oldH;
                query = oldQ;
                return hrefIf;
            },
            get href() {
                return pathname + query + hash;
            },
            set href(value) {
                if (typeof value !== "string") {
                    throw new Error("href should be a string");
                }
                if (!value) {
                    return;
                }
                var match = value.match(/^([\/\\]{2,})|([\/\\]{1})|([#])|([\?])/);
                if (match) {
                    switch (match[0]) {
                        case "?": {
                            query = "?" + encodeURI(value.substr(1)).replace("#", "%23").replace("?", "%3F");
                            break;
                        }
                        case "#": {
                            hash = value;
                            break;
                        }
                        case "/": {
                            pathname = prepare(value);
                            hash = "";
                            query = "";
                            break;
                        }
                        default: {
                            return;
                        }
                    }
                }
                else {
                    var path = pathname.split("/");
                    path.pop();
                    path.push(prepare(value));
                    pathname = path.join("/");
                    hash = "";
                    query = "";
                }
            },
            get pathname() {
                return pathname;
            },
            set pathname(value) {
                if (typeof value !== "string") {
                    throw new Error("pathname should be a string");
                }
                pathname = prepare(value);
            },
            get hash() {
                return hash;
            },
            set hash(value) {
                if (typeof value !== "string") {
                    throw new Error("hash should be a string");
                }
                if (!value) {
                    hash = "";
                    return;
                }
                if (value.indexOf("#") !== 0) {
                    value = "#" + value;
                }
                hash = value;
            },
            get query() {
                return query;
            },
            set query(value) {
                if (typeof value !== "string") {
                    throw new Error("query should be a string");
                }
                cachedQuery = null;
                if (!value) {
                    query = "";
                    return;
                }
                if (value.indexOf("?") !== 0) {
                    value = "?" + value;
                }
                query = encodeURI(value).replace("#", "%23");
            },
            get parsedQuery() {
                if (!query) {
                    return {};
                }
                if (!cachedQuery) {
                    cachedQuery = queryString.parse(query.replace(/^\?/, ""));
                }
                return cachedQuery;
            },
            hasQueryParam: function (param) {
                if (!query) {
                    return false;
                }
                return this.parsedQuery[param] !== undefined;
            },
            getQueryParam: function (param) {
                if (!query) {
                    return undefined;
                }
                return this.parsedQuery[param];
            },
            addQueryParam: function (param, value) {
                var _d;
                if (value === void 0) { value = null; }
                var newQuery = __assign(__assign({}, this.parsedQuery), (_d = {}, _d[param] = value, _d));
                cachedQuery = null;
                query = queryString.stringify(newQuery);
                if (query) {
                    query = "?" + query;
                }
            },
            removeQueryParam: function (param) {
                if (!query) {
                    return;
                }
                var parsedQuery = this.parsedQuery;
                delete parsedQuery[param];
                this.query = queryString.stringify(parsedQuery);
            }
        };
    }
    function emitSingle(router, location) {
        var path;
        if (location) {
            path = location.pathname;
        }
        else {
            location = getLocation();
            path = location.pathname;
        }
        var redirection = null;
        router[REDIRECTIONS].some(function (redirectionRoute) {
            var exec = redirectionRoute.regex.exec(path);
            if (exec) {
                redirection = { location: location, keymap: KeyMapFrom(redirectionRoute.keys, exec.slice(1)) };
                location = getLocation(redirectionRoute.redirection);
                path = location.pathname;
                return false;
            }
            return false;
        });
        router[ROUTES].some(function (route) {
            var exec = route.regex.exec(path);
            if (exec) {
                route.callback(location, KeyMapFrom(route.keys, exec.slice(1)), redirection);
                return true;
            }
            return false;
        });
    }
    function _emit() {
        var location = getLocation();
        routers.forEach(function (router) {
            emitSingle(router, location);
        });
    }
    var emitRoute = true;
    function onland() {
        if (emitRoute) {
            _emit();
        }
        else {
            emitRoute = true;
        }
    }
    window.addEventListener("historylanded", onland);
    function _go(path, replace$1, emit) {
        if (replace$1 === void 0) { replace$1 = false; }
        if (emit === void 0) { emit = true; }
        var lastEmitRoute = emitRoute;
        emitRoute = emit;
        return (replace$1 ? replace(path) : assign(path)).catch(function () {
            emitRoute = lastEmitRoute;
        });
    }
    function _throwIfDestroyed(router) {
        if (router[DESTROYED]) {
            throw new Error("Router destroyed");
        }
    }
    var GenericRouter = (function () {
        function GenericRouter() {
            this[_a] = [];
            this[_b] = [];
            this[_c] = false;
            routers.push(this);
        }
        GenericRouter.prototype.destroy = function () {
            if (this[DESTROYED]) {
                return;
            }
            var index = routers.indexOf(this);
            if (index > -1) {
                routers.splice(index, 1);
            }
            this[DESTROYED] = true;
        };
        GenericRouter.prototype.redirect = function (path, redirection) {
            _throwIfDestroyed(this);
            var keys = [];
            var regex = generate(path, keys);
            this[REDIRECTIONS].push({ regex: regex, keys: keys, redirection: prepare(redirection) });
            return regex;
        };
        GenericRouter.prototype.unredirect = function (path) {
            _throwIfDestroyed(this);
            var keys = [];
            var regex = generate(path, keys);
            var rIndex = -1;
            this[ROUTES].some(function (route, index) {
                var xSource = (regex.ignoreCase ? regex.source.toLowerCase() : regex.source);
                var ySource = (route.regex.ignoreCase ? route.regex.source.toLowerCase() : route.regex.source);
                if ((xSource === ySource) && (regex.global === route.regex.global) &&
                    (regex.ignoreCase === route.regex.ignoreCase) && (regex.multiline === route.regex.multiline)) {
                    rIndex = index;
                    return true;
                }
                return false;
            });
            if (rIndex > -1) {
                this[ROUTES].splice(rIndex, 1);
            }
        };
        GenericRouter.prototype.route = function (path, callback) {
            _throwIfDestroyed(this);
            var keys = [];
            var regex = generate(path, keys);
            this[ROUTES].push({ regex: regex, keys: keys, callback: callback });
            return regex;
        };
        GenericRouter.prototype.unroute = function (path) {
            _throwIfDestroyed(this);
            var keys = [];
            var regex = generate(path, keys);
            var rIndex = -1;
            this[ROUTES].some(function (route, index) {
                var xSource = (regex.ignoreCase ? regex.source.toLowerCase() : regex.source);
                var ySource = (route.regex.ignoreCase ? route.regex.source.toLowerCase() : route.regex.source);
                if ((xSource === ySource) && (regex.global === route.regex.global) &&
                    (regex.ignoreCase === route.regex.ignoreCase) && (regex.multiline === route.regex.multiline)) {
                    rIndex = index;
                    return true;
                }
                return false;
            });
            if (rIndex > -1) {
                this[ROUTES].splice(rIndex, 1);
            }
        };
        GenericRouter.prototype.emit = function () {
            emitSingle(this);
        };
        return GenericRouter;
    }());
    _a = ROUTES, _b = REDIRECTIONS, _c = DESTROYED;
    var main = new GenericRouter();
    function redirect(path, redirection) {
        return main.redirect(path, redirection);
    }
    function unredirect(path) {
        return main.unredirect(path);
    }
    function route(path, callback) {
        return main.route(path, callback);
    }
    function unroute(path) {
        return main.unroute(path);
    }
    function start(startingContext) {
        return start$1(startingContext);
    }
    function index() {
        return index$1();
    }
    function getLocationAt(index) {
        var href = getHREFAt(index);
        if (href == null) {
            return null;
        }
        return getLocation(href);
    }
    function addContextPath(context, href, isFallback) {
        if (isFallback === void 0) { isFallback = false; }
        return addContextPath$1(context, href, isFallback);
    }
    function setContextDefaultHref(context, href) {
        return setContextDefaultHref$1(context, href);
    }
    function setContext(context) {
        return setContext$1(context);
    }
    function getContext(href) {
        return getContext$1(href);
    }
    function restoreContext(context, defaultHref) {
        return restore(context);
    }
    function getContextDefaultOf(context) {
        return getContextDefaultOf$1(context);
    }
    function emit(single) {
        if (single === void 0) { single = false; }
        if (single) {
            return emitSingle(main);
        }
        return _emit();
    }
    function create() {
        return new GenericRouter();
    }
    function go(path_index, options) {
        var path_index_type = typeof path_index;
        if (path_index_type !== "string" && path_index_type !== "number") {
            throw new Error("router.go should receive an url string or a number");
        }
        options = __assign({}, options);
        return new Promise(function (promiseResolve, promiseReject) {
            var goingEvent = new CustomEvent("router:going", {
                detail: __assign({ direction: path_index }, options),
                cancelable: true
            });
            window.dispatchEvent(goingEvent);
            if (goingEvent.defaultPrevented) {
                promiseReject();
                return;
            }
            if (path_index_type === "string") {
                _go(path_index, (options && options.replace) || false, (options == null || options.emit == null) ? true : options.emit).then(promiseResolve);
            }
            else {
                var lastEmitRoute_1 = emitRoute;
                emitRoute = options.emit == null ? true : options.emit;
                go$1(path_index).then(promiseResolve, function () {
                    emitRoute = lastEmitRoute_1;
                });
            }
        });
    }
    function setQueryParam(param, value, options) {
        var promiseResolve;
        var promise = new Promise(function (resolve) { promiseResolve = resolve; });
        onWorkFinished(function () {
            var location = getLocation();
            if (value === undefined) {
                location.removeQueryParam(param);
            }
            else {
                location.addQueryParam(param, value);
            }
            go(location.href, options).then(promiseResolve);
        });
        return promise;
    }
    function lock$1() {
        return lock$2();
    }
    function unlock(force) {
        if (force === void 0) { force = true; }
        return unlock$1(force);
    }
    function destroy() {
        throw new Error("cannot destroy main Router");
    }
    function getBase() {
        return base();
    }
    function setBase(newBase) {
        base(newBase.replace(/[\/]+$/, ""));
        _emit();
    }
    function isLocked() {
        return locked$1();
    }

    var Router = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getLocation: getLocation,
        redirect: redirect,
        unredirect: unredirect,
        route: route,
        unroute: unroute,
        start: start,
        index: index,
        getLocationAt: getLocationAt,
        addContextPath: addContextPath,
        setContextDefaultHref: setContextDefaultHref,
        setContext: setContext,
        getContext: getContext,
        restoreContext: restoreContext,
        getContextDefaultOf: getContextDefaultOf,
        emit: emit,
        create: create,
        go: go,
        setQueryParam: setQueryParam,
        lock: lock$1,
        unlock: unlock,
        destroy: destroy,
        getBase: getBase,
        setBase: setBase,
        isLocked: isLocked,
        NavigationLock: NavigationLock
    });

    var ROUTER = Symbol("router");
    var IS_ROUTER = Symbol("is-router");
    var UNROUTE_METHOD = Symbol("unroute");
    var LAST_ROUTED = Symbol("last-routed");
    var ROUTE_PLACEHOLDER = Symbol("route-placeholder");

    var RouterComponent = {
      'css': null,

      'exports': {
        getSelfSlotProp() {
            return { [ROUTER]: this };
        },

        onBeforeMount() {
            this.root[IS_ROUTER] = true;
            this[UNROUTE_METHOD] = () => {};
            this[ROUTER] = Router.create();
        },

        onMounted() {
            this[ROUTER].route("(.*)", () => {
                claim(this); release(this);
                this[LAST_ROUTED] = null;
                this[UNROUTE_METHOD]();
                this[UNROUTE_METHOD] = () => {};
            });
        },

        onUnmounted() {
            delete this.root[IS_ROUTER];
        },

        [LAST_ROUTED]: null
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<slot expr3="expr3"></slot>',
          [
            {
              'type': bindingTypes.SLOT,

              'attributes': [
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(
                    scope
                  ) {
                    return scope.getSelfSlotProp();
                  }
                }
              ],

              'name': 'default',
              'redundantAttribute': 'expr3',
              'selector': '[expr3]'
            }
          ]
        );
      },

      'name': 'rhm-router'
    };

    var ONBEFOREROUTE = Symbol("onbeforeroute");
    var ONUNROUTE = Symbol("onunroute");
    var ONROUTE = Symbol("onroute");
    var HTMLElementAddEventListener = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (type, listener, options) {
        if (options === void 0) { options = false; }
        switch (type) {
            case "beforeroute": {
                var onbeforeroute = this[ONBEFOREROUTE] = this[ONBEFOREROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onbeforeroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            case "unroute": {
                var onunroute = this[ONUNROUTE] = this[ONUNROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onunroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            case "route": {
                var onroute = this[ONROUTE] = this[ONROUTE] || [];
                var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
                onroute.push({ listener: listener, useCapture: useCapture });
                break;
            }
            default: {
                return HTMLElementAddEventListener.call(this, type, listener, options);
            }
        }
    };
    var HTMLElementRemoveEventListener = HTMLElement.prototype.removeEventListener;
    HTMLElement.prototype.removeEventListener = function (type, listener, options) {
        switch (type) {
            case "beforeroute": {
                var onbeforeroute = this[ONBEFOREROUTE];
                if (!onbeforeroute) {
                    return;
                }
                var useCapture_1 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_1 = -1;
                if (!onbeforeroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_1) {
                        index_1 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onbeforeroute.slice(index_1, 1);
                break;
            }
            case "unroute": {
                var onunroute = this[ONUNROUTE];
                if (!onunroute) {
                    return;
                }
                var useCapture_2 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_2 = -1;
                if (!onunroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_2) {
                        index_2 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onunroute.slice(index_2, 1);
                break;
            }
            case "route": {
                var onroute = this[ONROUTE];
                if (!onroute) {
                    return;
                }
                var useCapture_3 = typeof options === "boolean" ? options : options ? options.capture != null : false;
                var index_3 = -1;
                if (!onroute.some(function (l, i) {
                    if (l.listener === listener && l.useCapture === useCapture_3) {
                        index_3 = i;
                        return true;
                    }
                    return false;
                })) {
                    return;
                }
                onroute.slice(index_3, 1);
                break;
            }
            default: {
                return HTMLElementRemoveEventListener.call(this, type, listener, options);
            }
        }
    };
    function getRouter(element) {
        var tag = parent[riot__namespace.__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
        if (tag && tag.name === "router") {
            return tag;
        }
        return null;
    }
    function dispatchEventOver(children, event, collectLoaders, collectRouter) {
        var stop = false;
        var immediateStop = false;
        event.stopImmediatePropagation = function () {
            stop = true;
            immediateStop = true;
        };
        event.stopPropagation = function () {
            stop = true;
        };
        function propagateEvent(child) {
            var routerTag = getRouter();
            if (routerTag) {
                if (collectRouter != null) {
                    collectRouter.push(routerTag);
                }
                return false;
            }
            var listeners;
            switch (event.type) {
                case "beforeroute": {
                    listeners = child[ONBEFOREROUTE];
                    break;
                }
                case "unroute": {
                    listeners = child[ONUNROUTE];
                    break;
                }
                case "route": {
                    listeners = child[ONROUTE];
                    break;
                }
                default: return true;
            }
            var isLoader = collectLoaders != null && child.matches("[need-loading]:not([need-loading='false'])");
            if (isLoader) {
                child.addEventListener("load", function load() {
                    child.removeEventListener("load", load);
                    isLoader = false;
                });
            }
            if (listeners) {
                listeners.some(function (listener) {
                    if (listener.useCapture) {
                        listener.listener.call(child, event);
                        return immediateStop;
                    }
                });
            }
            if (!stop) {
                if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                    listeners.some(function (listener) {
                        if (!listener.useCapture) {
                            listener.listener.call(child, event);
                            return immediateStop;
                        }
                    });
                }
            }
            if (isLoader) {
                collectLoaders.push(child);
            }
            return stop;
        }
        Array.prototype.some.call(children, propagateEvent);
        delete event.stopImmediatePropagation;
        delete event.stopPropagation;
    }

    function onunroute(routeComponent, currentMount, route, router, shouldFireEvent, shouldResetUnroute) {
        const currentEl = currentMount.el;
        {
            if (shouldFireEvent) {
                const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
                dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
            }
            const scope = Object.create(routeComponent[riot.__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } });
            currentMount.unmount( scope, routeComponent[riot.__.globals.PARENT_KEY_SYMBOL] );
        }
        {
            const placeholder = routeComponent[ROUTE_PLACEHOLDER];
            placeholder.parentElement.removeChild(currentEl);
            // if want to keep some route for faster loading, just `display: none` the element
            // currentEl.style.display = "none";
        }
        if (shouldResetUnroute) {
            router[UNROUTE_METHOD] = () => {};
        }
    }

    function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
        if (router[LAST_ROUTED] !== routeComponent) {
            onunroute(routeComponent, currentMount, route, router, false, false);
            return;
        }
        const currentEl = currentMount.el;
        if (claimed(claimer)) {
            release(claimer);
        }
        const routerUNROUTE = router[UNROUTE_METHOD];
        let reachedRouterLoad = false;
        let unrouted = false;
        const thisUNROUTE = () => {
            if (unrouted) {
                return;
            }
            unrouted = true;
            onunroute(routeComponent, currentMount, route, router, reachedRouterLoad, reachedRouterLoad);
        };
        router[UNROUTE_METHOD] = () => {
            window.removeEventListener("routerload", onrouterload, true);
            routerUNROUTE();
            thisUNROUTE();
        };

        window.addEventListener("routerload", onrouterload, true);

        function onrouterload() {
            window.removeEventListener("routerload", onrouterload, true);
            reachedRouterLoad = true;
            routerUNROUTE();
            router[UNROUTE_METHOD] = thisUNROUTE;
            currentEl.style.display = "block";
            {
                const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
                dispatchEventOver(currentEl.children, routeEvent, null, []);
            }
        }
    }

    function onroute(routeComponent) { return (function (location, keymap, redirection) {
        const route = { location, keymap, redirection };

        const claimer = Object.create(null);
        claim(claimer);

        const router = this[ROUTER];
        router[LAST_ROUTED] = this;

        const slot = this.slots[0];
        const currentEl = document.createElement("div");
        const placeholder = this[ROUTE_PLACEHOLDER];
        placeholder.parentElement.insertBefore(currentEl, placeholder);
        const currentMount = riot.__.DOMBindings.template(slot.html, slot.bindings).mount(
            currentEl,
            Object.create(this[riot.__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } }),
            this[riot.__.globals.PARENT_KEY_SYMBOL]
        );
        currentEl.style.display = "none";
        
        const needLoading = [];
        const routerChildren = [];
        {
            const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: { ...route } });
            dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
        }
        if (needLoading.length > 0) {
            let loaded = 0;
            const onrequestvisibility = () => {
                currentEl.style.display = "block";
            };
            needLoading.forEach(el => {
                loaded++;
                const onload = el => {
                    const fn = () => {
                        currentEl.style.display = "none";
                        el.removeEventListener("requestvisibility", onrequestvisibility);
                        el.removeEventListener("load", fn);
                        Array.prototype.forEach.call(
                            currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
                            el => {
                                if (needLoading.some(other => other === el)) { return; }
                                needLoading.push(el);
                                loaded++;
                                el.addEventListener("load", onload(el));
                                el.addEventListener("requestvisibility", onrequestvisibility);
                            }
                        );
                        if (--loaded <= 0) {
                            onloadingcomplete(routeComponent, currentMount, route, router, claimer);
                        }
                    };
                    return fn;
                };
                el.addEventListener("requestvisibility", onrequestvisibility);
                el.addEventListener("load", onload(el));
            });
        } else {
            onloadingcomplete(routeComponent, currentMount, route, router, claimer);
        }
    }).bind(routeComponent); }

    var RouteComponent = {
      'css': null,

      'exports': {
        _valid: false,
        _onroute: null,
        _path: null,

        onMounted() {
            const placeholder = this[ROUTE_PLACEHOLDER] = document.createComment("");
            this.root.replaceWith(placeholder);
            const router = this[riot.__.globals.PARENT_KEY_SYMBOL][ROUTER];
            if (router == null) {
                return;
            }
            this._valid = true;
            this[ROUTER] = router;
            
            if (this.props.redirect) {
                router[ROUTER].redirect(this.props.path, this.props.redirect);
            } else {
                router[ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
            }
        },

        onUnmounted() {
            if (this._onroute == null) {
                return;
            }
            this[riot.__.globlas.PARENT_KEY_SYMBOL].router[ROUTER].unroute(this._path, this._onroute);
        }
      },

      'template': null,
      'name': 'rhm-route'
    };

    var NavigateComponent = {
      'css': `rhm-navigate a[ref=-navigate-a],[is="rhm-navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

      'exports': {
        onMounted() {
            this.root.style.cursor = "pointer";
            if (this.root.style.display === "") {
                this.root.style.display = "inline";
            }

            this.root.setAttribute("route-listener", "true");
            this.root.addEventListener("route", () => {
                this.update();
            });
            
            this.root.firstElementChild.addEventListener("click", event => {
                event.preventDefault();
                let href = this.href(false);
                if (href != null) {
                    Router.go(href, { replace: this.replace() });
                } else {
                    let context = this.context();
                    if (context) {
                        Router.restoreContext(context);
                    }
                }
                return false;
            });
        },

        onBeforeUpdate() {
            this._href = null;
        },

        replace() {
            if (typeof this.props.replace !== "boolean") {
                return (this.props.replace != null && this.props.replace !== "false") || this.props.replace === "";
            }
            return this.props.replace;
        },

        href(toA = true) {
            if (typeof this.props.href !== "string") {
                if (toA) {
                    const context = this.context();
                    return context != null ? Router.getContextDefaultOf(context) : null;
                }
                return null;
            }
            if (this._href == null) {
                this._href = Router.getLocation().hrefIf(this.props.href);
                // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
            }
            return toA ? URLManager.construct(this._href, true) : this._href; // (toA ? Router.base : "") + this._href;
        },

        context() {
            if (typeof this.props.context !== "string") {
                return null;
            }
            return this.props.context;
        }
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<a expr4="expr4" ref="-navigate-a"><slot expr5="expr5"></slot></a>',
          [
            {
              'redundantAttribute': 'expr4',
              'selector': '[expr4]',

              'expressions': [
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'href',

                  'evaluate': function(
                    scope
                  ) {
                    return scope.href();
                  }
                },
                {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'style',

                  'evaluate': function(
                    scope
                  ) {
                    return [
                      'display: ',
                      scope.root.style.display,
                      '; width: 100%; height: 100%;'
                    ].join(
                      ''
                    );
                  }
                }
              ]
            },
            {
              'type': bindingTypes.SLOT,
              'attributes': [],
              'name': 'default',
              'redundantAttribute': 'expr5',
              'selector': '[expr5]'
            }
          ]
        );
      },

      'name': 'rhm-navigate'
    };

    riot.register("rhm-router", RouterComponent);
    riot.register("rhm-route", RouteComponent);
    riot.register("rhm-navigate", NavigateComponent);
    var components = {
        "rhm-router": RouterComponent,
        "rhm-route": RouteComponent,
        "rhm-navigate": NavigateComponent
    };

    exports.components = components;
    exports.loadingBar = loadingBar$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
