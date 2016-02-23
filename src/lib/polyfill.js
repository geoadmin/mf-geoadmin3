/* For detailed credits and licence information see http://github.com/financial-times/polyfill-service.
 * 
 * UA detected: ie/9.0.0
 * Features requested: requestAnimationFrame
 * 
 * - performance.now, License: CC0 (required by "requestAnimationFrame")
 * - requestAnimationFrame, License: MIT */

(function(undefined) {

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

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});