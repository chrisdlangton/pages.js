/** 
 * @projectDescription  PagesJS is a small JavaSciprt Framework originally built as an experiment in designing single page applications.
 *                      As PagesJS evolved it aimed to solve the common problems associated with writing this new style of application. It became clear early on that PagesJS was well suited for building simple single page applications without the requirement of heavier libraries such as jQuery to perform simple DOM related functions.
 *
 * @author  Christopher D. Langton chris@codewiz.biz
 * @version     1.2
 */
//	pagesJS selector
function p(id) {
    //fixes for old browsers
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (classname) {
            var elArray = [];
            var tmp = document.getElementsByTagName("*");
            var regex = new RegExp("(^|\s)" + classname + "(\s|$)");
            for (var i = 0, j = tmp.length; i < j; i++) {
                var itm = tmp[i];
                if (regex.test(itm.className)) {
                    elArray.push(itm);
                }
            }
            return elArray;
        };
    }
    if (typeof Array.prototype.indexOf !== 'function') {
        Array.prototype.indexOf = function (item) {
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }
    this.hash = window.location.hash.substring(2);
    this.page_title = (function() {
        var encTitle = document.getElementsByTagName('title')[0].innerHTML.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
        return encTitle.substring(0, encTitle.indexOf(" |") ) || encTitle;
    })();
    var link_arr = document.getElementsByTagName("link");
    for (var i = 0, j = link_arr.length; i < j; i++) {
        var itm = link_arr[i];
        if (itm.getAttribute('rel') === 'canonical') {
            this.canonical = itm.href.substring(0, itm.href.indexOf("#!") ) || itm.href;
        }
    }
    // About object is returned if there is no 'id' parameter
    var about = {
        Library: "PagesJS",
        Version: 1.2,
        Author: "Christopher D. Langton",
        Website: "http:\/\/chrisdlangton.com",
        Created: "2013-02-03",
        Updated: "2013-08-29"
    };
    if (id) {
        // return a new page object if we're in the window scope
        if (window === this) {
            return new p(id);
        }
        // Init our element object and return the object
        if (id.charAt(0) === '#') {
            id = id.substring(1);
            this.id = id;
            if (typeof (document.getElementById(id)) !== 'undefined' && document.getElementById(id) !== null) {
                this.ele = document.getElementById(id);
                return this;
            } else {
                console.log("PagesJS: unknown element");
                return false;
            }
        } else if (id.charAt(0) === '.') {
            id = id.substring(1);
            this.id = id;
            if (typeof (document.getElementsByClassName(id)) !== 'undefined' && document.getElementsByClassName(id) !== null) {
                this.ele = document.getElementsByClassName(id);
                return this;
            } else {
                console.log("PagesJS: unknown element");
                return false;
            }
        } else if (id.charAt(0) === '_') {
            id = id.substring(1);
            this.id = id;
            var elements = document.getElementsByTagName('*');
            for (var i = 0, j = elements.length; i < j; i++) {
                var itm = elements[i];
                if (itm.getAttribute('page')) {
                    // return element when found with attribute page matching id.
                    if (itm.getAttribute('page') === id) {
                        this.ele = itm;
                        i = elements.length;
                        return this;
                    }
                }
            }
        } else if (id === 'body') {
            return this;
        } else {
            console.log("PagesJS: invalid selector");
            return false;
        }
    } else {
        // No id paramter was given, return the about object
        return about;
    }
};
//	PagesJS prototype methods
p.prototype = {
    init: function () {
        // prevent init being used multiple times
        if (typeof window.meta !== 'undefined') { return; }
        window.meta = {
            title: document.getElementsByTagName('title')[0].innerHTML.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ')
        }
        if ("onhashchange" in window) {
            window.onhashchange = function () {
                var hash = window.location.hash.substring(2);
                if (hash.length > 1) {
                    p('_' + hash).exist().nav();
                }
            };
        } else {
            var prevHash = window.location.hash;
            window.setInterval(function () {
                if (window.location.hash !== prevHash) {
                    var hash = window.location.hash.substring(2);
                    if (hash.length > 1) {
                        p('_' + hash).exist().nav();
                    }
                }
            }, 500);
        }
        if (this.hash.length > 1) {
            p('_' + this.hash).exist().nav();
        }
    },
    forEach: function (fn, scope) {
        for (var i = 0, len = this.ele.length; i < len; ++i) {
            fn.call(scope, this.ele[i], i, this.ele);
        }
    },
    hide: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].style.display = 'none';
                }
                return this;
            } else {
                this.ele.style.display = 'none';
                return this;
            }
        } else {
            return false;
        }
    },
    show: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].style.display = 'inherit';
                }
                return this;
            } else {
                this.ele.style.display = 'inherit';
                return this;
            }
        } else {
            return false;
        }
    },
    toggle: function () {
        var _toggle = function (obj) {
            if (obj.style.display !== 'none') {
                obj.style.display = 'none';
            } else {
                obj.style.display = 'inherit';
            }
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    _toggle(this.ele[i]);
                }
                return this;
            } else {
                _toggle(this.ele);
                return this;
            }
        } else {
            return false;
        }
    },
    trim: function () {
        var _trim = function (obj) {
            return obj.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _trim(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _trim(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    ltrim: function () {
        var _ltrim = function (obj) {
            return obj.replace(/\s+$/, '');
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _ltrim(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _ltrim(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    rtrim: function () {
        var _rtrim = function (obj) {
            return obj.replace(/^\s+/, '');
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _rtrim(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _rtrim(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    clear: function (start, end) {
        var _clear = function (obj) {
            var index1 = obj.indexOf(start);
            var index2 = obj.indexOf(end);
            return obj.slice(0, index1) + obj.slice(index2 + 1);
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                var index1 = this.ele.value.indexOf(start);
                var index2 = this.ele.value.indexOf(end);
                return _clear(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _clear(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    contains: function (str) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return this.ele.value.indexOf(str) > -1;
            } else if (typeof this.ele.innerHTML === "string") {
                return this.ele.innerHTML.indexOf(str) > -1;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    reverse: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return this.ele.value.split('').reverse().join('');
            } else if (typeof this.ele.innerHTML === "string") {
                return this.ele.innerHTML.split('').reverse().join('');
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    camelCase: function () {
        var _camelCase = function (obj) {
            return obj.replace(/\W+(.)/g, function (match, letter) {
                return letter.toUpperCase();
            });
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _camelCase(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _camelCase(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    inverse: function () {
        var _inverse = function (obj) {
            return obj.replace(/([a-z]+)|([A-Z]+)/g, function (match, lower, upper) {
                return lower ? match.toUpperCase() : match.toLowerCase();
            });
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _inverse(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _inverse(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    capitalize: function (a) {
        var all;
        if (typeof a === 'undefined' && a === null) {
            all = false;
        } else {
            all = a;
        }
        var _capitalize = function (obj) {
            return all ? obj.replace(/\w+/g, function (word) {
                return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
            }) : obj.charAt(0).toUpperCase() + obj.substring(1).toLowerCase();
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return _capitalize(this.ele.value);
            } else if (typeof this.ele.innerHTML === "string") {
                return _capitalize(this.ele.innerHTML);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    disable: function () {
        var _disable = function (obj) {
            obj.disabled = true;
        },
        _disableByTagName = function (tagName) {
            var eles = this.ele.getElementsByTagName(tagName);
            for (var i = eles.length; i--;) {
                _disable(eles[i]);
            }
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                _disable(this.ele);
                return this;
            } else {
                _disableByTagName("input");
                _disableByTagName("select");
                _disableByTagName("textarea");
                _disableByTagName("button");
                return this;
            }
        } else {
            return false;
        }
    },
    enable: function () {
        var _enable = function (obj) {
            obj.disabled = false;
        },
        _enableByTagName = function (tagName) {
            var eles = this.ele.getElementsByTagName(tagName);
            for (var i = eles.length; i--;) {
                _enable(eles[i]);
            }
        };
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                _enable(this.ele);
                return this;
            } else {
                _enableByTagName("input");
                _enableByTagName("select");
                _enableByTagName("textarea");
                _enableByTagName("button");
                return this;
            }
        } else {
            return false;
        }
    },
    stringify: function (obj) {
        var val;
        if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
            console.log('PagesJS: method available for unique selectors only.');
            return false;
        }
        if (obj && typeof obj === 'object') {
            if (window.JSON && window.JSON.stringify) {
                val = function (objRef) {
                    return window.JSON.stringify(objRef, function (key, value) {
                        if (typeof value === 'number' && !isFinite(value)) {
                            return String(value);
                        }
                        return value;
                    });
                };
                if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                    this.ele.value = val;
                } else {
                    this.ele.innerHTML = val;
                }
                return this;
            } else {
                console.log('PagesJS: browser doesnt support json natively');
                return false;
            }
        } else {
            console.log('PagesJS: stringify accepts an object');
            return false;
        }
    },
    parse: function () {
        if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
            console.log('PagesJS: method available for unique selectors only.');
            return false;
        }
        var data = "";
        if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
            if (typeof this.ele.value === "string" && this.ele.value !== null) {
                data = this.ele.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if (window.JSON && window.JSON.parse) {
                    return window.JSON.parse(data);
                } else {
                    console.log('PagesJS: browser doesnt support json natively');
                    return false;
                }
            } else {
                console.log('PagesJS: parse accepts a string');
                return false;
            }
        } else {
            if (typeof this.ele.innerHTML === "string" && this.ele.innerHTML !== null) {
                data = this.ele.innerHTML.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if (window.JSON && window.JSON.parse) {
                    return window.JSON.parse(data);
                } else {
                    console.log('PagesJS: browser doesnt support json natively');
                    return false;
                }
            }
        }
    },
    html: function (replacement) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (typeof replacement === "undefined") {
                return this.ele.innerHTML;
            } else {
                this.ele.innerHTML = replacement;
                return this;
            }
        } else {
            return false;
        }
    },
    val: function (replacement) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            if (this.ele.tagName && this.ele.tagName.toLowerCase() === "input") {
                if (typeof replacement === "undefined") {
                    return this.ele.value;
                } else {
                    this.ele.value = replacement;
                    return this;
                }
            } else {
                console.log('PagesJS: method available for input selectors only.');
                return false;
            }
        } else {
            return false;
        }
    },
    style: function (property, value) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].style[property] = value;
                }
                return this;
            } else {
                this.ele.style[property] = value;
                return this;
            }
        } else {
            return false;
        }
    },
    remove: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            var elem;
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            (elem = this.ele).parentNode.removeChild(elem);
            return this;
        } else {
            return false;
        }
    },
    empty: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].innerHTML = "";
                }
                return this;
            } else {
                this.ele.innerHTML = "";
                return this;
            }
        } else {
            return false;
        }
    },
    addClass: function (classes) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            var className = "";
            var len, i = 0;
            if (typeof classes !== "string") {
                for (i = classes.length; i--;) {
                    className += " " + classes[i];
                }
            } else {
                className = " " + classes;
            }
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].className += className;
                }
                return this;
            } else {
                this.ele.className += className;
                return this;
            }
        } else {
            return false;
        }
    },
    removeClass: function (remClass) {
        var _removeClass = (function () {
            if (typeof remClass === 'undefined' || this.ele === null) {
                return function (obj) {
                    obj.className = "";
                };
            }
            return function (obj) {
                while ((' ' + obj.className + ' ').indexOf(' ' + remClass + ' ') > -1) {
                    obj.className = obj.className.replace(new RegExp('\\b' + remClass + '\\b'), '');
                }
            };
        })();
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            var len, i = 0;
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (i = 0, len = this.ele.length; i < len; ++i) {
                    _removeClass(this.ele[i]);
                }
                return this;
            } else {
                _removeClass(this.ele);
                return this;
            }
        } else {
            return false;
        }
    },
    hasClass: function (c) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            var r = true, 
                e = this.ele.className.split(' '); 
            c = c.split(' ');
            for(var i=c.length; i--;)
                if(e.indexOf(c[i])===-1)
                r = false;
            return r;
        } else {
            return false;
        }
    },
    attr: function (attr, val) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    this.ele[i].setAttribute(attr, val);
                }
                return this;
            } else {
                this.ele.setAttribute(attr, val);
                return this;
            }
        } else {
            return false;
        }
    },
    append: function (elems) {
        if (typeof this.ele !== 'undefined' && this.ele !== null && typeof elems === "string") {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            this.ele.innerHTML = this.ele.innerHTML + elems;
            return this;
        } else {
            return false;
        }
    },
    prepend: function (elems) {
        if (typeof this.ele !== 'undefined' && this.ele !== null && typeof elems === "string") {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('PagesJS: method available for unique selectors only.');
                return false;
            }
            this.ele.innerHTML = elems + this.ele.innerHTML;
            return this;
        } else {
            return false;
        }
    },
    goTo: function () {
        this.ele.scrollIntoView(true);
        return this;
    },
    addPage: function (value) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (this.ele.hasAttribute('page')) {
                console.log("PagesJS: page already exists as '" + this.ele.getAttribute('page') + "'");
                return false;
            } else {
                this.ele.setAttribute("page", value);
                return this;
            }
        } else {
            console.log("PagesJS: invalid selector");
            return false;
        }
    },
    exist: function (value) {
        if (typeof this.ele !== 'undefined' && this.ele !== null && typeof value !== 'undefined' && value !== null) {
            if (this.ele.hasAttribute('page')) {
                return this.ele.getAttribute('page') === value ? true : false;
            } else {
                return false;
            }
        } else if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (this.ele.hasAttribute('page')) {
                return this.ele.getAttribute('page') === this.id ? this : false;
            } else {
                return false;
            }
        }
    },
    // methods available to page selectors only
    title: function (value) {
        if (typeof this.ele !== 'undefined' && this.ele !== null && this.ele.hasAttribute('page')) {
            if (typeof value === 'undefined') {
                return this.ele.getAttribute('page-title');
            } else {
                this.ele.setAttribute("page-title", value);
                return this;
            }
        } else {
            console.log("PagesJS: pageTitle method only available for page selector");
            return false;
        }
    },
    change: function (callback) {
        var self = this;
        if (history && history.pushState) {
            window.addEventListener("popstate", function(e) {
                if (window.location.hash.substring(2) === self.id){
                    callback( { page: self.id, title: document.getElementsByTagName('title')[0].innerHTML, node: self.ele } );
                }
            });
        } else {
            window.addEventListener("hashchange", function(e) {
                if (window.location.hash.substring(2) === self.id){
                    callback( { page: self.id, title: document.getElementsByTagName('title')[0].innerHTML, node: self.ele } );
                }
            });
        }
    },
    nav: function (obj, callback) {
        var titleEle = document.getElementsByTagName('title')[0],
            canonicalStr = this.canonical + "#!" + this.id,
            pipeId = " | " + this.id;
        //navigate
        if (typeof this.ele !== 'undefined' && this.ele !== null && this.ele.hasAttribute('page')) {
            var elements = document.getElementsByTagName('*');
            var i = 0,len;
            for (i = 0, len = elements.length; i < len; i++) {
                var itm = elements[i];
                if (itm.getAttribute('page')) {
                    if (itm.getAttribute('page') === this.id) {
                        itm.style.display = 'inherit';
                    } else {
                        itm.style.display = 'none';
                    }
                }
            }
        // HTML5 history state
        if (window.history.replaceState) {
            // was a title given
            if ( typeof obj === 'object' && typeof obj.title !== 'undefined' ) {
                //title legacy: this is not currently supported by any major browsers.
                titleEle.innerHTML = obj.title;
                window.history.pushState({
                    page: this.id
                }, obj.title, canonicalStr );                
            } else {
                // is there a page-title attribute
                if (this.ele.hasAttribute('page-title')) {
                    //title legacy: this is not currently supported by any major browsers.
                    titleEle.innerHTML = this.ele.getAttribute('page-title');
                    window.history.pushState({
                        page: this.id
                    }, this.ele.getAttribute('page-title'), canonicalStr );                
                } else {
                    // is there an orriginal page title to prepend
                    if (typeof window.meta === 'object' && typeof window.meta.title !== 'undefined') {
                        //title legacy: this is not currently supported by any major browsers.
                        titleEle.innerHTML = window.meta.title + pipeId;
                        window.history.pushState({
                            page: this.id
                        }, window.meta.title + pipeId, canonicalStr );                
                    } else { 
                        // prepend the current page title
                        //title legacy: this is not currently supported by any major browsers.
                        titleEle.innerHTML = this.page_title + pipeId;
                        window.history.pushState({
                            page: this.id
                        }, this.page_title + pipeId, canonicalStr );                
                    }
                }
            }
        } else {
            // update Title
            // was a title given
            if ( typeof obj === 'object' && typeof obj.title !== 'undefined' ) {
                titleEle.innerHTML = obj.title;
            } else {
                // is there a page-title attribute
                if (this.ele.hasAttribute('page-title')) {
                    titleEle.innerHTML = this.ele.getAttribute('page-title');
                } else {
                    // is there an orriginal page title to prepend
                    if (typeof window.meta === 'object' && typeof window.meta.title !== 'undefined') {
                        titleEle.innerHTML = window.meta.title + pipeId;
                    } else { 
                        // prepend the current page title
                        titleEle.innerHTML = this.page_title + pipeId;
                    }
                }
            }
        }
            // Update canonical
            var link_arr = document.getElementsByTagName("link");
            for (i = 0, len = link_arr.length; i < len; i++) {
                var itm = link_arr[i];
                if (itm.getAttribute('rel') === 'canonical') {
                    itm.href = canonicalStr;
                }
            }
            // Inform Google Analytics of the change
            if (typeof window._gaq !== 'undefined') {
                window._gaq.push(['_trackPageview', '/#!' + this.id]);
            }
            // Inform ReInvigorate of a state change
            if (typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined') {
                reinvigorate.ajax_track(window.location);
                // ^ we use the full url here as that is what reinvigorate supports
            }
            if (typeof callback !== 'undefined') {
                var self = this;
                return callback( { page: self.id, title: titleEle.innerHTML, node: self.ele } );
            } else {
                return this;
            }
        } else {
            console.log("PagesJS: nav method only available for page selector");
            return false;
        }
    },
    removePage: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null && this.ele.hasAttribute('page')) {
            this.ele.removeAttribute("page");
            return this;
        } else {
            console.log("PagesJS: invalid selector or no page attribute");
            return false;
        }
    }
};
