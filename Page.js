/** 
 * @projectDescription  Page.js is a small JavaSciprt Framework originally built as an experiment in designing single page applications.
 *                      As Page.js evolved it aimed to solve the common problems associated with writing this new style of application. It became clear early on that Page.js was well suited for building simple single page applications without the requirement of heavier libraries such as jQuery to perform simple DOM related functions.
 *
 * @author  Christopher D. Langton chris@codewiz.biz
 * @version     0.5
 */
//fixes for old browsers
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (classname) {
        var elArray = [];
        var tmp = document.getElementsByTagName("*");
        var regex = new RegExp("(^|\s)" + classname + "(\s|$)");
        for (var i = 0; i < tmp.length; i++) {
            if (regex.test(tmp[i].className)) {
                elArray.push(tmp[i]);
            }
        }
        return elArray;
    };
}
if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === item) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    };
}
//	page Object Constructor
function page(id) {
    // About object is returned if there is no 'id' parameter
    var about = {
        Library: "Pages.js",
        Version: 0.5,
        Author: "Christopher D. Langton",
        Website: "http:\/\/chrisdlangton.com",
        Created: "2013-02-03",
        Updated: "2013-02-06"
    };
    if (id) {
        // return a new page object if we're in the window scope
        if (window === this) {
            return new page(id);
        }
        // Init our element object and return the object
        if (id.charAt(0) === '#') {
            id = id.substring(1);
            this.id = id;
            if (typeof (document.getElementById(id)) !== 'undefined' && document.getElementById(id) !== null) {
                this.ele = document.getElementById(id);
                return this;
            } else {
                console.log("Page.js: unknown element");
                return false;
            }
        } else if (id.charAt(0) === '.') {
            id = id.substring(1);
            this.id = id;
            if (typeof (document.getElementsByClassName(id)) !== 'undefined' && document.getElementsByClassName(id) !== null) {
                this.ele = document.getElementsByClassName(id);
                return this;
            } else {
                console.log("Page.js: unknown element");
                return false;
            }
        } else if (id.charAt(0) === '_') {
            id = id.substring(1);
            this.id = id;
            var elements = document.getElementsByTagName('*');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute('page')) {
                    // return element when found with attribute page matching id.
                    if (elements[i].getAttribute('page') === id) {
                        this.ele = elements[i];
                        i = elements.length;
                        return this;
                    }
                }
            }
        } else {
            console.log("Page.js: invalid selector");
            return false;
        }
    } else {
        // No id paramter was given, return the about object
        return about;
    }
};
//	Page.js prototype methods
page.prototype = {
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
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                for (var i = 0, len = this.ele.length; i < len; ++i) {
                    if (this.ele[i].style.display !== 'none') {
                        this.ele[i].style.display = 'none';
                    } else {
                        this.ele[i].style.display = 'inherit';
                    }
                }
                return this;
            } else {
                if (this.ele.style.display !== 'none') {
                    this.ele.style.display = 'none';
                } else {
                    this.ele.style.display = 'inherit';
                }
                return this;
            }
        } else {
            return false;
        }
    },
    trim: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('Page.js: method available for unique selectors only.');
                return false;
            }
            if (typeof this.ele.value === "string") {
                return this.ele.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            } else if (typeof this.ele.innerHTML === "string") {
                return this.ele.innerHTML.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    disable: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('Page.js: method available for unique selectors only.');
                return false;
            }
            if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                this.ele.disabled = true;
                return this;
            } else {
                var inputs = this.ele.getElementsByTagName("input");
                var i = 0;
                for (i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = true;
                }
                var selects = this.ele.getElementsByTagName("select");
                for (i = 0; i < selects.length; i++) {
                    selects[i].disabled = true;
                }
                var textareas = this.ele.getElementsByTagName("textarea");
                for (i = 0; i < textareas.length; i++) {
                    textareas[i].disabled = true;
                }
                var buttons = this.ele.getElementsByTagName("button");
                for (i = 0; i < buttons.length; i++) {
                    buttons[i].disabled = true;
                }
                return this;
            }
        } else {
            return false;
        }
    },
    enable: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('Page.js: method available for unique selectors only.');
                return false;
            }
            if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                this.ele.disabled = false;
                return this;
            } else {
                var inputs = this.ele.getElementsByTagName("input");
                var i = 0;
                for (i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = false;
                }
                var selects = this.ele.getElementsByTagName("select");
                for (i = 0; i < selects.length; i++) {
                    selects[i].disabled = false;
                }
                var textareas = this.ele.getElementsByTagName("textarea");
                for (i = 0; i < textareas.length; i++) {
                    textareas[i].disabled = false;
                }
                var buttons = this.ele.getElementsByTagName("button");
                for (i = 0; i < buttons.length; i++) {
                    buttons[i].disabled = false;
                }
                return this;
            }
        } else {
            return false;
        }
    },
    stringify: function (obj) {
        if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
            console.log('Page.js: method available for unique selectors only.');
            return false;
        }
        if (obj && typeof obj === 'object') {
            if (window.JSON && window.JSON.stringify) {
                if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
                    this.ele.value = window.JSON.stringify(obj, function (key, value) {
                        if (typeof value === 'number' && !isFinite(value)) {
                            return String(value);
                        }
                        return value;
                    });
                } else {
                    this.ele.innerHTML = window.JSON.stringify(obj, function (key, value) {
                        if (typeof value === 'number' && !isFinite(value)) {
                            return String(value);
                        }
                        return value;
                    });
                }
                return this;
            } else {
                console.log('Page.js: browser doesnt support json natively');
                return false;
            }
        } else {
            console.log('Page.js: stringify accepts an object');
            return false;
        }
    },
    parse: function () {
        if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
            console.log('Page.js: method available for unique selectors only.');
            return false;
        }
        var data = "";
		if ((this.ele.tagName && this.ele.tagName.toLowerCase() === "textarea") || (this.ele.tagName && this.ele.tagName.toLowerCase() === "input" && this.ele.type.toLowerCase() === "text")) {
			if (typeof this.ele.value === "string" && this.ele.value !== null) {
				data = this.ele.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(data);
				} else {
					console.log('Page.js: browser doesnt support json natively');
					return false;
				}
			} else {
				console.log('Page.js: parse accepts a string');
				return false;
			}
		} else {
			if (typeof this.ele.innerHTML === "string" && this.ele.innerHTML !== null) {
				data = this.ele.innerHTML.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(data);
				} else {
					console.log('Page.js: browser doesnt support json natively');
					return false;
				}
			}			
		}
    },
    html: function (replacement) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                console.log('Page.js: method available for unique selectors only.');
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
                console.log('Page.js: method available for unique selectors only.');
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
				console.log('Page.js: method available for input selectors only.');
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
                console.log('Page.js: method available for unique selectors only.');
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
                for (i = 0; i < classes.length; i++) {
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
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            var len, i = 0;
            if (typeof remClass === 'undefined' || this.ele === null) {
                if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                    for (i = 0, len = this.ele.length; i < len; ++i) {
                        this.ele[i].className = "";
                    }
                    return this;
                } else {
                    this.ele.className = "";
                    return this;
                }
            } else {
                if (typeof this.ele[1] !== 'undefined' && this.ele[1] !== null) {
                    for (i = 0, len = this.ele.length; i < len; ++i) {
                        while ((' ' + this.ele[i].className + ' ').indexOf(' ' + remClass + ' ') > -1) {
                            this.ele[i].className = this.ele[i].className.replace(new RegExp('\\b' + remClass + '\\b'), '');
                        }
                    }
                    return this;
                } else {
                    while ((' ' + this.ele.className + ' ').indexOf(' ' + remClass + ' ') > -1) {
                        this.ele.className = this.ele.className.replace(new RegExp('\\b' + remClass + '\\b'), '');
                    }
                    return this;
                }
            }
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
                console.log('Page.js: method available for unique selectors only.');
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
                console.log('Page.js: method available for unique selectors only.');
                return false;
            }
            this.ele.innerHTML = elems + this.ele.innerHTML;
            return this;
        } else {
            return false;
        }
    },
    // methods available to page selectors only
    nav: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null && this.ele.hasAttribute('page')) {
            var elements = document.getElementsByTagName('*');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute('page')) {
                    if (elements[i].getAttribute('page') === this.id) {
                        elements[i].style.display = 'inherit';
                    } else {
                        elements[i].style.display = 'none';
                    }
                }
            }
            return this;
        } else {
            console.log("Page.js: nav method only available for page selector");
            return false;
        }
    },
    addPage: function (value) {
        if (typeof this.ele !== 'undefined' && this.ele !== null) {
            if (this.ele.hasAttribute('page')) {
                console.log("Page.js: page already exists as '" + this.ele.getAttribute('page') + "'");
                return false;
            } else {
                this.ele.setAttribute("page", value);
                return this;
            }
        } else {
            console.log("Page.js: invalid selector");
            return false;
        }
    },
    removePage: function () {
        if (typeof this.ele !== 'undefined' && this.ele !== null && this.ele.hasAttribute('page')) {
            this.ele.removeAttribute("page");
            return this;
        } else {
            console.log("Page.js: invalid selector or no page attribute");
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
                return this.ele.getAttribute('page') === this.id ? true : false;
            } else {
                return false;
            }
        }
    }
};
var hash = window.location.hash.substring(1);
if (hash.length > 1) {
    if (page('_' + hash).exist()) {
        page('_' + hash).nav();
    }
}
if ("onhashchange" in window) {
    window.onhashchange = function () {
        hash = window.location.hash.substring(1);
        if (hash.length > 1) {
            if (page('_' + hash).exist()) {
                page('_' + hash).nav();
            }
        }
    };
} else {
    var prevHash = window.location.hash;
    window.setInterval(function () {
        if (window.location.hash !== prevHash) {
            hash = window.location.hash.substring(1);
            if (hash.length > 1) {
                if (page('_' + hash).exist()) {
                    page('_' + hash).nav();
                }
            }
        }
    }, 100);
};