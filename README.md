# jQuery Transition Events Plugin

CSS Transition allows to write simple animation directly in CSS. It’s simpler,
faster and cleaner, that JavaScript animation by `jQuery.fn.animate`.
But sometimes we need good old complete callback in JavaScript for
CSS Transitions animation.

This jQuery plugin allows to set listeners to [CSS Transitions] animation end or
specific part. Plugin requires jQuery 1.8 or higher.

Method `$.fn.transitionEnd` adds listener for all `transitionend` future events.
Method `$.fn.afterTransition` executes callback only once, after transition end.

CSS with transitions:
```css
.slider {
    transition: left 600ms;
    }
    .slider.video-position {
        left: -100px;
        }
    .slider.audio-position {
        left: -200px;
        }

.fliper {
    transition: transform 600ms;
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

Sponsored by [Evil Martians].

[CSS Transitions]: https://developer.mozilla.org/en-US/docs/CSS/Using_CSS_transitions
[Evil Martians]:   http://evilmartians.com/

## $.fn.afterTransition

Plugin has `$.fn.afterTransition` function to execute callback after transition
end `delay + (durationPart * duration)`. If browser doesn’t support
CSS Transitions, callbacks will be called immediately (because there will be no animation).

Main difference with `$.fn.transitionEnd` is that this method executes callback
only once, `$.fn.transitionEnd` will add callback for all future transitions.
Also this function doesn’t check, that transition is really finished (it can be
canceled in the middle).

Callback often will be synchronized with `transitionend` by
`requestAnimationFrame` hack.

If transition is set for several properties, `$.fn.transitionEnd` will execute
callback on every property.

## $.fn.transitionEnd

Modern browsers have `transitionend` event. This plugin hides vendor prefix
problem from you.

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
}).addClass('at-home');
```

This code will print `"top 1"` and `"left 4"`.

If transition is canceled before finishing `$.fn.transitionEnd` won’t execute
callback (for example, you add transition to hover, and object looses hover in the
middle of animation).

## Event object

Callbacks get object with properties:
* `type` – event name: `transitionend` (be often with vendor prefix) or 
  `aftertransition`.
* `currentTarget` – DOM node with CSS transition.
* `propertyName` – CSS property name, which has transition. it will be empty,
  if CSS Transitions aren’t supported.
* `elapsedTime` – number of seconds the transition had been running at the time
  the event fired. This value isn't affected by the value of `transition-delay`.
  It will be zero, if CSS Transitions isn’t supported.

## Extra

Free additional present from plugin: you can check CSS Transitions support:

```js
if ( $.Transitions.isSupported() ) {
    // CSS Transitions is supported
}
```

Also you can call `requestAnimationFrame`  with polyfill and vendor prefixes
autodetection:

```js
$.Transitions.animFrame(function () {
    // Draw something
});
```

## Installing

### Ruby on Rails

For Ruby on Rails you can use gem for Assets Pipeline.

1. Add `transition-events-js` gem to `Gemfile`:

   ```ruby
   gem "transition-events-js"
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
Take it from: [github.com/ai/transition-events/downloads].

[github.com/ai/transition-events/downloads]: https://github.com/ai/transition-events/downloads

## Contributing

Open `test.html` in repository to run intergration tests.

## License

Plugin is licensed under the GNU Lesser General Public License version 3.
See the LICENSE file or [gnu.org/licenses/lgpl.html].

[gnu.org/licenses/lgpl.html]: http://gnu.org/licenses/lgpl.html

## Author

Andrey “A.I.” Sitnik <andrey@sitnik.ru>
