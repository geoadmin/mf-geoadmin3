/* Polyfill service v3.21.3
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 * 
 * UA detected: curl/7.38.0 (unknown/unsupported; using policy `unknown=polyfill`)
 * Features requested: Array.isArray,Element.prototype.classList,URL,requestAnimationFrame
 * 
 * - Object.defineProperty, License: CC0 (required by "Array.isArray", "Element.prototype.classList", "Object.defineProperties", "URL")
 * - Array.isArray, License: CC0
 * - _DOMTokenList, License: CC0 (required by "Element.prototype.classList")
 * - Document, License: CC0 (required by "Element", "Element.prototype.classList")
 * - Element, License: CC0 (required by "Element.prototype.classList")
 * - Element.prototype.classList, License: CC0
 * - Object.defineProperties, License: CC0 (required by "URL")
 * - Array.prototype.forEach, License: CC0 (required by "URL")
 * - URL, License: CC0
 * - Date.now, License: CC0 (required by "requestAnimationFrame", "performance.now")
 * - performance.now, License: CC0 (required by "requestAnimationFrame")
 * - requestAnimationFrame, License: MIT */

(function(undefined) {
if (!(// In IE8, defineProperty could only act on DOM elements, so full support
// for the feature requires the ability to set a property on an arbitrary object
'defineProperty' in Object && (function() {
	try {
		var a = {};
		Object.defineProperty(a, 'test', {value:42});
		return true;
	} catch(e) {
		return false
	}
}()))) {

// Object.defineProperty
(function (nativeDefineProperty) {

	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	Object.defineProperty = function defineProperty(object, property, descriptor) {

		// Where native support exists, assume it
		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
			return nativeDefineProperty(object, property, descriptor);
		}

		if (object === null || !(object instanceof Object || typeof object === 'object')) {
			throw new TypeError('Object.defineProperty called on non-object');
		}

		if (!(descriptor instanceof Object)) {
			throw new TypeError('Property description must be an object');
		}

		var propertyString = String(property);
		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
		var getterType = 'get' in descriptor && typeof descriptor.get;
		var setterType = 'set' in descriptor && typeof descriptor.set;

		// handle descriptor.get
		if (getterType) {
			if (getterType !== 'function') {
				throw new TypeError('Getter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			object.__defineGetter__(propertyString, descriptor.get);
		} else {
			object[propertyString] = descriptor.value;
		}

		// handle descriptor.set
		if (setterType) {
			if (setterType !== 'function') {
				throw new TypeError('Setter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			object.__defineSetter__(propertyString, descriptor.set);
		}

		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
		if ('value' in descriptor) {
			object[propertyString] = descriptor.value;
		}

		return object;
	};
}(Object.defineProperty));

}

if (!('isArray' in Array)) {

// Array.isArray
(function (toString) {
	Object.defineProperty(Array, 'isArray', {
		configurable: true,
		value: function isArray(object) {
			return toString.call(object) === '[object Array]';
		},
		writable: true
	});
}(Object.prototype.toString));

}


// _DOMTokenList
var _DOMTokenList = (function () { // eslint-disable-line no-unused-vars

	function tokenize(token) {
		if (/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(token)) {
			return String(token);
		} else {
			throw new Error('InvalidCharacterError: DOM Exception 5');
		}
	}

	function toObject(self) {
		for (var index = -1, object = {}, element; element = self[++index];) {
			object[element] = true;
		}

		return object;
	}

	function fromObject(self, object) {
		var array = [], token;

		for (token in object) {
			if (object[token]) {
				array.push(token);
			}
		}

		[].splice.apply(self, [0, self.length].concat(array));
	}

	var DTL = function() {};

	DTL.prototype = {
		constructor: DTL,
		item: function item(index) {
			return this[parseFloat(index)] || null;
		},
		length: Array.prototype.length,
		toString: function toString() {
			return [].join.call(this, ' ');
		},

		add: function add() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = true;
			}

			fromObject(this, object);
		},
		contains: function contains(token) {
			return token in toObject(this);
		},
		remove: function remove() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = false;
			}

			fromObject(this, object);
		},
		toggle: function toggle(token) {
			var
			object = toObject(this),
			contains = 1 in arguments ? !arguments[1] : tokenize(token) in object;

			object[token] = !contains;

			fromObject(this, object);

			return !contains;
		}
	};

	return DTL;

}());
if (!("Document" in this)) {

// Document
if (this.HTMLDocument) { // IE8

	// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
	this.Document = this.HTMLDocument;

} else {

	// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
	this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
	this.Document.prototype = document;
}

}

if (!('Element' in this && 'HTMLElement' in this)) {

// Element
(function () {

	// IE8
	if (window.Element && !window.HTMLElement) {
		window.HTMLElement = window.Element;
		return;
	}

	// create Element constructor
	window.Element = window.HTMLElement = new Function('return function Element() {}')();

	// generate sandboxed iframe
	var vbody = document.appendChild(document.createElement('body'));
	var frame = vbody.appendChild(document.createElement('iframe'));

	// use sandboxed iframe to replicate Element functionality
	var frameDocument = frame.contentWindow.document;
	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	var cache = {};

	// polyfill Element.prototype on an element
	var shiv = function (element, deep) {
		var
		childNodes = element.childNodes || [],
		index = -1,
		key, value, childNode;

		if (element.nodeType === 1 && element.constructor !== Element) {
			element.constructor = Element;

			for (key in cache) {
				value = cache[key];
				element[key] = value;
			}
		}

		while (childNode = deep && childNodes[++index]) {
			shiv(childNode, deep);
		}

		return element;
	};

	var elements = document.getElementsByTagName('*');
	var nativeCreateElement = document.createElement;
	var interval;
	var loopLimit = 100;

	prototype.attachEvent('onpropertychange', function (event) {
		var
		propertyName = event.propertyName,
		nonValue = !cache.hasOwnProperty(propertyName),
		newValue = prototype[propertyName],
		oldValue = cache[propertyName],
		index = -1,
		element;

		while (element = elements[++index]) {
			if (element.nodeType === 1) {
				if (nonValue || element[propertyName] === oldValue) {
					element[propertyName] = newValue;
				}
			}
		}

		cache[propertyName] = newValue;
	});

	prototype.constructor = Element;

	if (!prototype.hasAttribute) {
		// <Element>.hasAttribute
		prototype.hasAttribute = function hasAttribute(name) {
			return this.getAttribute(name) !== null;
		};
	}

	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
	function bodyCheck() {
		if (!(loopLimit--)) clearTimeout(interval);
		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
			shiv(document, true);
			if (interval && document.body.prototype) clearTimeout(interval);
			return (!!document.body.prototype);
		}
		return false;
	}
	if (!bodyCheck(true)) {
		document.onreadystatechange = bodyCheck;
		interval = setInterval(bodyCheck, 25);
	}

	// Apply to any new elements created after load
	document.createElement = function createElement(nodeName) {
		var element = nativeCreateElement(String(nodeName).toLowerCase());
		return shiv(element);
	};

	// remove sandboxed iframe
	document.removeChild(vbody);
}());

}

