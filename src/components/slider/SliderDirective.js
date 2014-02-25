/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Prajwal Manjunath <prajwalkman@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function() {
  goog.provide('ga_slider_directive');

  var module = angular.module('ga_slider_directive', []);

  var MODULE_NAME, SLIDER_TAG, angularize, bindHtml, gap,
  halfWidth, hide, inputEvents, module, offset, offsetLeft,
  pixelize, qualifiedDirectiveDefinition, roundStep, show,
  sliderDirective, width;

  angularize = function(element) {
    return angular.element(element);
  };

  pixelize = function(position) {
    return '' + position + 'px';
  };

  hide = function(element) {
    return element.css({
      opacity: 0
    });
  };

  show = function(element) {
    return element.css({
      opacity: 1
    });
  };

  offset = function(element, position) {
    return element.css({
      left: position
    });
  };

  halfWidth = function(element) {
    return element[0].offsetWidth / 2;
  };

  offsetLeft = function(element) {
    return element[0].offsetLeft;
  };

  width = function(element) {
    return element[0].offsetWidth;
  };

  gap = function(element1, element2) {
    return offsetLeft(element2) - offsetLeft(element1) - width(element1);
  };

  bindHtml = function(element, html) {
    return element.attr('ng-bind-template', '{{' + html + '}}');
  };

  roundStep = function(value, precision, step, floor) {
    var decimals, remainder, roundedValue, steppedValue;

    if (floor == null) {
      floor = 0;
    }
    if (step == null) {
      step = 1 / Math.pow(10, precision);
    }
    remainder = (value - floor) % step;
    steppedValue = remainder > (step / 2) ? value + step - remainder :
        value - remainder;
    decimals = Math.pow(10, precision);
    roundedValue = steppedValue * decimals / decimals;
    return parseFloat(roundedValue.toFixed(precision));
  };

  // RE3: Get the X coordinate of a mouse event
  var getMouseEventX = function(event) {
    if (event.originalEvent) {
      event = event.originalEvent;
    }
    return event.clientX || event.touches[0].clientX;
  };

  // RE3: Get the offset left of an mouse event from a
  // specific HTML element
  var getMouseOffsetLeft = function(event, element) {
    return getMouseEventX(event) - element[0].getBoundingClientRect().left;
  };

  var nextValue = function(value, list) {
    if (list && list.length > 0) {
      for (var i = list.length - 1; i >= 0; i--) {
        var elt = list[i];
        if (elt.value === value) {
          value = magnetize(value, list.slice(0, i));
          break;
        }
      }
    }
    return value;
  };

  var previousValue = function(value, list) {
    if (list && list.length > 0) {
      for (var i = 0, len = list.length; i < len; i++) {
        var elt = list[i];
        if (elt.value === value) {
          value = magnetize(value, list.slice(i + 1));
          break;
        }
      }
    }
    return value;
  };


  // RE3: Get the closest value from a data list
  var magnetize = function(value, list) {
    if (list && list.length > 0) {
      var minGap = null;
      for (var i = 0, len = list.length; i < len; i++) {
        var elt = list[i];
        if (elt.available) {
          var gap = elt.value - value;
          minGap = (!minGap || (Math.abs(gap) < Math.abs(minGap))) ?
              gap : minGap;
          if (elt.value === value) {
            break;
          }
        }
      }

      if (minGap) {
        value += minGap;
      }
    }
    return value;
  };


  inputEvents = {
    mouse: {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    touch: {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    },
    touchIE: {
      start: 'MSPointerDown',
      move: 'MSPointerMove',
      end: 'MSPointerUp'
    }
  };

  module.directive('gaFormatInputValue', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }

        // Specify how UI should be updated
        ngModel.$render = function() {
          element[0].value = scope.translate2({value: ngModel.$viewValue});
        };
      }
    };
  });

  module.directive('gaSlider', function($timeout, $sce, $document) {
    return {
      restrict: 'A',
      scope: {
        floor: '@',
        ceiling: '@',
        step: '@',
        precision: '@',
        ngModel: '=?',
        ngModelLow: '=?',
        ngModelHigh: '=?',
        translate2: '&',
        dataList: '=?gaData', //RE3: Contains all the possible values
        redraw: '=?gaRedraw', // RE3: Force the redraw of the slider
        useKeyboardEvents: '=?gaKeyboardEvents', // RE3: Add keyboard events
        useMagnetize: '=?gaMagnetize', // RE3: Allow only available values
        useInputText: '=?gaInputText', // RE3: Add input text
        unfitToBar: '=?gaUnfitToBar' // RE3: The value is defined by the
        // center of the pointer
      },
      templateUrl: 'components/slider/partials/slider.html',
      compile: function(element, attributes) {
        var ceilBub, cmbBub, e, flrBub, fullBar, highBub, lowBub, maxPtr,
            minPtr, range, refHigh, refLow, selBar, selBub, watchables,
            _i, _len, _ref = [];

        if (attributes.translate2) {
          attributes.$set('translate2', '' + attributes.translate2 + '(value)');
        }

        // Defines HTML elements
        angular.forEach(element.find('.ga-slider').children(), function(elt) {
          _ref.push(angularize(elt));
        });

        fullBar = _ref[0], selBar = _ref[1], minPtr = _ref[2],
            maxPtr = _ref[3], selBub = _ref[4], flrBub = _ref[5],
            ceilBub = _ref[6], lowBub = _ref[7], highBub = _ref[8],
            cmbBub = _ref[9];

        // Defines elements attributes depending on the type of the slider
        // (basic or not)
        range = (attributes.ngModel == null) &&
            ((attributes.ngModelLow != null) &&
            (attributes.ngModelHigh != null));

        if (range) {
          refLow = 'ngModelLow';
          refHigh = 'ngModelHigh';
          bindHtml(lowBub, 'translate2({value:' + refLow + '})');
          bindHtml(selBub, 'translate2({value:"Range: " + diff})');
          bindHtml(highBub, 'translate2({value:' + refHigh + '})');
          bindHtml(cmbBub, 'translate2({value:' + refLow + ' + " - " + ' +
              refHigh + '})');

        } else {
          refLow = 'ngModel';

          // RE3: Remove the input text
          if (attributes.gaInputText !== 'true') {
            bindHtml(lowBub, 'translate2({value:' + refLow + '})');
            lowBub.find('input').remove();
          }

          // Remove useless elements
          angular.forEach([selBar, maxPtr, selBub, highBub, cmbBub],
              function(elt) {
                elt.remove();
              }
          );
        }

        // Defines watchables properties
        watchables = [refLow, 'floor', 'ceiling'];
        if (range) {
          watchables.push(refHigh);
        }

        return {
          post: function(scope, element, attributes, ngModel) {
            var barWidth, boundToInputs, dimensions, maxOffset, maxValue,
            minOffset, minValue, offsetRange, pointerHalfWidth,
            updateDOM, valueRange, w, _j, _len1;

            // RE3: Defines useMagnetize property
            scope.useMagnetize = (scope.dataList) ? scope.useMagnetize : false;

            // RE3: Add a function to valid a value
            scope.isValid = function(value) {
               return (value && value <= scope.ceiling && value >= scope.floor);
            };

            // RE3: Trigger when input value changes
            scope.onInputChange = function() {
              var value = parseFloat(scope[refLow]);
              if (scope.useMagnetize && scope.isValid(value)) {
                 scope[refLow] = magnetize(value, scope.dataList);
              }
            };

            // RE3: Defines the position of each division (use step = 1)
            var divisionWidth = 100 / (scope.ceiling - scope.floor);
            scope.assignDivisionStyle = function(index) {
              var style = {
                left: (index * divisionWidth) + '%'
              };
              return style;
            };

            boundToInputs = false;
            if (!attributes.translate2) {
              scope.translate2 = function(value) {
                return $sce.trustAsHtml('' + (value ? value.value : ''));
              };
            }

            pointerHalfWidth = barWidth = minOffset = maxOffset = minValue =
                maxValue = valueRange = offsetRange = void 0;

            dimensions = function() {
              var value, _j, _len1, _ref2, _ref3;

              if ((_ref2 = scope.precision) == null) {
                scope.precision = 0;
              }
              if ((_ref3 = scope.step) == null) {
                scope.step = 1;
              }
              for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                value = watchables[_j];
                scope[value] = roundStep(parseFloat(scope[value]),
                    parseInt(scope.precision), parseFloat(scope.step),
                    parseFloat(scope.floor));
              }

              scope.diff = roundStep(scope[refHigh] - scope[refLow],
                  parseInt(scope.precision), parseFloat(scope.step),
                  parseFloat(scope.floor));
              pointerHalfWidth = halfWidth(minPtr);
              barWidth = width(fullBar);

              // Before RE3: minOffset = 0
              minOffset = (scope.unfitToBar) ? 0 - pointerHalfWidth : 0;

              // Before RE3: maxOffset = barWidth - width(minPtr);
              maxOffset = (scope.unfitToBar) ? barWidth - pointerHalfWidth :
                  barWidth - width(minPtr);

              minValue = parseFloat(attributes.floor);
              maxValue = parseFloat(attributes.ceiling);
              valueRange = maxValue - minValue;

              // Before RE3: offsetRange = maxOffset - minOffset;
              return offsetRange = (scope.unfitToBar) ? barWidth :
                  maxOffset - minOffset;
            };
            updateDOM = function() {
              var adjustBubbles, bindToInputEvents,
                  fitToBar, percentOffset,
                  percentToOffset, percentToOffsetInt, percentValue,
                  setBindings, setPointers;

              dimensions();

              // RE3 add: Get the slider value from an offsetLeft
              var getValueFromOffset = function(offsetLeft) {
                var newPercent = percentOffset(offsetLeft);
                var newValue = minValue + (valueRange * newPercent / 100.0);
                newValue = roundStep(newValue, parseInt(scope.precision),
                    parseFloat(scope.step), parseFloat(scope.floor));

                // RE3: we magnetize the pointer to the available data
                if (scope.useMagnetize) {
                  newValue = magnetize(newValue, scope.dataList);
                }
                return newValue;
              };

              percentOffset = function(offset) {
                return ((offset - minOffset) / offsetRange) * 100;
              };
              percentValue = function(value) {
                return ((value - minValue) / valueRange) * 100;
              };

              // RE3 add
              percentToOffsetInt = function(percent) {
                 return percent * offsetRange / 100;
              };

              percentToOffset = function(percent) {
                return pixelize(percentToOffsetInt(percent));
              };
              fitToBar = function(element) {
                return offset(element, pixelize(Math.min(Math.max(0,
                    offsetLeft(element)), barWidth - width(element))));
              };
              setPointers = function() {
                var newHighValue, newLowValue;

                offset(ceilBub, pixelize(barWidth - width(ceilBub)));
                newLowValue = percentValue(scope[refLow]);

                // Before RE3: offset(minPtr, percentToOffset(newLowValue)
                offset(minPtr, (scope.unfitToBar) ? pixelize(
                     percentToOffsetInt(newLowValue) - halfWidth(minPtr)) :
                     percentToOffset(newLowValue));

                offset(lowBub, pixelize(offsetLeft(minPtr) -
                    (halfWidth(lowBub)) + pointerHalfWidth));

                if (range) {
                  newHighValue = percentValue(scope[refHigh]);

                  // Before RE3: offset(maxPtr, percentToOffset(newHighValue)
                  offset(maxPtr, (scope.unfitToBar) ? pixelize(
                      percentToOffsetInt(newHighValue) - halfWidth(maxPtr)) :
                      percentToOffset(newHighValue));

                  offset(highBub, pixelize(offsetLeft(maxPtr) -
                      (halfWidth(highBub)) + pointerHalfWidth));
                  offset(selBar, pixelize(offsetLeft(minPtr) +
                      pointerHalfWidth));
                  selBar.css({
                    width: percentToOffset(newHighValue - newLowValue)
                  });
                  offset(selBub, pixelize(offsetLeft(selBar) +
                      halfWidth(selBar) -
                      halfWidth(selBub)));
                  return offset(cmbBub, pixelize(offsetLeft(selBar) +
                      halfWidth(selBar) - halfWidth(cmbBub)));
                }
              };
              adjustBubbles = function() {
                var bubToAdjust;

                // RE3: the current value must be always centered on the handle
                // of the slider
                if (!scope.unfitToBar) {
                  fitToBar(lowBub);
                }
                bubToAdjust = highBub;
                if (range) {
                  if (!scope.unfitToBar) {
                    fitToBar(highBub);
                    fitToBar(selBub);
                  }
                  if (gap(lowBub, highBub) < 10) {
                    hide(lowBub);
                    hide(highBub);
                    fitToBar(cmbBub);
                    show(cmbBub);
                    bubToAdjust = cmbBub;
                  } else {
                    show(lowBub);
                    show(highBub);
                    hide(cmbBub);
                    bubToAdjust = highBub;
                  }
                }
                if (gap(flrBub, lowBub) < 5) {
                  hide(flrBub);
                } else {
                  if (range) {
                    if (gap(flrBub, bubToAdjust) < 5) {
                      hide(flrBub);
                    } else {
                      show(flrBub);
                    }
                  } else {
                    show(flrBub);
                  }
                }
                if (gap(lowBub, ceilBub) < 5) {
                  return hide(ceilBub);
                } else {
                  if (range) {
                    if (gap(bubToAdjust, ceilBub) < 5) {
                      return hide(ceilBub);
                    } else {
                      return show(ceilBub);
                    }
                  } else {
                    return show(ceilBub);
                  }
                }
              };
              bindToInputEvents = function(pointer, ref, events) {
                var onEnd, onMove, onStart, lastMouseOffsetLeft,
                    lastPointerOffsetLeft;

                onEnd = function() {
                  pointer.removeClass('ga-slider-active');
                  $document.unbind(events.move);
                  return $document.unbind(events.end);
                };

                onMove = function(event) {
                  // Get the current mouse cursor offset
                  var currentMouseOffsetLeft = getMouseOffsetLeft(event,
                      element);

                  // Calculate the diff with the cursor offset of the last
                  // mouse move event
                  var diff = currentMouseOffsetLeft - lastMouseOffsetLeft;

                  // Get the new pointer offset
                  var newOffset = lastPointerOffsetLeft + diff;
                  newOffset = Math.max(Math.min(newOffset, maxOffset),
                      minOffset);

                  // Set offset values for next mouse event
                  lastMouseOffsetLeft = currentMouseOffsetLeft;
                  lastPointerOffsetLeft = newOffset;

                  // Get the new slider value from the new pointer offset
                  var newValue = getValueFromOffset(newOffset);

                  if (range) {
                    if (ref === refLow) {
                      if (newValue > scope[refHigh]) {
                        ref = refHigh;
                        minPtr.removeClass('ga-slider-active');
                        maxPtr.addClass('ga-slider-active');
                      }
                    } else {
                      if (newValue < scope[refLow]) {
                        ref = refLow;
                        maxPtr.removeClass('ga-slider-active');
                        minPtr.addClass('ga-slider-active');
                      }
                    }
                  }
                  scope[ref] = newValue;
                  return scope.$apply();
                };
                onStart = function(event) {
                  lastMouseOffsetLeft = getMouseOffsetLeft(event, element);
                  lastPointerOffsetLeft = offsetLeft(pointer);
                  pointer.addClass('ga-slider-active');
                  dimensions();
                  event.stopPropagation();
                  event.preventDefault();
                  $document.bind(events.move, onMove);
                  return $document.bind(events.end, onEnd);
                };
                return pointer.bind(events.start, onStart);
              };

              setBindings = function() {
                var bind, _results = [];
                boundToInputs = true; // Verify the events are not added twice

                // Add pseudo-drag events to the pointer
                bind = function(method) {
                  bindToInputEvents(minPtr, refLow, inputEvents[method]);
                  return bindToInputEvents(maxPtr, refHigh,
                      inputEvents[method]);
                };
                angular.forEach(['touchIE', 'touch', 'mouse'],
                    function(elt) {
                      _results.push(bind(elt));
                    }
                );

                if (!range) {
                  // RE3: Add click event on the bar
                  _results.push(fullBar.bind('click', function(event) {
                    var offsetLeft = getMouseOffsetLeft(event, element) -
                         halfWidth(minPtr);
                    scope[refLow] = getValueFromOffset(offsetLeft);
                    return scope.$apply();
                  }));

                  var input = element.find('.ga-slider-value1 input');
                  _results.push(input.bind('keydown', function(event) {
                    // RE3: Stop propagation of arrows key event
                    if (event.which == 37 || event.which == 39) {
                      event.stopPropagation();
                    }
                  }));
                  _results.push(input.bind('blur', function(event) {
                    // RE3: if the user leave the input without having set
                    // a good value, we set the last good value saved.
                    if (scope.lastGoodValue) {
                      scope.$apply(function() {
                        scope[refLow] = scope.lastGoodValue;
                      });
                    }
                  }));

                }
                return _results;
              };

              setPointers();
              adjustBubbles();

              // RE3: add CSS class to the bubble which displays the
              // current data selected when the data is available
              if (!range && scope.dataList) {
                var arr = $.grep(scope.dataList, function(e) {
                  return (e.value == scope[refLow] && e.available);
                });

                if (arr.length === 1) {
                  lowBub.addClass('ga-slider-available');
                } else {
                  lowBub.removeClass('ga-slider-available');
                }
              }

              if (!boundToInputs) {
                return setBindings();
              }
            };
            $timeout(updateDOM);
            for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
              w = watchables[_j];
              scope.$watch(w, function(newValue, oldValue, scope) {
                 // RE3: Add test of validty of the value watched
                 if (scope.isValid(newValue)) {
                   scope.lastGoodValue = undefined;
                   newValue = parseFloat(newValue);
                   updateDOM();
                 } else if (!scope.lastGoodValue) {
                   scope.lastGoodValue = oldValue;
                 }
              });
            }

            // RE3: Force the redraw of the slider, useful if the slider is
            // hidden then the value is changed then the slider is displayed.
            // Changing the value when the slider is hidden makes bad
            // calculation of the pointer position
            scope.$watch('redraw', function(needsRedraw) {
              if (needsRedraw) {
                updateDOM();
              }
            });

            // RE3: Add left and right arrows events management
            scope.$watch('useKeyboardEvents', function(active) {
              if (!range && active) {
                $document.bind('keydown', onKeyboardEvent);
              } else {
                $document.unbind('keydown', onKeyboardEvent);
              }
            });

            // RE3: Handle arrows left and right key
            var onKeyboardEvent = function(event) {
              scope.$apply(function() {
                var value = scope.ngModel;
                if (event.which == 37) {
                  scope.ngModel = Math.max(previousValue(value,
                      scope.dataList), scope.floor);
                  event.preventDefault();
                  event.stopPropagation();
                } else if (event.which == 39) {
                  scope.ngModel = Math.min(nextValue(value, scope.dataList),
                      scope.ceiling);
                  event.preventDefault();
                  event.stopPropagation();
                }
              });
            };

            return window.addEventListener('resize', updateDOM);
          }
        };
      }
    };
  });
})();
