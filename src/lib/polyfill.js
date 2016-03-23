/* For detailed credits and licence information see http://github.com/financial-times/polyfill-service.
 * 
 * UA detected: curl/7.26.0 (unknown/unsupported; using policy `unknown=polyfill`)
 * Features requested: Array.isArray,requestAnimationFrame
 * 
 * - Object.defineProperty, License: CC0 (required by "Array.isArray")
 * - Array.isArray, License: CC0
 * - Date.now, License: CC0 (required by "performance.now", "requestAnimationFrame")
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

		var propertyString = String(property);
		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
		var getterType = 'get' in descriptor && typeof descriptor.get;
		var setterType = 'set' in descriptor && typeof descriptor.set;

		if (object === null || !(object instanceof Object || typeof object === 'object')) {
			throw new TypeError('Object must be an object (Object.defineProperty polyfill)');
		}

		if (!(descriptor instanceof Object)) {
			throw new TypeError('Descriptor must be an object (Object.defineProperty polyfill)');
		}

		// handle descriptor.get
		if (getterType) {
			if (getterType !== 'function') {
				throw new TypeError('Getter expected a function (Object.defineProperty polyfill)');
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
				throw new TypeError('Setter expected a function (Object.defineProperty polyfill)');
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
})(Object.prototype.toString);
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

	if ('mozRequestAnimationFrame' in global) {
		global.requestAnimationFrame = function (callback) {
		    return mozRequestAnimationFrame(function () {
		        callback(performance.now());
		    });
		};
		global.cancelAnimationFrame = mozCancelAnimationFrame;

	} else if ('webkitRequestAnimationFrame' in global) {
		global.requestAnimationFrame = function (callback) {
		    return webkitRequestAnimationFrame(function () {
		        callback(performance.now());
		    });
		};
		global.cancelAnimationFrame = webkitCancelAnimationFrame;

	} else {

		var lastTime = Date.now();

		global.requestAnimationFrame = function (callback) {
			if (typeof callback !== 'function') {
				throw new TypeError(callback + 'is not a function');
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
})(this);
}


})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});