if (!('document' in this && "classList" in document.documentElement)) {

// Element.prototype.classList
Object.defineProperty(Element.prototype, 'classList', {
	configurable: true,
	get: function () {

		function pull() {
			var className = (typeof element.className === "object" ? element.className.baseVal : element.className);
			[].splice.apply(classList, [0, classList.length].concat((className || '').replace(/^\s+|\s+$/g, '').split(/\s+/)));
		}

		function push() {
			if (element.attachEvent) {
				element.detachEvent('onpropertychange', pull);
			}

			if (typeof element.className === "object") {
				element.className.baseVal = original.toString.call(classList);
			} else {
				element.className = original.toString.call(classList);
			}

			if (element.attachEvent) {
				element.attachEvent('onpropertychange', pull);
			}
		}

		var element = this;
		var original = _DOMTokenList.prototype;
		var ClassList = function ClassList() {};
		var classList;

		ClassList.prototype = new _DOMTokenList;

		ClassList.prototype.item = function item(index) { // eslint-disable-line no-unused-vars
			return pull(), original.item.apply(classList, arguments);
		};

		ClassList.prototype.toString = function toString() {
			return pull(), original.toString.apply(classList, arguments);
		};

		ClassList.prototype.add = function add() {
			return pull(), original.add.apply(classList, arguments), push();
		};

		ClassList.prototype.contains = function contains(token) { // eslint-disable-line no-unused-vars
			return pull(), original.contains.apply(classList, arguments);
		};

		ClassList.prototype.remove = function remove() {
			return pull(), original.remove.apply(classList, arguments), push();
		};

		ClassList.prototype.toggle = function toggle(token) {
			return pull(), token = original.toggle.apply(classList, arguments), push(), token;
		};

		classList = new ClassList;

		if (element.attachEvent) {
			element.attachEvent('onpropertychange', pull);
		}

		return classList;
	}
});

}

