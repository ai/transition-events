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
    $.TransitionEvents = {

        // Hash of property name to event name with vendor prefixes.
        // It is used to detect prefix.
        _names: {
            'transition':       'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition':    'transitionend',
            'OTransition':      'oTransitionEnd'
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

}).call(this, jQuery);
