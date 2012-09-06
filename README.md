# jQuery Transition Events Plugin

CSS Transition allows to write simple animation directly in CSS. It’s simpler,
faster and cleaner, that JavaScript animation by `jQuery.fn.animate`.
But sometimes we need good old complete callback in JavaScript for
CSS Transitions animation (for example, if our animation isn’t so simple).

This jQuery plugin allows to set listeners to [CSS Transitions] animation end or
specific part:

CSS with transitions:
```css
.slider {
    transition: left 600ms;
    left: 0;
    }
    .slider.video-position {
        left: -100px;
        }
    .slider.audio-position {
        left: -100px;
        }

.fliper {
    transition: transform 600ms;
    transform: rotateY(0);
    }
    .fliper.rotate {
        transform: rotateY(180deg);
        }
```

JavaScript with callbacks:
```js
var slider = $('.slider');

// Bind synchronized listener to end of all future transitions.
slider.transitionEnd(function () {
    if ( slider.hasClass('video-position') ) {
        autoPlayVideo();
    }
});
$('.show-video').click(function () {
    slider.addClass('video-position');
});

// Or execute callback after current transition end.
$('.show-audio').click(function () {
    slider.addClass('audio-position').afterTransition(function () {
        autoPlayAudio();
    });
});

// Run callback in the middle of transition.
$('.fliper').addClass('rotate').afterTransition(0.5, function () {
    $(this).find('.backface').show();
});
```

Plugin requires jQuery 1.8 or higher.

Sponsored by [Evil Martians].

[CSS Transitions]: https://developer.mozilla.org/en-US/docs/CSS/Using_CSS_transitions
[Evil Martians]:   http://evilmartians.com/

Method `$.fn.transitionEnd` will add listeners for all `transitionend` events,
not just current. Method `$.fn.afterTransition` will call callback only once,
after transition end.

## $.fn.transitionEnd

Modern browsers have `transitionend` event. But some browsers require
vendor prefix for event name. This plugin hides vendor prefix problem from you.

If transition is set for several properties, `$.fn.transitionEnd` will execute
callback on every property. For example:

```css
.car {
    transition-property: top, left;
    transition-duration: 1s,  4s;
    transition-delay:    1s;
    }
```

```js
$('.car').transitionEnd(function (e) {
    console.log(e.propertyName + ' ' + e.elapsedTime);
});

$('.car').addClass('at-home');
```

This code will print `"top 1"` and `"left 4"`.

Note, if transition is canceled before finishing (for example, you add
transition to hover effect, and object looses hover, before transition
will ends), `$.fn.transitionEnd` won’t execute callback.

## $.fn.afterTransition

Plugin has additional `$.fn.afterTransition` function to execute callback after
transition end `delay + (durationPart * duration)`. If browser doesn’t have
CSS Transition support, callbacks will be called immediately (because there is
no animation).

Main difference with `$.fn.transitionEnd` is that this method executes callback
only once, `$.fn.transitionEnd` will add callback for all future transitions.

If transition is set for several properties, `$.fn.transitionEnd` will execute
callback on every property.

Note, that function doesn’t check, that transition is really finished (it can be
canceled in the middle) and it doesn’t really synchronized with transition.

## Event object

Callbacks get object with properties:
* `type` – event name. For `transitionend` event it will be often have
   vendor prefix. For `$.fn.afterTransition` it will be `aftertransition`.
* `currentTarget` – DOM node with CSS transition.
* `propertyName` – CSS property name, which has transition. it will be empty,
  if CSS Transitions aren’t supported.
* `elapsedTime` – number of seconds the transition had been running at the time
  the event fired. This value isn't affected by the value of `transition-delay`.
  It will be zero, if CSS Transitions isn’t supported.

If CSS Transition is supported, `$.fn.transitionEnd` will send original browser
event to callback (with this properties too). If you use `$.fn.afterTransition`
or there is no CSS Transitions support, callback will receive simple object
with just these 4 properties.

## Extra

Free additional present from plugin: you can check CSS Transition support:

```js
if ( $.TransitionEvents.isSupported() ) {
    // CSS Transitions is supported
}
```

## Installing

### Ruby on Rails

For Ruby on Rails you can use gem for Assets Pipeline.

1. Add `transition_events_js` gem to `Gemfile`:

   ```ruby
   gem "transition_events_js"
   ```

2. Install gems:

   ```sh
   bundle install
   ```

3. Include plugin to your `application.js.coffee`:

   ```coffee
   #= require transition-events
   ```

### Others

If you don’t use any assets packaging manager (that’s very bad idea), you can use
already minified version of the library.
Take it from: <https://github.com/ai/transition-events/downloads>.

## Contributing

Open `test.html` in repository to run intergration tests.

## License

Plugin is licensed under the GNU Lesser General Public License version 3.
See the LICENSE file or http://www.gnu.org/licenses/lgpl.html.

## Author

Andrey “A.I.” Sitnik <andrey@sitnik.ru>