if (!('defineProperties' in Object)) {

// Object.defineProperties
Object.defineProperties = function defineProperties(object, descriptors) {
	for (var property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}

	return object;
};

}

if (!('forEach' in Array.prototype)) {

// Array.prototype.forEach
Array.prototype.forEach = function forEach(callback) {
	if (this === undefined || this === null) {
		throw new TypeError(this + ' is not an object');
	}

	if (typeof callback !== 'function') {
		throw new TypeError(callback + ' is not a function');
	}

	var
	object = Object(this),
	scope = arguments[1],
	arraylike = object instanceof String ? object.split('') : object,
	length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
	index = -1;

	while (++index < length) {
		if (index in arraylike) {
			callback.call(scope, arraylike[index], index, object);
		}
	}
};

}

if (!((function (global) {
	/*
	 * Browsers may have:
	 * No global URL object
	 * URL with static methods only - may have a dummy constructor
	 * URL with members except searchParams
	 * Full URL API support
	 */
	'use strict';

	try {
		var nativeURL = new global.URL('http://example.com');

		return 'href' in nativeURL && 'searchParams' in nativeURL;
	}
	catch (error) {
		return false;
	}
}(this)))) {

// URL
// URL Polyfill
// Draft specification: https://url.spec.whatwg.org

// Notes:
// - Primarily useful for parsing URLs and modifying query parameters
// - Should work in IE8+ and everything more modern, with es5.js polyfills

(function (global) {
  'use strict';

  function isSequence(o) {
    if (!o) return false;
    if ('Symbol' in global && 'iterator' in global.Symbol &&
        typeof o[Symbol.iterator] === 'function') return true;
    if (Array.isArray(o)) return true;
    return false;
  }

  function toArray(iter) {
    return ('from' in Array) ? Array.from(iter) : Array.prototype.slice.call(iter);
  }

  (function() {

    // Browsers may have:
    // * No global URL object
    // * URL with static methods only - may have a dummy constructor
    // * URL with members except searchParams
    // * Full URL API support
    var origURL = global.URL;
    var nativeURL;
    try {
      if (origURL) {
        nativeURL = new global.URL('http://example.com');
        if ('searchParams' in nativeURL)
          return;
        if (!('href' in nativeURL))
          nativeURL = undefined;
      }
    } catch (_) {}

    // NOTE: Doesn't do the encoding/decoding dance
    function urlencoded_serialize(pairs) {
      var output = '', first = true;
      pairs.forEach(function (pair) {
        var name = encodeURIComponent(pair.name);
        var value = encodeURIComponent(pair.value);
        if (!first) output += '&';
        output += name + '=' + value;
        first = false;
      });
      return output.replace(/%20/g, '+');
    }

    // NOTE: Doesn't do the encoding/decoding dance
    function urlencoded_parse(input, isindex) {
      var sequences = input.split('&');
      if (isindex && sequences[0].indexOf('=') === -1)
        sequences[0] = '=' + sequences[0];
      var pairs = [];
      sequences.forEach(function (bytes) {
        if (bytes.length === 0) return;
        var index = bytes.indexOf('=');
        if (index !== -1) {
          var name = bytes.substring(0, index);
          var value = bytes.substring(index + 1);
        } else {
          name = bytes;
          value = '';
        }
        name = name.replace(/\+/g, ' ');
        value = value.replace(/\+/g, ' ');
        pairs.push({ name: name, value: value });
      });
      var output = [];
      pairs.forEach(function (pair) {
        output.push({
          name: decodeURIComponent(pair.name),
          value: decodeURIComponent(pair.value)
        });
      });
      return output;
    }

    function URLUtils(url) {
      if (nativeURL)
        return new origURL(url);
      var anchor = document.createElement('a');
      anchor.href = url;
      return anchor;
    }

    function URLSearchParams(init) {
      var $this = this;
      this._list = [];

      if (init === undefined || init === null) {
        // no-op
      } else if (init instanceof URLSearchParams) {
        // In ES6 init would be a sequence, but special case for ES5.
        this._list = urlencoded_parse(String(init));
      } else if (typeof init === 'object' && isSequence(init)) {
        toArray(init).forEach(function(e) {
          if (!isSequence(e)) throw TypeError();
          var nv = toArray(e);
          if (nv.length !== 2) throw TypeError();
          $this._list.push({name: String(nv[0]), value: String(nv[1])});
        });
      } else if (typeof init === 'object' && init) {
        Object.keys(init).forEach(function(key) {
          $this._list.push({name: String(key), value: String(init[key])});
        });
      } else {
        init = String(init);
        if (init.substring(0, 1) === '?')
          init = init.substring(1);
        this._list = urlencoded_parse(init);
      }

      this._url_object = null;
      this._setList = function (list) { if (!updating) $this._list = list; };

      var updating = false;
      this._update_steps = function() {
        if (updating) return;
        updating = true;

        if (!$this._url_object) return;

        // Partial workaround for IE issue with 'about:'
        if ($this._url_object.protocol === 'about:' &&
            $this._url_object.pathname.indexOf('?') !== -1) {
          $this._url_object.pathname = $this._url_object.pathname.split('?')[0];
        }

        $this._url_object.search = urlencoded_serialize($this._list);

        updating = false;
      };
    }


    Object.defineProperties(URLSearchParams.prototype, {
      append: {
        value: function (name, value) {
          this._list.push({ name: name, value: value });
          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      'delete': {
        value: function (name) {
          for (var i = 0; i < this._list.length;) {
            if (this._list[i].name === name)
              this._list.splice(i, 1);
            else
              ++i;
          }
          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      get: {
        value: function (name) {
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              return this._list[i].value;
          }
          return null;
        }, writable: true, enumerable: true, configurable: true
      },

      getAll: {
        value: function (name) {
          var result = [];
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              result.push(this._list[i].value);
          }
          return result;
        }, writable: true, enumerable: true, configurable: true
      },

      has: {
        value: function (name) {
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              return true;
          }
          return false;
        }, writable: true, enumerable: true, configurable: true
      },

      set: {
        value: function (name, value) {
          var found = false;
          for (var i = 0; i < this._list.length;) {
            if (this._list[i].name === name) {
              if (!found) {
                this._list[i].value = value;
                found = true;
                ++i;
              } else {
                this._list.splice(i, 1);
              }
            } else {
              ++i;
            }
          }

          if (!found)
            this._list.push({ name: name, value: value });

          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      entries: {
        value: function() { return new Iterator(this._list, 'key+value'); },
        writable: true, enumerable: true, configurable: true
      },

      keys: {
        value: function() { return new Iterator(this._list, 'key'); },
        writable: true, enumerable: true, configurable: true
      },

      values: {
        value: function() { return new Iterator(this._list, 'value'); },
        writable: true, enumerable: true, configurable: true
      },

      forEach: {
        value: function(callback) {
          var thisArg = (arguments.length > 1) ? arguments[1] : undefined;
          this._list.forEach(function(pair, index) {
            callback.call(thisArg, pair.value, pair.name);
          });

        }, writable: true, enumerable: true, configurable: true
      },

      toString: {
        value: function () {
          return urlencoded_serialize(this._list);
        }, writable: true, enumerable: false, configurable: true
      }
    });

    function Iterator(source, kind) {
      var index = 0;
      this['next'] = function() {
        if (index >= source.length)
          return {done: true, value: undefined};
        var pair = source[index++];
        return {done: false, value:
                kind === 'key' ? pair.name :
                kind === 'value' ? pair.value :
                [pair.name, pair.value]};
      };
    }

    if ('Symbol' in global && 'iterator' in global.Symbol) {
      Object.defineProperty(URLSearchParams.prototype, global.Symbol.iterator, {
        value: URLSearchParams.prototype.entries,
        writable: true, enumerable: true, configurable: true});
      Object.defineProperty(Iterator.prototype, global.Symbol.iterator, {
        value: function() { return this; },
        writable: true, enumerable: true, configurable: true});
    }

    function URL(url, base) {
      if (!(this instanceof global.URL))
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");

      if (base) {
        url = (function () {
          if (nativeURL) return new origURL(url, base).href;

          var doc;
          // Use another document/base tag/anchor for relative URL resolution, if possible
          if (document.implementation && document.implementation.createHTMLDocument) {
            doc = document.implementation.createHTMLDocument('');
          } else if (document.implementation && document.implementation.createDocument) {
            doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            doc.documentElement.appendChild(doc.createElement('head'));
            doc.documentElement.appendChild(doc.createElement('body'));
          } else if (window.ActiveXObject) {
            doc = new window.ActiveXObject('htmlfile');
            doc.write('<head><\/head><body><\/body>');
            doc.close();
          }

          if (!doc) throw Error('base not supported');

          var baseTag = doc.createElement('base');
          baseTag.href = base;
          doc.getElementsByTagName('head')[0].appendChild(baseTag);
          var anchor = doc.createElement('a');
          anchor.href = url;
          return anchor.href;
        }());
      }

      // An inner object implementing URLUtils (either a native URL
      // object or an HTMLAnchorElement instance) is used to perform the
      // URL algorithms. With full ES5 getter/setter support, return a
      // regular object For IE8's limited getter/setter support, a
      // different HTMLAnchorElement is returned with properties
      // overridden

      var instance = URLUtils(url || '');

      // Detect for ES5 getter/setter support
      // (an Object.defineProperties polyfill that doesn't support getters/setters may throw)
      var ES5_GET_SET = (function() {
        if (!('defineProperties' in Object)) return false;
        try {
          var obj = {};
          Object.defineProperties(obj, { prop: { 'get': function () { return true; } } });
          return obj.prop;
        } catch (_) {
          return false;
        }
      })();

      var self = ES5_GET_SET ? this : document.createElement('a');



      var query_object = new URLSearchParams(
        instance.search ? instance.search.substring(1) : null);
      query_object._url_object = self;

      Object.defineProperties(self, {
        href: {
          get: function () { return instance.href; },
          set: function (v) { instance.href = v; tidy_instance(); update_steps(); },
          enumerable: true, configurable: true
        },
        origin: {
          get: function () {
            if ('origin' in instance) return instance.origin;
            return this.protocol + '//' + this.host;
          },
          enumerable: true, configurable: true
        },
        protocol: {
          get: function () { return instance.protocol; },
          set: function (v) { instance.protocol = v; },
          enumerable: true, configurable: true
        },
        username: {
          get: function () { return instance.username; },
          set: function (v) { instance.username = v; },
          enumerable: true, configurable: true
        },
        password: {
          get: function () { return instance.password; },
          set: function (v) { instance.password = v; },
          enumerable: true, configurable: true
        },
        host: {
          get: function () {
            // IE returns default port in |host|
            var re = {'http:': /:80$/, 'https:': /:443$/, 'ftp:': /:21$/}[instance.protocol];
            return re ? instance.host.replace(re, '') : instance.host;
          },
          set: function (v) { instance.host = v; },
          enumerable: true, configurable: true
        },
        hostname: {
          get: function () { return instance.hostname; },
          set: function (v) { instance.hostname = v; },
          enumerable: true, configurable: true
        },
        port: {
          get: function () { return instance.port; },
          set: function (v) { instance.port = v; },
          enumerable: true, configurable: true
        },
        pathname: {
          get: function () {
            // IE does not include leading '/' in |pathname|
            if (instance.pathname.charAt(0) !== '/') return '/' + instance.pathname;
            return instance.pathname;
          },
          set: function (v) { instance.pathname = v; },
          enumerable: true, configurable: true
        },
        search: {
          get: function () { return instance.search; },
          set: function (v) {
            if (instance.search === v) return;
            instance.search = v; tidy_instance(); update_steps();
          },
          enumerable: true, configurable: true
        },
        searchParams: {
          get: function () { return query_object; },
          enumerable: true, configurable: true
        },
        hash: {
          get: function () { return instance.hash; },
          set: function (v) { instance.hash = v; tidy_instance(); },
          enumerable: true, configurable: true
        },
        toString: {
          value: function() { return instance.toString(); },
          enumerable: false, configurable: true
        },
        valueOf: {
          value: function() { return instance.valueOf(); },
          enumerable: false, configurable: true
        }
      });

      function tidy_instance() {
        var href = instance.href.replace(/#$|\?$|\?(?=#)/g, '');
        if (instance.href !== href)
          instance.href = href;
      }

      function update_steps() {
        query_object._setList(instance.search ? urlencoded_parse(instance.search.substring(1)) : []);
        query_object._update_steps();
      };

      return self;
    }

    if (origURL) {
      for (var i in origURL) {
        if (origURL.hasOwnProperty(i) && typeof origURL[i] === 'function')
          URL[i] = origURL[i];
      }
    }

    global.URL = URL;
    global.URLSearchParams = URLSearchParams;
  }());

  // Patch native URLSearchParams constructor to handle sequences/records
  // if necessary.
  (function() {
    if (new global.URLSearchParams([['a', 1]]).get('a') === '1' &&
        new global.URLSearchParams({a: 1}).get('a') === '1')
      return;
    var orig = global.URLSearchParams;
    global.URLSearchParams = function(init) {
      if (init && typeof init === 'object' && isSequence(init)) {
        var o = new orig();
        toArray(init).forEach(function(e) {
          if (!isSequence(e)) throw TypeError();
          var nv = toArray(e);
          if (nv.length !== 2) throw TypeError();
          o.append(nv[0], nv[1]);
        });
        return o;
      } else if (init && typeof init === 'object') {
        o = new orig();
        Object.keys(init).forEach(function(key) {
          o.set(key, init[key]);
        });
        return o;
      } else {
        return new orig(init);
      }
    };
  }());

}(self));

}

if (!('Date' in this && 'now' in this.Date && 'getTime' in this.Date.prototype)) {

// Date.now
Date.now = function now() {
	return new Date().getTime();
};

}

if (!('performance' in this && 'now' in this.performance)) {

// performance.now
(function (global) {

var
startTime = Date.now();

if (!global.performance) {
    global.performance = {};
}

global.performance.now = function () {
    return Date.now() - startTime;
};

}(this));

}

if (!('requestAnimationFrame' in this)) {

// requestAnimationFrame
(function (global) {
	var rafPrefix;

	if ('mozRequestAnimationFrame' in global) {
		rafPrefix = 'moz';

	} else if ('webkitRequestAnimationFrame' in global) {
		rafPrefix = 'webkit';

	}

	if (rafPrefix) {
		global.requestAnimationFrame = function (callback) {
		    return global[rafPrefix + 'RequestAnimationFrame'](function () {
		        callback(performance.now());
		    });
		};
		global.cancelAnimationFrame = global[rafPrefix + 'CancelAnimationFrame'];
	} else {

		var lastTime = Date.now();

		global.requestAnimationFrame = function (callback) {
			if (typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}

			var
			currentTime = Date.now(),
			delay = 16 + lastTime - currentTime;

			if (delay < 0) {
				delay = 0;
			}

			lastTime = currentTime;

			return setTimeout(function () {
				lastTime = Date.now();

				callback(performance.now());
			}, delay);
		};

		global.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}
}(this));

}

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
