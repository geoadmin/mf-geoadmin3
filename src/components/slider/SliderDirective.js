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
        dataList: '=gaData', //RE3: contains all the possible values
        keyboardEvents: '=gaKeyboardEvents' // RE3: defines if we add keyboard
        //events
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
        scope.range = range = (attributes.ngModel == null) &&
            ((attributes.ngModelLow != null) &&
            (attributes.ngModelHigh != null));

        if (range) {
          refLow = 'ngModelLow';
          refHigh = 'ngModelHigh';
          bindHtml(selBub, 'translate2({value:"Range: " + diff})');
          bindHtml(highBub, 'translate2({value:' + refHigh + '})');
          bindHtml(cmbBub, 'translate2({value:' + refLow + ' + " - " + ' + refHigh +
               '})');

        } else {
          refLow = 'ngModel';
          // Remove useless elements
          angular.forEach([selBar, maxPtr, selBub, highBub, cmbBub], function(elt) {
            elt.remove();
          });
        }

        bindHtml(lowBub, 'translate2({value:' + refLow + '})');

        // Defines watchables properties
        watchables = [refLow, 'floor', 'ceiling'];
        if (range) {
          watchables.push(refHigh);
        }

        return {
          post: function(scope, element, attributes) {
            var barWidth, boundToInputs, dimensions, maxOffset, maxValue,
            minOffset, minValue, offsetRange, pointerHalfWidth,
            updateDOM, valueRange, w, _j, _len1;

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
              minOffset = 0 - pointerHalfWidth;

              // Before RE3: maxOffset = barWidth - width(minPtr);
              maxOffset = barWidth - pointerHalfWidth;

              minValue = parseFloat(attributes.floor);
              maxValue = parseFloat(attributes.ceiling);
              valueRange = maxValue - minValue;

              // Before RE3: offsetRange = maxOffset - minOffset;
              return offsetRange = barWidth;
            };
            updateDOM = function() {
              var adjustBubbles, bindToInputEvents,
                  fitToBar, percentOffset,
                  percentToOffset, percentToOffsetInt, percentValue,
                  setBindings, setPointers;

              dimensions();
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
                offset(minPtr, pixelize(
                     percentToOffsetInt(newLowValue) - halfWidth(minPtr)));

                offset(lowBub, pixelize(offsetLeft(minPtr) -
                    (halfWidth(lowBub)) + pointerHalfWidth));

                if (range) {
                  newHighValue = percentValue(scope[refHigh]);

                  // Before RE3: offset(maxPtr, percentToOffset(newHighValue)
                  offset(maxPtr, pixelize(
                      percentToOffsetInt(newHighValue) - halfWidth(maxPtr)));

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
                //fitToBar(lowBub);
                bubToAdjust = highBub;
                if (range) {
                  fitToBar(highBub);
                  fitToBar(selBub);
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
                var onEnd, onMove, onStart, getMouseEventX, getMouseOffsetLeft,
                    lastMouseOffsetLeft, lastPointerOffsetLeft;

                getMouseEventX = function(event) {
                  // RE3: if event is a Jquery event
                  if (event.originalEvent) {
                    event = event.originalEvent;
                  }

                  return event.clientX || event.touches[0].clientX;
                };

                getMouseOffsetLeft = function(eventX) {
                  return eventX - element[0].getBoundingClientRect().left;
                };

                onEnd = function() {
                  pointer.removeClass('active');
                  $document.unbind(events.move);
                  return $document.unbind(events.end);
                };

                onMove = function(event) {
                  var newOffset, newPercent, newValue;

                  // Get the current mouse cursor offset and calculate the diff
                  // with the cursor offset of the last mouse move event
                  var currentMouseOffsetLeft = getMouseOffsetLeft(
                      getMouseEventX(event));
                  var diff = currentMouseOffsetLeft - lastMouseOffsetLeft;

                  // Get the new pointer offset
                  newOffset = lastPointerOffsetLeft + diff;
                  newOffset = Math.max(Math.min(newOffset, maxOffset),
                      minOffset);

                  // Set offset values for next mouse event
                  lastMouseOffsetLeft = currentMouseOffsetLeft;
                  lastPointerOffsetLeft = newOffset;

                  // Get the current slider values with the new pointer offset
                  newPercent = percentOffset(newOffset);
                  newValue = minValue + (valueRange * newPercent / 100.0);

                  if (range) {
                    if (ref === refLow) {
                      if (newValue > scope[refHigh]) {
                        ref = refHigh;
                        minPtr.removeClass('active');
                        maxPtr.addClass('active');
                      }
                    } else {
                      if (newValue < scope[refLow]) {
                        ref = refLow;
                        maxPtr.removeClass('active');
                        minPtr.addClass('active');
                      }
                    }
                  }
                  newValue = roundStep(newValue, parseInt(scope.precision),
                      parseFloat(scope.step), parseFloat(scope.floor));
                  scope[ref] = newValue;
                  return scope.$apply();
                };
                onStart = function(event) {
                  lastMouseOffsetLeft = getMouseOffsetLeft(
                      getMouseEventX(event));
                  lastPointerOffsetLeft = offsetLeft(pointer);
                  pointer.addClass('active');
                  dimensions();
                  event.stopPropagation();
                  event.preventDefault();
                  $document.bind(events.move, onMove);
                  return $document.bind(events.end, onEnd);
                };
                return pointer.bind(events.start, onStart);
              };

              setBindings = function() {
                var bind, inputMethod, _j, _len1, _ref2, _results;

                boundToInputs = true;
                bind = function(method) {
                  bindToInputEvents(minPtr, refLow, inputEvents[method]);
                  return bindToInputEvents(maxPtr, refHigh,
                      inputEvents[method]);
                };
                _ref2 = ['touchIE', 'touch', 'mouse'];
                _results = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  inputMethod = _ref2[_j];
                  _results.push(bind(inputMethod));
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
                  lowBub.addClass('available');
                } else {
                  lowBub.removeClass('available');
                }
              }

              if (!boundToInputs) {
                return setBindings();
              }
            };
            $timeout(updateDOM);
            for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
              w = watchables[_j];
              scope.$watch(w, updateDOM);
            }

            // RE3: Add left and right arrows events management
            scope.$watch('keyboardEvents', function(active) {
              if (!range && active) {
                $document.bind('keydown', onKeyboardEvent);
              } else {
                $document.unbind('keydown', onKeyboardEvent);
              }
            });

            // RE3: Handle arrows left and right key
            var onKeyboardEvent = function(event) {
              event.stopPropagation();
              event.preventDefault();
              scope.$apply(function() {
                var value = scope.ngModel;
                if (event.which == 37) {
                  scope.ngModel = Math.max(--value, scope.floor);
                } else if (event.which == 39) {
                  scope.ngModel = Math.min(++value, scope.ceiling);
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

