/*
 * Copyright 2012 Andrey “A.I.” Sitnik <andrey@sitnik.ru>,
 * sponsored by Evil Martians.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

;(function($) {
    "use strict";

    // Common methods and properties for jQuery Transition Events plugin.
    // Mostly for internal usage, but maybe helpful for some hack stuff:
    //
    //   if ( $.TransitionEvents.isSupported() ) {
    //       // CSS Transitions is supported
    //   }
    $.TransitionEvents = {

        // Hash of property name to event name with vendor prefixes.
        // It is used to detect prefix.
        _names: {
            // Webkit must be on bottom, because Opera try to use webkit
            // prefix.
            'transition':       'transitionend',
            'OTransition':      'oTransitionEnd',
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition':    'transitionend'
        },

        // Return array of milliseconds for CSS value of `transition-duration`.
        // It’s used in `$.fn.transitionAt`.
        _parseTimes: function (string) {
            var value, array = string.split(/,\s*/);
            for (var i = 0; i < array.length; i++) {
                value = array[i];
                array[i] = parseFloat(value);
                if ( value.match(/\ds/) ) {
                    array[i] = array[i] * 1000;
                }
            }
            return array;
        },

        // Cached event name with vendor prefix. It will be detected by
        // `detectPrefix`. Without transition support it will be `false`.
        cachedEvent: null,

        // Cached transition property name with vendor prefix. It will be
        // detected by `detectPrefix`. Without transition support it will be
        // `false`.
        cachedProp: null,

        // Detect vendor prefix and cache names to `cachedEvent` and
        // `cachedProp`. On first call it return `true` if prefix is founded or
        // `false` if transitions is’t supported. If vendor prefix is already
        // detected, it will return `undefined`.
        detectPrefix: function () {
            if ( typeof(this.cachedEvent) == 'undefined' ) {
                return;
            }

            for ( var prop in this._names ) {
                if ( typeof(document.body.style[prop]) != 'undefined' ) {
                    this.cachedProp  = prop;
                    this.cachedEvent = this._names[prop];
                    return true;
                }
            }

            this.cachedProp  = false;
            this.cachedEvent = false;
            return false;
        },

        // Return `true` if browser support CSS Transitions.
        isSupported: function () {
            this.detectPrefix();
            return this.cachedProp !== false;
        }

    }

    // jQuery node methods.
    $.extend($.fn, {

        // Call `callback`, when current transition will end. Callback will
        // get event object with `propertyName` and `elapsedTime` properties.
        //
        // It just bind to `transitionend` event, but detect vendor prefix and
        // call `callback` immediately without CSS Transitions support.
        //
        // Note, that `callback` will get original event object, not from
        // jQuery.
        //
        //   $('.slider').addClass('to-right').transitionEnd(function () {
        //       playVideo( $(this).find('right-part').find('video') );
        //   });
        transitionEnd: function (callback) {
            if ( !$.TransitionEvents.isSupported() ) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], {
                        type:          'transitionend',
                        elapsedTime:   0,
                        propertyName:  '',
                        currentTarget: this[i],
                    });
                }
                return this;
            }

            var event = $.TransitionEvents.cachedEvent;
            for (var i = 0; i < this.length; i++) {
              this[i].addEventListener(event, function (e) {
                  callback.call(this, e);
              });
            }
            return this;
        },

        // Call `callback`, when part of transition will be passed.
        // So, it call `callback` after `delay + (durationPart * duration)`
        // time.
        //
        // Note, that because JS haven’t any way to detect, that transition
        // is canceled (for example, you add transition to hover effect, and
        // object loose hover, before transition will end, so `transitionend`
        // will be not fired) `transitionAt` anyway will call `callback` in
        // given time.
        //
        //   $('3d-flip').addClass('rotate'),transitionAt(0.5, function () {
        //       var flip = $(this);
        //       // Note, that we do doube check for class,
        //       // not just call toggle.
        //       flip.find('backface').toggle(flip.hasClass('rotate'));
        //   });
        transitionAt: function (durationPart, callback) {
            if ( !$.TransitionEvents.isSupported() ) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], {
                        type:          'transitionat',
                        elapsedTime:   0,
                        propertyName:  '',
                        currentTarget: this[i],
                    });
                }
                return this;
            }

            var prefix = $.TransitionEvents.cachedProp;
            for (var i = 0; i < this.length; i++) {
                var el = $(this[i]);
                var props     = el.css('transition-property').split(/,\s*/);
                var durations = el.css('transition-duration');
                var delays    = el.css('transition-delay');

                durations = $.TransitionEvents._parseTimes(durations);
                delays    = $.TransitionEvents._parseTimes(delays);

                var prop, duration, delay, after;
                for (var j = 0; j < props.length; j++) {
                    prop     = props[j];
                    duration = durations[ durations.length == 1 ? 0 : j ];
                    delay    = delays[ delays.length == 1 ? 0 : j ];
                    after    = delay + (duration * durationPart);

                    (function (el, prop, after) {
                      setTimeout(function () {
                          callback.call(el[0], {
                              type:          'transitionat',
                              elapsedTime:   after / 1000,
                              propertyName:  prop,
                              currentTarget: el[0]
                          });
                      }, after);
                    })(el, prop, after);
                }
            }
            return this;
        }

    });

}).call(this, jQuery);
